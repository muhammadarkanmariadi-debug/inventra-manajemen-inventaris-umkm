from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from prophet import Prophet
import warnings
warnings.filterwarnings("ignore")

app = FastAPI(
    title="AI Stock & Sales Prediction API",
    description="Prediksi stok dan tren penjualan menggunakan Linear Regression + Prophet",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Schema ───────────────────────────────────────────────────────────────────

class SalesRecord(BaseModel):
    product_id: int
    stock: int
    sales: int  # jumlah penjualan per periode

    @validator("sales", pre=True)
    def parse_sales(cls, v):
        return int(v)

class PredictionRequest(BaseModel):
    data: List[SalesRecord]
    forecast_days: Optional[int] = 30  # berapa hari ke depan yang diprediksi

class StockStatus(BaseModel):
    status: str
    message: str
    reorder_point: int
    days_until_stockout: float

class LinearRegressionResult(BaseModel):
    next_period_sales: float
    trend: str
    slope: float
    r_squared: float
    confidence: str

class ProphetForecast(BaseModel):
    ds: str
    yhat: float
    yhat_lower: float
    yhat_upper: float

class PredictionResponse(BaseModel):
    product_id: int
    current_stock: int
    total_sales: int
    average_daily_sales: float
    stock_status: StockStatus
    linear_regression: LinearRegressionResult
    prophet_forecast: List[ProphetForecast]
    recommendation: str

class DefectRecord(BaseModel):
    product_id: int
    total_unreleased: int      # Historically how many batches/units went through QC
    total_rejected: int        # Historically how many were rejected
    current_unreleased_stock: int # How many units are currently pending QC

class DefectPredictionResponse(BaseModel):
    product_id: int
    historical_reject_rate: float
    projected_defects: int
    qc_recommendation: str
    risk_level: str


# ─── Helper Functions ─────────────────────────────────────────────────────────

def analyze_stock_status(stock: int, avg_daily_sales: float, days: int) -> StockStatus:
    if avg_daily_sales <= 0:
        return StockStatus(
            status="UNKNOWN",
            message="Tidak ada data penjualan yang cukup",
            reorder_point=0,
            days_until_stockout=float("inf")
        )

    days_until_stockout = stock / avg_daily_sales
    reorder_point = int(avg_daily_sales * 7)  # safety stock 7 hari

    if days_until_stockout <= 3:
        status = "CRITICAL"
        message = f"⚠️ Stok kritis! Akan habis dalam {days_until_stockout:.1f} hari"
    elif days_until_stockout <= 7:
        status = "LOW"
        message = f"🔶 Stok rendah. Segera lakukan reorder dalam {days_until_stockout:.1f} hari"
    elif days_until_stockout <= 14:
        status = "WARNING"
        message = f"🟡 Stok perlu dipantau. Estimasi habis dalam {days_until_stockout:.1f} hari"
    else:
        status = "SAFE"
        message = f"✅ Stok aman. Estimasi habis dalam {days_until_stockout:.1f} hari"

    return StockStatus(
        status=status,
        message=message,
        reorder_point=reorder_point,
        days_until_stockout=round(days_until_stockout, 2)
    )


def run_linear_regression(sales_list: List[int]) -> LinearRegressionResult:
    if len(sales_list) < 2:
        # Tidak cukup data, pakai estimasi sederhana
        return LinearRegressionResult(
            next_period_sales=float(sales_list[0]) if sales_list else 0,
            trend="INSUFFICIENT_DATA",
            slope=0,
            r_squared=0,
            confidence="LOW"
        )

    X = np.array(range(len(sales_list))).reshape(-1, 1)
    y = np.array(sales_list, dtype=float)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = LinearRegression()
    model.fit(X_scaled, y)

    r_squared = model.score(X_scaled, y)
    slope = model.coef_[0]

    # Prediksi periode berikutnya
    next_x = scaler.transform([[len(sales_list)]])
    next_pred = model.predict(next_x)[0]

    # Tentukan tren
    if slope > 0.5:
        trend = "NAIK"
    elif slope < -0.5:
        trend = "TURUN"
    else:
        trend = "STABIL"

    # Confidence berdasarkan R²
    if r_squared >= 0.8:
        confidence = "TINGGI"
    elif r_squared >= 0.5:
        confidence = "SEDANG"
    else:
        confidence = "RENDAH"

    return LinearRegressionResult(
        next_period_sales=round(max(0, next_pred), 2),
        trend=trend,
        slope=round(slope, 4),
        r_squared=round(r_squared, 4),
        confidence=confidence
    )


def run_prophet_forecast(sales_list: List[int], forecast_days: int) -> List[ProphetForecast]:
    if len(sales_list) < 2:
        # Tidak cukup data untuk Prophet, buat simple forecast
        avg = np.mean(sales_list) if sales_list else 0
        from datetime import datetime, timedelta
        today = datetime.today()
        return [
            ProphetForecast(
                ds=(today + timedelta(days=i+1)).strftime("%Y-%m-%d"),
                yhat=round(avg, 2),
                yhat_lower=round(avg * 0.8, 2),
                yhat_upper=round(avg * 1.2, 2)
            )
            for i in range(min(forecast_days, 7))
        ]

    # Buat date range dari hari ini mundur
    from datetime import datetime, timedelta
    today = datetime.today()
    dates = [(today - timedelta(days=len(sales_list) - i - 1)).strftime("%Y-%m-%d")
             for i in range(len(sales_list))]

    df = pd.DataFrame({"ds": pd.to_datetime(dates), "y": sales_list})

    model = Prophet(
        daily_seasonality=False,
        weekly_seasonality=len(sales_list) >= 7,
        yearly_seasonality=False,
        interval_width=0.80
    )
    model.fit(df)

    future = model.make_future_dataframe(periods=forecast_days)
    forecast = model.predict(future)

    # Ambil hanya forecast ke depan
    forecast_future = forecast.tail(forecast_days)

    return [
        ProphetForecast(
            ds=row["ds"].strftime("%Y-%m-%d"),
            yhat=round(max(0, row["yhat"]), 2),
            yhat_lower=round(max(0, row["yhat_lower"]), 2),
            yhat_upper=round(max(0, row["yhat_upper"]), 2)
        )
        for _, row in forecast_future.iterrows()
    ]


def generate_recommendation(
    stock_status: StockStatus,
    lr_result: LinearRegressionResult,
    avg_daily_sales: float,
    forecast_days: int
) -> str:
    parts = []

    # Rekomendasi berdasarkan status stok
    if stock_status.status == "CRITICAL":
        parts.append(f"🚨 SEGERA lakukan pemesanan ulang minimal {stock_status.reorder_point} unit.")
    elif stock_status.status == "LOW":
        parts.append(f"📦 Rencanakan reorder {stock_status.reorder_point} unit dalam 2-3 hari ke depan.")
    elif stock_status.status == "WARNING":
        parts.append(f"📋 Monitor stok dan siapkan PO untuk {stock_status.reorder_point} unit.")
    else:
        parts.append(f"✅ Stok dalam kondisi baik.")

    # Rekomendasi berdasarkan tren
    if lr_result.trend == "NAIK":
        parts.append(f"📈 Tren penjualan NAIK (slope: {lr_result.slope}). Pertimbangkan menambah stok untuk mengantisipasi permintaan.")
    elif lr_result.trend == "TURUN":
        parts.append(f"📉 Tren penjualan TURUN (slope: {lr_result.slope}). Kurangi pembelian stok untuk menghindari penumpukan.")
    else:
        parts.append(f"➡️ Tren penjualan STABIL. Pertahankan pola pemesanan saat ini.")

    # Proyeksi penjualan
    projected = avg_daily_sales * forecast_days
    parts.append(f"🔮 Proyeksi penjualan {forecast_days} hari ke depan: ±{projected:.0f} unit.")

    return " | ".join(parts)


# ─── Endpoint ─────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "message": "AI Stock & Sales Prediction API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.post("/predict", response_model=List[PredictionResponse])
def predict(request: PredictionRequest):
    if not request.data:
        raise HTTPException(status_code=400, detail="Data tidak boleh kosong")

    # Kelompokkan data per product_id
    from collections import defaultdict
    grouped = defaultdict(list)
    for record in request.data:
        grouped[record.product_id].append(record)

    results = []

    for product_id, records in grouped.items():
        sales_list = [r.sales for r in records]
        current_stock = records[-1].stock  # stok terbaru
        total_sales = sum(sales_list)
        avg_daily_sales = total_sales / len(sales_list)

        # Analisis stok
        stock_status = analyze_stock_status(current_stock, avg_daily_sales, request.forecast_days)

        # Linear Regression
        lr_result = run_linear_regression(sales_list)

        # Prophet Forecast
        prophet_result = run_prophet_forecast(sales_list, request.forecast_days)

        # Rekomendasi
        recommendation = generate_recommendation(
            stock_status, lr_result, avg_daily_sales, request.forecast_days
        )

        results.append(PredictionResponse(
            product_id=product_id,
            current_stock=current_stock,
            total_sales=total_sales,
            average_daily_sales=round(avg_daily_sales, 2),
            stock_status=stock_status,
            linear_regression=lr_result,
            prophet_forecast=prophet_result,
            recommendation=recommendation
        ))

    return results


@app.post("/predict/single", response_model=PredictionResponse)
def predict_single(record: SalesRecord, forecast_days: int = 30):
    """Prediksi untuk satu data poin (data historis minimal)"""
    sales_list = [record.sales]
    avg_daily_sales = float(record.sales)

    stock_status = analyze_stock_status(record.stock, avg_daily_sales, forecast_days)
    lr_result = run_linear_regression(sales_list)
    prophet_result = run_prophet_forecast(sales_list, forecast_days)
    recommendation = generate_recommendation(stock_status, lr_result, avg_daily_sales, forecast_days)

    return PredictionResponse(
        product_id=record.product_id,
        current_stock=record.stock,
        total_sales=record.sales,
        average_daily_sales=avg_daily_sales,
        stock_status=stock_status,
        linear_regression=lr_result,
        prophet_forecast=prophet_result,
        recommendation=recommendation
    )

@app.post("/predict/defect", response_model=DefectPredictionResponse)
def predict_defect(record: DefectRecord):
    """Prediksi probabilitas defect/reject manufacturing berdasarkan data historis"""
    
    # 1. Hitung rasio historis
    if record.total_unreleased <= 0:
        historical_reject_rate = 0.0
    else:
        historical_reject_rate = record.total_rejected / record.total_unreleased

    # 2. Proyeksi defect untuk batch Unreleased yang ada sekarang
    projected_defects = int(round(record.current_unreleased_stock * historical_reject_rate))

    # 3. Tentukan Risk Level
    if historical_reject_rate > 0.15:
        risk_level = "HIGH"
        qc_recommendation = f"⚠️ RISIKO TINGGI: Produk ini memiliki tingkat reject historis {historical_reject_rate*100:.1f}%. Diperlukan Inspeksi QC Ketat! Estimasi defect pada {record.current_unreleased_stock} stok pending adalah {projected_defects} unit."
    elif historical_reject_rate > 0.05:
        risk_level = "MEDIUM"
        qc_recommendation = f"🟡 RISIKO SEDANG: Tingkat reject historis {historical_reject_rate*100:.1f}%. Lakukan sampel QC yang representatif. Estimasi {projected_defects} defect."
    elif historical_reject_rate > 0:
        risk_level = "LOW"
        qc_recommendation = f"✅ RISIKO RENDAH: Tingkat reject historis sangat baik ({historical_reject_rate*100:.1f}%). Inspeksi QC standar sudah cukup."
    else:
        risk_level = "UNKNOWN"
        qc_recommendation = "🔍 DATA KURANG: Belum ada data reject yang tercatat untuk produk ini. Lakukan QC penuh sebagai baseline."

    return DefectPredictionResponse(
        product_id=record.product_id,
        historical_reject_rate=round(historical_reject_rate, 4),
        projected_defects=projected_defects,
        qc_recommendation=qc_recommendation,
        risk_level=risk_level
    )

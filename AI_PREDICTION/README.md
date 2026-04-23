# 🤖 AI Stock & Sales Prediction API

Sistem prediksi stok dan tren penjualan menggunakan **Linear Regression** + **Prophet** dengan **FastAPI**.

## 📦 Instalasi

```bash
# 1. Clone / masuk ke folder project
cd ai-stock-prediction

# 2. Buat virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Jalankan server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```



---

## 📡 Endpoint

### `POST /predict/single`
Prediksi untuk **satu data poin** (sesuai format JSON permintaan).

**Request:**
```json
{
  "product_id": 1,
  "stock": 20,
  "sales": "20"
}
```

**Query param:** `?forecast_days=30` *(opsional, default 30)*

---

### `POST /predict`
Prediksi dengan **data historis** untuk akurasi lebih tinggi (bisa multi-produk).

**Request:**
```json
{
  "forecast_days": 14,
  "data": [
    { "product_id": 1, "stock": 150, "sales": "10" },
    { "product_id": 1, "stock": 140, "sales": "12" },
    { "product_id": 1, "stock": 128, "sales": "15" },
    { "product_id": 1, "stock": 113, "sales": "18" },
    { "product_id": 1, "stock": 95,  "sales": "22" }
  ]
}
```

---

## 📊 Response

```json
{
  "product_id": 1,
  "current_stock": 95,
  "total_sales": 77,
  "average_daily_sales": 15.4,
  "stock_status": {
    "status": "WARNING",
    "message": "🟡 Stok perlu dipantau. Estimasi habis dalam 6.2 hari",
    "reorder_point": 108,
    "days_until_stockout": 6.17
  },
  "linear_regression": {
    "next_period_sales": 25.3,
    "trend": "NAIK",
    "slope": 2.8,
    "r_squared": 0.98,
    "confidence": "TINGGI"
  },
  "prophet_forecast": [
    { "ds": "2024-01-15", "yhat": 24.5, "yhat_lower": 20.1, "yhat_upper": 28.9 }
  ],
  "recommendation": "📋 Monitor stok... | 📈 Tren NAIK... | 🔮 Proyeksi..."
}
```

### Status Stok

| Status   | Kondisi                    |
|----------|----------------------------|
| SAFE     | Stok > 14 hari penjualan   |
| WARNING  | Stok 7–14 hari penjualan   |
| LOW      | Stok 3–7 hari penjualan    |
| CRITICAL | Stok < 3 hari penjualan    |

### Tren Linear Regression

| Tren   | Kondisi          |
|--------|------------------|
| NAIK   | slope > 0.5      |
| STABIL | -0.5 ≤ slope ≤ 0.5 |
| TURUN  | slope < -0.5     |

---

## 🧪 Test

```bash
python test_api.py
```

---

## 🛠 Tech Stack

- **FastAPI** — REST API framework
- **Prophet** — Time series forecasting (Facebook/Meta)
- **Scikit-learn** — Linear Regression
- **Pandas / NumPy** — Data processing
- **Pydantic** — Input validation

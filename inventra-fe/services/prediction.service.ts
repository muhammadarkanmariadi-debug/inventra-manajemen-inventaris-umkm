import axios from 'axios';
import type { SalesRecord, PredictionResult, DefectRecord, DefectPredictionResponse } from '../types';

const PREDICTION_API_URL = 'http://127.0.0.1:8001';

/**
 * Prediksi stok dan penjualan untuk satu data poin (single record).
 * POST /predict/single
 */
export async function predictSingle(
  record: SalesRecord,
  forecastDays: number = 30
): Promise<PredictionResult> {
  const response = await axios.post<PredictionResult>(
    `${PREDICTION_API_URL}/predict/single`,
    record,
    { params: { forecast_days: forecastDays } }
  );
  return response.data;
}

/**
 * Prediksi stok dan penjualan untuk batch data (beberapa produk / historis).
 * POST /predict
 */
export async function predictBatch(
  data: SalesRecord[],
  forecastDays: number = 14
): Promise<PredictionResult[]> {
  const response = await axios.post<PredictionResult[]>(
    `${PREDICTION_API_URL}/predict`,
    { data, forecast_days: forecastDays }
  );
  return response.data;
}

/**
 * Prediksi probabilitas defect/reject manufacturing.
 * POST /predict/defect
 */
export async function predictDefect(data: DefectRecord): Promise<DefectPredictionResponse> {
  const response = await axios.post<DefectPredictionResponse>(
    `${PREDICTION_API_URL}/predict/defect`,
    data
  );
  return response.data;
}

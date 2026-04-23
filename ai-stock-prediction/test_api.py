"""
Contoh penggunaan API - jalankan dengan: python test_api.py
Pastikan server sudah berjalan: uvicorn app.main:app --reload
"""

import requests
import json

BASE_URL = "http://localhost:8001"

# ─── Test 1: Single Record (sesuai format permintaan user) ────────────────────
print("=" * 60)
print("TEST 1: Single Record")
print("=" * 60)

payload_single = {
    "product_id": 1,
    "stock": 20,
    "sales": "20"  # string diterima dan dikonversi otomatis
}

resp = requests.post(f"{BASE_URL}/predict/single", json=payload_single)
print(json.dumps(resp.json(), indent=2, ensure_ascii=False))


# ─── Test 2: Multiple Records (data historis per produk) ──────────────────────
print("\n" + "=" * 60)
print("TEST 2: Multiple Records dengan Historis")
print("=" * 60)

payload_multi = {
    "forecast_days": 14,
    "data": [
        {"product_id": 1, "stock": 150, "sales": "10"},
        {"product_id": 1, "stock": 140, "sales": "12"},
        {"product_id": 1, "stock": 128, "sales": "15"},
        {"product_id": 1, "stock": 113, "sales": "18"},
        {"product_id": 1, "stock": 95,  "sales": "20"},
        {"product_id": 1, "stock": 75,  "sales": "22"},
        {"product_id": 1, "stock": 53,  "sales": "25"},
   
        {"product_id": 2, "stock": 200, "sales": "30"},
        {"product_id": 2, "stock": 175, "sales": "25"},
        {"product_id": 2, "stock": 155, "sales": "20"},
        {"product_id": 2, "stock": 140, "sales": "15"},
        {"product_id": 2, "stock": 130, "sales": "10"},
    ]
}

resp = requests.post(f"{BASE_URL}/predict", json=payload_multi)
print(json.dumps(resp.json(), indent=2, ensure_ascii=False))

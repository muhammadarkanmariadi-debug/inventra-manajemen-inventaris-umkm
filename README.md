
```md
<div align="center">

<br/>

# INVENTRA

**Platform Manajemen Inventaris & Distribusi untuk Industri Menengah Indonesia**

*Batch tracking · Manajemen status QC · Dokumen operasional otomatis · Prediksi stok berbasis AI*

<br/>

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![MariaDB](https://img.shields.io/badge/MariaDB-10.x-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.x-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📚 Daftar Isi

1. Tentang Proyek  
2. Research Question  
3. Why This Project  
4. Value Utama  
5. Fitur Utama  
6. Arsitektur Sistem  
7. Tech Stack  
8. Prasyarat  
9. Instalasi & Konfigurasi  
10. Role & Hak Akses  
11. Demo Credential  
12. Dokumentasi API AI  
13. Studi Kasus  
14. Target Industri  
15. Rencana Pengembangan  
16. Tim Pengembang  
17. Lisensi  

---

## 🎯 Tentang Proyek

Perusahaan manufaktur dan distribusi skala menengah di Indonesia masih banyak yang mengandalkan spreadsheet atau pencatatan manual dalam mengelola inventaris.

Seiring meningkatnya jumlah SKU dan kompleksitas operasional, pendekatan ini menyebabkan:

- Minimnya visibilitas stok secara real-time  
- Tidak adanya pelacakan batch yang akurat  
- Ketidaksinkronan data antara gudang, QC, dan manajemen  
- Lambatnya proses operasional dan pengambilan keputusan  

Di sisi lain, solusi inventory modern yang tersedia di pasar:

- Terlalu kompleks  
- Terlalu mahal  
- Tidak sesuai dengan alur kerja lokal Indonesia  

**Inventra hadir untuk mengisi gap tersebut.**

> ✔ Cukup powerful untuk batch tracking & QC  
> ✔ Cukup sederhana tanpa tim IT khusus  
> ✔ Cukup lokal untuk dokumen operasional Indonesia  

---

## ❓ Research Question

> Apakah sistem inventaris modern dapat meningkatkan akurasi pelacakan barang dan efisiensi operasional serta mengurangi ketergantungan pada proses manual di industri manufaktur dan distribusi?

---

## 💡 Why This Project?

Banyak sistem inventory tersedia, tetapi:

- Over-engineered  
- Tidak sesuai workflow distribusi Indonesia  
- Tidak menyediakan dokumen operasional  

**Inventra mengambil posisi:**

> “Bukan yang paling kompleks, tapi paling relevan untuk operasional nyata.”

---

## 🚀 Value Utama

Inventra memberikan:

- **End-to-end visibility** pergerakan barang  
- **Data-driven decision** melalui AI  
- **Efisiensi operasional** melalui otomatisasi  

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 📦 Batch Tracking | Tracking barang per batch dari supplier |
| 🔬 Status QC | Status: available, on-hold, unreleased, reject |
| 📄 Dokumen Otomatis | Surat jalan & berita acara reject |
| 🔔 Early Warning | Notifikasi stok minimum & expiry |
| 🤖 AI Prediksi | Prediksi stok & tren penjualan |
| 📊 Laporan | Export Excel/PDF |
| 👥 Role Management | Akses fleksibel |
| 🏢 Multi Gudang | Multi lokasi & tenant |
| ⚡ Performa Tinggi | Swoole + Redis |

---

## 🧠 AI Feature

- Analisis tren penjualan  
- Prediksi kebutuhan stok  
- Estimasi stockout  
- Rekomendasi restock  

### Teknologi:
- Linear Regression  
- Prophet  

---

## 🏗️ Arsitektur Sistem

```

CLIENT (Next.js)
↓
API (Laravel + Swoole)
↓
Database (MariaDB) + Cache (Redis)
↓
AI Service (FastAPI)

````

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS

### Backend
- Laravel 11
- Octane (Swoole)

### AI
- FastAPI
- Prophet
- Scikit-learn

### Infrastructure
- Docker
- Redis
- MariaDB

---

## 📋 Prasyarat

- Docker 24+
- Docker Compose v2+
- Git

---

## 🚀 Instalasi & Konfigurasi

### Clone Repository

```bash
git clone https://github.com/muhammadarkanmariadi-debug/inventra-manajemen-inventaris-umkm.git
cd inventra-manajemen-inventaris-umkm
````

### Jalankan

```bash
# frontend
cd inventra-fe
cp .env.example .env
# backend
cd inventra-be
cp .env.example .env
# AI
lakukan setup sistem ai stock prediction dengan membuka readme miliki ai-stock perdiction


docker compose up -d --build
```

### Setup Database

```bash
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan jwt:secret
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
```

---

## 👥 Role & Hak Akses

| Role        | Akses           |
| ----------- | --------------- |
| Super Admin | Full            |
| Manager     | Operasional     |
| Operator    | Stok            |
| QC          | Quality Control |

Detail lengkap: `docs/role_permission_matrix.html`

---

## 🔑 Demo Credential

```
Super Admin   : superadmin@demo.com / demo1234
Manager       : manager@demo.com / demo1234
Operator      : operator@demo.com / demo1234
QC            : qc@demo.com / demo1234
```

---

## 🤖 Dokumentasi API AI

### POST /predict

```json
{
  "forecast_days": 14,
  "data": [
    { "product_id": 1, "stock": 150, "sales": "10" }
  ]
}
```

---

## 📖 Studi Kasus

**PT Maju Jaya Baya — Distributor Jawa Timur**

### Sebelum:

* Tidak bisa tracking batch
* Status tidak transparan
* Dokumen manual

### Setelah:

* Investigasi: 2–3 hari → menit
* Eliminasi salah kirim
* Dokumen otomatis

---

## 🏭 Target Industri

* Distribusi
* Manufaktur
* Alat kesehatan
* Spare part

---

## 🗺️ Rencana Pengembangan

| Tahap | Target             |
| ----- | ------------------ |
| 1     | Validasi           |
| 2     | Penguatan fitur    |
| 3     | Integrasi WhatsApp |
| 4     | Ekspansi ASEAN     |
| 5     | Ekosistem          |

---


## 📄 Lisensi

MIT License

---

<div align="center">
  <sub>Hackathon Microsoft Elevate Training Center · Manufaktur & Energi</sub>
</div>
```

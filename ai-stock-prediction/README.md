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

## Daftar Isi

1. [Tentang Proyek](#-tentang-proyek)
2. [Fitur Utama](#-fitur-utama)
3. [Arsitektur Sistem](#-arsitektur-sistem)
4. [Tech Stack](#-tech-stack)
5. [Prasyarat](#-prasyarat)
6. [Instalasi & Konfigurasi](#-instalasi--konfigurasi)
   - [Clone Repository](#1-clone-repository)
   - [Environment Backend (Laravel + Swoole)](#2-environment-backend-laravel--swoole)
   - [Environment Frontend (Next.js)](#3-environment-frontend-nextjs)
   - [Environment AI Service (FastAPI)](#4-environment-ai-service-fastapi)
   - [Build & Jalankan dengan Docker Compose](#5-build--jalankan-dengan-docker-compose)
7. [Role & Hak Akses](#-role--hak-akses)
8. [Demo Credential](#-demo-credential)
9. [Dokumentasi API AI](#-dokumentasi-api-ai)
10. [Studi Kasus](#-studi-kasus)
11. [Rencana Pengembangan](#-rencana-pengembangan)
12. [Tim Pengembang](#-tim-pengembang)

---

## 🎯 Tentang Proyek

Perusahaan distribusi skala menengah di Indonesia masih banyak yang mengandalkan spreadsheet atau pencatatan manual dalam mengelola inventaris. Pendekatan ini semakin tidak efisien seiring meningkatnya jumlah SKU, minimnya visibilitas real-time, dan ketidaksinkronan data antara tim gudang, QC, dan manajemen.

**Inventra** hadir sebagai solusi manajemen inventaris berbasis web yang dirancang spesifik untuk kebutuhan distribusi lokal — cukup powerful untuk batch tracking dan manajemen status QC, cukup sederhana untuk diimplementasikan tanpa tim IT khusus, dan cukup lokal untuk menghasilkan dokumen operasional seperti surat jalan dan berita acara reject secara otomatis.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 📦 **Batch Tracking** | Setiap penerimaan supplier membentuk batch tersendiri — barang dapat dilacak hingga ke asal batch dan tanggal masuk |
| 🔬 **Manajemen Status QC** | Status real-time per batch: `available`, `on-hold`, `unreleased`, `reject` |
| 📄 **Dokumen Operasional** | Cetak surat jalan per transaksi dan berita acara reject per batch secara otomatis |
| 🔔 **Early Warning System** | Notifikasi otomatis via in-app, email, atau WhatsApp ketika stok mendekati minimum atau batch hampir expired |
| 🤖 **AI Prediksi Stok** | Analisis tren penjualan dan prediksi kebutuhan restock menggunakan Linear Regression + Prophet |
| 📊 **Laporan Periodik** | Export rekap stok, pergerakan barang, dan barang bermasalah dalam format Excel/PDF |
| 👥 **Role & Akses Fleksibel** | Tambah, hapus, atau modifikasi role sesuai struktur organisasi tanpa bantuan teknis |
| 🏢 **Multi-Gudang** | Dukungan multi-lokasi dan multi-tenant dalam satu platform terpusat |
| 🎨 **Kustomisasi Tampilan** | Preferensi notifikasi, tema warna, dan profil bisnis yang dapat disesuaikan |
| ⚡ **Performa Tinggi** | Backend berbasis Swoole untuk konkurensi tinggi, dikombinasikan dengan caching Redis |

---

## 🏗️ Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│              Next.js 15 · TypeScript · Tailwind CSS          │
│                    SSR / SPA / App Router                    │
└──────────────────────────┬───────────────────────────────────┘
                           │  HTTPS / REST API
┌──────────────────────────▼───────────────────────────────────┐
│                       BACKEND LAYER                          │
│              Laravel 11 · Swoole (Octane)                    │
│          JWT Auth · Business Logic · Queue Workers           │
└──────────┬───────────────────────────────┬───────────────────┘
           │                               │
┌──────────▼───────────┐       ┌───────────▼───────────────────┐
│    DATABASE LAYER    │       │         CACHE LAYER           │
│   MariaDB / MySQL    │       │  Redis (Cache / Queue / Lock) │
│   Relational Data    │       │    Session · Pub/Sub          │
└──────────────────────┘       └───────────────────────────────┘
                               │
               ┌───────────────▼───────────────────────────────┐
               │              AI SERVICE LAYER                  │
               │    FastAPI · Prophet · Scikit-learn · Pandas   │
               │    Linear Regression · Time Series Forecast    │
               └───────────────────────────────────────────────┘
```

Seluruh service dijalankan di dalam container Docker yang terisolasi dan dikelola melalui Docker Compose.

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org)** — React framework dengan App Router, SSR, dan SSG
- **[TypeScript](https://www.typescriptlang.org)** — Type safety untuk codebase yang maintainable
- **[Tailwind CSS](https://tailwindcss.com)** — Utility-first CSS framework

### Backend
- **[Laravel 11](https://laravel.com)** — PHP framework untuk REST API dan business logic
- **[Laravel Octane + Swoole](https://laravel.com/docs/octane)** — Concurrent request handling dengan performa tinggi, menggantikan FrankenPHP

### Database & Cache
- **[MariaDB 10.x](https://mariadb.org)** — Relational database untuk data transaksional
- **[Redis 7.x](https://redis.io)** — Cache, queue jobs, session, dan pub/sub

### AI Service
- **[FastAPI](https://fastapi.tiangolo.com)** — REST API framework untuk layanan prediksi
- **[Prophet](https://facebook.github.io/prophet/)** — Time series forecasting
- **[Scikit-learn](https://scikit-learn.org)** — Linear Regression
- **[Pandas / NumPy](https://pandas.pydata.org)** — Data processing

### Infrastructure
- **[Docker + Docker Compose](https://docs.docker.com/compose/)** — Kontainerisasi seluruh layanan
- **JWT (tymon/jwt-auth)** — Stateless authentication

---

## 📋 Prasyarat

Pastikan sistem Anda telah memiliki software berikut sebelum memulai:

| Software | Versi Minimum | Cek Versi |
|---|---|---|
| Docker Desktop / Docker Engine | 24.x | `docker --version` |
| Docker Compose | v2.x | `docker compose version` |
| Git | 2.x | `git --version` |

> **Catatan:** Node.js, PHP, Python, dan dependency lainnya **tidak perlu diinstal** di mesin host. Semua sudah tersedia di dalam container Docker.

---

## 🚀 Instalasi & Konfigurasi

### 1. Clone Repository

```bash
git clone https://github.com/muhammadarkanmariadi-debug/inventra-manajemen-inventaris-umkm.git
cd inventra-manajemen-inventaris-umkm
```

Struktur direktori proyek:

```
inventra/
├── backend/          # Laravel 11 + Swoole (Octane)
├── frontend/         # Next.js 15
├── ai-service/       # FastAPI prediction service
├── docker-compose.yml
└── README.md
```

---

### 2. Environment Backend (Laravel + Swoole)

Salin file `.env` dari template yang tersedia:

```bash
cp backend/.env.example backend/.env
```




### 3. Environment Frontend (Next.js)

Salin file `.env` dari template yang tersedia:

```bash
cp frontend/.env.example frontend/.env
```


### 4. Environment AI Service (FastAPI)

Buka direktori ai-stock-prediction untuk lihat detail

### 5. Build & Jalankan dengan Docker Compose

#### Jalankan seluruh service sekaligus

```bash
docker compose up -d --build
```

Perintah ini akan:
1. Build image untuk backend (Laravel + Swoole), frontend (Next.js), dan AI service (FastAPI)
2. Menarik image MariaDB dan Redis dari Docker Hub
3. Menjalankan semua container secara bersamaan di background

#### Verifikasi semua container berjalan

```bash
docker compose ps
```

Output yang diharapkan:

```
NAME                 STATUS          PORTS
inventra-backend     Up (healthy)    0.0.0.0:8000->8000/tcp
inventra-frontend    Up (healthy)    0.0.0.0:3000->3000/tcp
inventra-ai          Up              0.0.0.0:8001->8001/tcp
inventra-mariadb     Up (healthy)    3306/tcp
inventra-redis       Up (healthy)    6379/tcp
```

#### Setup database (hanya pertama kali)

Setelah semua container berjalan, jalankan perintah berikut untuk setup database:

```bash
# Generate APP_KEY dan JWT_SECRET
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan jwt:secret

# Jalankan migrasi database
docker compose exec backend php artisan migrate

# Jalankan seeder (data awal + demo credential)
docker compose exec backend php artisan db:seed

# Buat symbolic link storage
docker compose exec backend php artisan storage:link
```

#### Akses aplikasi

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend API (Laravel) | http://localhost:8000/api |
| API Documentation | http://localhost:8000/api/documentation |
| AI Service | http://localhost:8001 |
| AI Docs (Swagger) | http://localhost:8001/docs |

---

#### Perintah Docker yang berguna

```bash
# Lihat log semua service
docker compose logs -f

# Lihat log service tertentu
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f ai-service

# Masuk ke shell container backend
docker compose exec backend bash

# Masuk ke shell container frontend
docker compose exec frontend sh

# Restart service tertentu
docker compose restart backend

# Hentikan semua service
docker compose down

# Hentikan dan hapus volume (HAPUS DATA DATABASE)
docker compose down -v
```

---

## 👥 Role & Hak Akses

Inventra menggunakan sistem role berbasis permission yang dapat dikustomisasi tanpa bantuan teknis.

| Role | Deskripsi Singkat | Akses Utama |
|---|---|---|
| **Super Admin** | Kendali penuh atas seluruh sistem | Semua modul, manajemen pengguna & role, konfigurasi bisnis |
| **Manager** | Pengelolaan operasional harian | Produk, stok, penjualan, keuangan, laporan (tanpa manajemen pengguna) |
| **Operator Gudang** | Eksekusi pergerakan barang | Input transaksi stok, penjualan, stok opname (tanpa akses keuangan penuh) |
| **QC** | Pemeriksaan kualitas barang | Input & edit hasil pemeriksaan QC, visibilitas stok dan batch |

Untuk detail lengkap matrix permission per role, lihat file `docs/role_permission_matrix.html`.

---

## 🔑 Demo Credential

Gunakan akun berikut untuk mencoba aplikasi dengan data yang telah disiapkan:

```
┌─────────────────────────────────────────────────────┐
│  Role          │  Email                 │  Password  │
├─────────────────────────────────────────────────────┤
│  Super Admin   │  superadmin@demo.com   │  demo1234  │
│  Manager       │  manager@demo.com      │  demo1234  │
│  Operator Gudang │ operator@demo.com    │  demo1234  │
│  QC            │  qc@demo.com           │  demo1234  │
└─────────────────────────────────────────────────────┘
```

---

## 🤖 Dokumentasi API AI

AI Service berjalan di `http://localhost:8001`. Dokumentasi interaktif tersedia di `/docs`.

### `POST /predict/single`

Prediksi untuk satu data poin.

**Request Body:**
```json
{
  "product_id": 1,
  "stock": 20,
  "sales": "20"
}
```

**Query Parameter:** `?forecast_days=30` *(opsional, default: 30)*

---

### `POST /predict`

Prediksi dengan data historis untuk akurasi lebih tinggi (mendukung multi-produk).

**Request Body:**
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

### Response

```json
{
  "product_id": 1,
  "current_stock": 95,
  "total_sales": 77,
  "average_daily_sales": 15.4,
  "stock_status": {
    "status": "WARNING",
    "message": "Stok perlu dipantau. Estimasi habis dalam 6.2 hari",
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
    {
      "ds": "2024-01-15",
      "yhat": 24.5,
      "yhat_lower": 20.1,
      "yhat_upper": 28.9
    }
  ],
  "recommendation": "Monitor stok secara ketat. Tren penjualan meningkat, pertimbangkan restock segera."
}
```

### Status Stok

| Status | Kondisi |
|---|---|
| `SAFE` | Stok cukup untuk > 14 hari penjualan |
| `WARNING` | Stok cukup untuk 7–14 hari penjualan |
| `LOW` | Stok cukup untuk 3–7 hari penjualan |
| `CRITICAL` | Stok cukup untuk < 3 hari penjualan |

### Tren (Linear Regression)

| Tren | Kondisi |
|---|---|
| `NAIK` | slope > 0.5 |
| `STABIL` | -0.5 ≤ slope ≤ 0.5 |
| `TURUN` | slope < -0.5 |

---

## 📖 Studi Kasus

**PT Maju Jaya Baya** — Distributor barang konsumsi, Jawa Timur  
35 karyawan · 2 gudang · 500+ SKU aktif

**Masalah sebelum menggunakan Inventra:**

1. **Stok tidak terlacak per batch.** Ketika ada komplain kualitas, investigasi asal barang membutuhkan 2–3 hari secara manual dan sering tidak menemukan kepastian.
2. **Status barang tidak transparan.** Barang yang sedang ditahan QC tidak terpisah dari barang siap jual di sistem, pernah menyebabkan barang *on-hold* ikut terkirim ke customer dan berujung retur.
3. **Dokumen operasional dibuat manual.** Proses penulisan surat jalan memakan waktu 15–20 menit per transaksi dan rawan kesalahan.

**Hasil setelah implementasi:**

- Investigasi batch dapat dilakukan dalam hitungan menit
- Eliminasi risiko barang salah status terkirim berkat visibilitas real-time
- Waktu pembuatan dokumen turun signifikan dengan generate otomatis per transaksi

---

## 🗺️ Rencana Pengembangan

| Tahap | Target | Deskripsi |
|---|---|---|
| **Tahap 1** | Saat ini | Validasi produk, akuisisi pelanggan pertama |
| **Tahap 2** | Q3 2025 | Penguatan fitur: laporan lanjutan, notifikasi WhatsApp |
| **Tahap 3** | Q1 2026 | Input data via WhatsApp dengan sinkronisasi otomatis ke sistem |
| **Tahap 4** | Q3 2026 | Ekspansi ke pasar Asia Tenggara |
| **Tahap 5** | 2027+ | Platform ekosistem: menghubungkan distributor, supplier, dan layanan keuangan |

---


> Sistem berjalan di environment lokal menggunakan Docker yang terkontainerisasi. Demo langsung tersedia saat aplikasi sudah di-build dengan data yang telah disiapkan. Baca bagian [Instalasi](#-instalasi--konfigurasi) di atas sebagai panduan lengkap.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Lihat file `LICENSE` untuk informasi lebih lanjut.

---

<div align="center">
  <sub>Dibuat untuk Hackathon Microsoft Elevate Training Center · Topik: Manufaktur & Energi</sub>
</div>
# Inventra - Manajemen Inventaris Distributor Modern

**Inventra** adalah sistem manajemen inventaris komprehensif yang dirancang khusus untuk memenuhi kebutuhan distributor dan UMKM. Sistem ini mengintegrasikan pengelolaan stok, transaksi penjualan, pembelian, hingga proyeksi stok berbasis AI untuk membantu pengambilan keputusan yang lebih akurat.

## 🚀 Fitur Utama

- **Multi-Tenant Business Management**: Kelola beberapa unit bisnis atau cabang dalam satu platform.
- **Inventory Control & Logs**: Pelacakan stok real-time dengan log riwayat mutasi barang yang mendetail.
- **Sales & Purchase Workflow**: Manajemen siklus lengkap dari pembelian ke supplier hingga penjualan ke pelanggan.
- **AI Stock Forecasting**: Prediksi kebutuhan stok masa depan menggunakan algoritma *Prophet* untuk meminimalisir *stockout* atau *overstock*.
- **Financial Tracking**: Monitoring arus kas masuk dan keluar yang terintegrasi dengan transaksi operasional.
- **Role-Based Access Control (RBAC)**: Keamanan akses data berdasarkan peran pengguna (Admin, Gudang, Sales, dll).
- **Export Data & Reporting**: Unduh laporan dalam format Excel (.xlsx) dan PDF untuk kebutuhan administrasi.
- **QR Code Integration**: Dukungan pemindaian QR Code untuk identifikasi produk dan inventaris yang lebih cepat.

## 🛠️ Tech Stack

### Frontend (Next.js)
- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: Material UI (MUI), Tailwind CSS, Radix UI.
- **State & Data**: Axios, Cookies-next.
- **Visualisasi**: ApexCharts, MUI X Charts.
- **Fitur Tambahan**: XLSX (Excel), React-PDF, Firebase Auth, QR Scanner.

### Backend (Laravel)
- **Framework**: Laravel 12 (PHP 8.2+)
- **Sistem Auth**: Laravel Passport & Sanctum, Firebase JWT.
- **Database**: MySQL 8.0 & Redis untuk Caching.
- **Modularitas**: Spatie Laravel Permission untuk manajemen hak akses.
- **Broadcasting**: Laravel Reverb untuk notifikasi real-time (jika diaktifkan).

### AI Service (FastAPI)
- **Framework**: FastAPI (Python)
- **Forecasting Model**: Facebook Prophet.
- **Data Processing**: Pandas, Numpy, Scikit-learn.
- **Visualisasi AI**: Plotly.

## 📦 Instalasi & Setup

Proyek ini telah dikonfigurasi penuh menggunakan **Docker Compose** untuk memudahkan deployment dan pengembangan di lingkungan lokal tanpa perlu meng-install dependencies secara manual pada sistem operasi host.

### Prasyarat:
Pastikan sistem operasi Anda telah memasang:
- **Docker**
- **Docker Compose**

### Langkah-langkah Menjalankan Aplikasi:

1. Clone repositori ini (jika belum).
2. Setup environment untuk Backend dan Frontend (Salin file `.env.example` menjadi `.env` di masing-masing direktori). Anda bisa melakukannya dengan command:
   ```bash
   cp inventra-be/.env.example inventra-be/.env
   cp inventra-fe/.env.example inventra-fe/.env
   # Silahkan sesuaikan isi .env jika perlu, terutama konfigurasi database & API Key.
   ```
3. Bangun dan jalankan seluruh container melalui Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
4. Setelah container berjalan, Anda perlu meng-generate *app key*, menjalankan migrasi, dan seed untuk database (hanya dilakukan sekali di awal). Jalankan di dalam container backend:
   ```bash
   docker exec -it inventra_be php artisan key:generate
   docker exec -it inventra_be php artisan migrate --seed
   ```

Setelah langkah di atas selesai, layanan akan tersedia di:
- **Frontend / Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **AI Prediction Service**: [http://localhost:8001](http://localhost:8001)

Untuk menghentikan semua layanan:
```bash
docker-compose down
```


## 🏗️ Struktur Arsitektur

- `inventra-fe/`: Source code aplikasi client (Web Dashboard).
- `inventra-be/`: Source code core API, logika bisnis, dan manajemen data.
- `ai-stock-prediction/`: Layanan microservice untuk analisis data dan prediksi stok.

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

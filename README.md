<div align="center">

# 📦 UMKM Inventory & Finance Management System

**Platform terintegrasi untuk manajemen inventaris, stok, penjualan, dan keuangan UMKM — semua dalam satu tempat.**

<br/>

<!-- TECH STACK BOX -->
<table>
  <tr>
    <td align="center" colspan="7">
      <strong>🛠️ Tech Stack</strong>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js"/><br/>
      <sub><b>Next.js</b></sub>
    </td>
    <td align="center">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript"/><br/>
      <sub><b>TypeScript</b></sub>
    </td>
    <td align="center">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind CSS"/><br/>
      <sub><b>Tailwind CSS</b></sub>
    </td>
    <td align="center">
      <img src="https://skillicons.dev/icons?i=laravel" width="48" height="48" alt="Laravel"/><br/>
      <sub><b>Laravel</b></sub>
    </td>
    <td align="center">
      <img src="https://skillicons.dev/icons?i=php" width="48" height="48" alt="FrankenPHP"/><br/>
      <sub><b>FrankenPHP</b></sub>
    </td>
    <td align="center">
      <img src="https://skillicons.dev/icons?i=mysql" width="48" height="48" alt="MariaDB"/><br/>
      <sub><b>MariaDB</b></sub>
    </td>
    <td align="center">
      <img src="https://skillicons.dev/icons?i=redis" width="48" height="48" alt="Redis"/><br/>
      <sub><b>Redis</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="7">
      <img src="https://img.shields.io/badge/Auth-JWT-black?style=flat-square&logo=jsonwebtokens&logoColor=white"/>
      &nbsp;
      <img src="https://img.shields.io/badge/API-REST-blue?style=flat-square"/>
      &nbsp;
      <img src="https://img.shields.io/badge/Runtime-FrankenPHP-orange?style=flat-square&logo=php&logoColor=white"/>
    </td>
  </tr>
</table>

<br/>

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![MariaDB](https://img.shields.io/badge/MariaDB-10.x-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)

</div>

---

## 🎯 Tentang Proyek

Sistem manajemen inventaris dan keuangan yang dirancang khusus untuk UMKM Indonesia. Mulai dari **kuliner**, **retail**, hingga **produksi rumahan** — platform ini membantu pelaku usaha mengelola operasional bisnis secara efisien dengan perhitungan HPP otomatis dan tracking keuangan real-time.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📊 **Dashboard** | Ringkasan bisnis dan KPI secara real-time |
| 📦 **Manajemen Produk** | Kelola produk & kategori dengan mudah |
| 🏷️ **Inventaris & Stok** | Tracking stok masuk/keluar secara akurat |
| 💰 **Pencatatan Penjualan** | Rekap transaksi penjualan harian/bulanan |
| 🧮 **Perhitungan HPP** | Kalkulasi Harga Pokok Produksi otomatis |
| 📈 **Keuangan** | Monitoring income & expense terintegrasi |
| 👥 **Role Management** | Akses berbasis peran: Owner, Admin, Staff |
| ⚡ **Performa Tinggi** | Caching & queue dengan Redis |
| 🔐 **Keamanan** | Autentikasi stateless berbasis JWT |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                     │
│          Next.js (SSR / SPA / TypeScript)           │
│              Tailwind CSS • shadcn/ui               │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS / REST API
┌───────────────────────▼─────────────────────────────┐
│                   BACKEND LAYER                     │
│          Laravel 11 + FrankenPHP Runtime            │
│         JWT Auth • Business Logic • Queue           │
└──────────┬──────────────────────────┬───────────────┘
           │                          │
┌──────────▼──────────┐  ┌────────────▼───────────────┐
│    DATABASE LAYER   │  │       CACHE LAYER          │
│  MariaDB / MySQL    │  │  Redis (Cache/Queue/Session)│
│  Relational Data    │  │  High-performance Storage   │
└─────────────────────┘  └────────────────────────────┘
```

---

## 🧱 Detail Tech Stack

### 🎨 Frontend
- **[Next.js](https://nextjs.org)** — React framework dengan SSR, SSG, dan App Router
- **[TypeScript](https://www.typescriptlang.org)** — Type safety untuk codebase yang lebih maintainable
- **[Tailwind CSS](https://tailwindcss.com)** — Utility-first CSS framework untuk styling cepat

### ⚙️ Backend
- **[Laravel](https://laravel.com)** — PHP framework untuk REST API & business logic
- **[FrankenPHP](https://frankenphp.dev)** — Modern PHP runtime berbasis Go, performa tinggi

### 🗄️ Database
- **[MariaDB / MySQL](https://mariadb.org)** — Relational database untuk data transaksional

### ⚡ Cache & Queue
- **[Redis](https://redis.io)** — In-memory store untuk caching, queue jobs, dan session

### 🔐 Authentication
- **[JWT (tymon/jwt-auth)](https://github.com/tymondesigns/jwt-auth)** — Stateless authentication via JSON Web Token

---

## 👥 Role & Akses

```
Owner  → Akses penuh: dashboard, laporan, pengaturan, semua modul
Admin  → Manajemen produk, stok, penjualan, keuangan
Staff  → Input transaksi & pengecekan stok
```

---

## 🎯 Target Pengguna

- 🍜 **UMKM Kuliner** — Restoran, warung, katering
- 🛍️ **UMKM Retail** — Toko kelontong, minimarket, fashion
- 🏠 **Produksi Rumahan** — Kerajinan, makanan olahan, konveksi
- 🏪 **Toko Fisik & Online** — Mendukung operasional omnichannel

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Lihat `LICENSE` untuk informasi lebih lanjut.

---

<div align="center">
  <sub>Dibuat dengan ❤️ untuk UMKM Indonesia</sub>
</div>
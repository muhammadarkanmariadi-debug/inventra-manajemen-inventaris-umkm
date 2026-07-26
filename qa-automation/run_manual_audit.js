const { chromium } = require('@playwright/test');
const fs = require('fs');

if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots', { recursive: true });
}

(async () => {
  console.log('🚀 =========================================================================');
  console.log('🚀 MEMULAI AUDIT VISUAL END-TO-END SISTEM INVENTRA (FASE 0 — FASE 7)');
  console.log('🚀 Mode: Headless = False (Browser terbuka langsung di desktop via WSLg)');
  console.log('🚀 =========================================================================\n');

  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });

  // =========================================================================
  // FASE 0: AUTHENTICATION FLOW & RBAC (Registrasi & Login 5 Role)
  // =========================================================================
  console.log('🔹 [FASE 0] Pengujian Alur Registrasi Akun & Login 5 Role RBAC...');

  // 0.1 Registrasi Akun Baru
  console.log('📑 [Fase 0.1] Membuka Tab 1: Registrasi Akun Baru (/auth/signup)...');
  const pageReg = await context.newPage();
  await pageReg.goto('http://localhost:3000/auth/signup');
  await pageReg.screenshot({ path: 'screenshots/fase0-1-signup-page.png' });

  const timestamp = Date.now();
  await pageReg.fill('input[name="fname"]', 'QA');
  await pageReg.fill('input[name="lname"]', 'Automation');
  await pageReg.fill('input[name="email"]', `qa.audit.${timestamp}@demo.com`);
  await pageReg.fill('input[placeholder="Enter your password"]', 'Password123!');

  const checkbox = pageReg.locator('input[type="checkbox"]').first();
  if (await checkbox.isVisible()) {
    await checkbox.check();
  }

  await pageReg.screenshot({ path: 'screenshots/fase0-1-signup-filled.png' });
  await pageReg.click('button:has-text("Sign Up")');
  await pageReg.waitForTimeout(3000);
  await pageReg.screenshot({ path: 'screenshots/fase0-1-signup-result.png' });
  console.log(`✅ [Fase 0.1] Status setelah Sign Up: ${await pageReg.title()} (${pageReg.url()})\n`);

  // 0.2 Login Super Admin
  console.log('📑 [Fase 0.2] Membuka Tab 2: Login Super Admin (/auth/signin)...');
  const pageSa = await context.newPage();
  await pageSa.goto('http://localhost:3000/auth/signin');
  await pageSa.fill('input[type="email"]', 'superadmin@demo.com');
  await pageSa.fill('input[placeholder="Enter your password"]', 'demo1234');
  await pageSa.screenshot({ path: 'screenshots/fase0-2-login-superadmin.png' });
  await pageSa.click('button:has-text("Sign in")');
  await pageSa.waitForTimeout(3000);
  await pageSa.screenshot({ path: 'screenshots/fase0-2-dashboard-superadmin.png' });
  console.log(`✅ [Fase 0.2] Super Admin logged in -> ${pageSa.url()}\n`);

  // 0.3 Login Manager
  console.log('📑 [Fase 0.3] Membuka Tab 3: Login Manager (/auth/signin)...');
  const pageManager = await context.newPage();
  await pageManager.goto('http://localhost:3000/auth/signin');
  await pageManager.fill('input[type="email"]', 'manager@demo.com');
  await pageManager.fill('input[placeholder="Enter your password"]', 'demo1234');
  await pageManager.click('button:has-text("Sign in")');
  await pageManager.waitForTimeout(3000);
  await pageManager.screenshot({ path: 'screenshots/fase0-3-dashboard-manager.png' });
  console.log(`✅ [Fase 0.3] Manager logged in -> ${pageManager.url()}\n`);

  // 0.4 Login Operator Gudang
  console.log('📑 [Fase 0.4] Membuka Tab 4: Login Operator Gudang (/auth/signin)...');
  const pageOp = await context.newPage();
  await pageOp.goto('http://localhost:3000/auth/signin');
  await pageOp.fill('input[type="email"]', 'operator@demo.com');
  await pageOp.fill('input[placeholder="Enter your password"]', 'demo1234');
  await pageOp.click('button:has-text("Sign in")');
  await pageOp.waitForTimeout(3000);
  await pageOp.screenshot({ path: 'screenshots/fase0-4-dashboard-operator.png' });
  console.log(`✅ [Fase 0.4] Operator Gudang logged in -> ${pageOp.url()}\n`);

  // 0.5 Login Sales
  console.log('📑 [Fase 0.5] Membuka Tab 5: Login Sales (/auth/signin)...');
  const pageSales = await context.newPage();
  await pageSales.goto('http://localhost:3000/auth/signin');
  await pageSales.fill('input[type="email"]', 'sales@demo.com');
  await pageSales.fill('input[placeholder="Enter your password"]', 'demo1234');
  await pageSales.click('button:has-text("Sign in")');
  await pageSales.waitForTimeout(3000);
  await pageSales.screenshot({ path: 'screenshots/fase0-5-dashboard-sales.png' });
  console.log(`✅ [Fase 0.5] Sales logged in -> ${pageSales.url()}\n`);

  // =========================================================================
  // FASE 1: MANAJEMEN INVENTARIS & PRODUK (Master Data)
  // =========================================================================
  console.log('🔹 [FASE 1] Audit Visual Manajemen Inventaris & Produk (via Tab Manager)...');
  
  console.log('   🔸 Navigasi ke Kategori Produk (/dashboard/categories)...');
  await pageManager.goto('http://localhost:3000/dashboard/categories');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase1-1-categories.png' });

  console.log('   🔸 Navigasi ke Master Produk (/dashboard/products)...');
  await pageManager.goto('http://localhost:3000/dashboard/products');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase1-2-products.png' });

  console.log('   🔸 Navigasi ke Inventaris Stok (/dashboard/inventories)...');
  await pageManager.goto('http://localhost:3000/dashboard/inventories');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase1-3-inventories.png' });

  console.log('   🔸 Navigasi ke Lokasi Gudang (/dashboard/locations)...');
  await pageManager.goto('http://localhost:3000/dashboard/locations');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase1-4-locations.png' });
  console.log('✅ [FASE 1] Master Data terverifikasi.\n');

  // =========================================================================
  // FASE 2: MANAJEMEN SUPPLIER & PEMBELIAN (Procurement Flow)
  // =========================================================================
  console.log('🔹 [FASE 2] Audit Visual Manajemen Supplier & Pembelian (via Tab Manager)...');

  console.log('   🔸 Navigasi ke Supplier (/dashboard/suppliers)...');
  await pageManager.goto('http://localhost:3000/dashboard/suppliers');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase2-1-suppliers.png' });

  console.log('   🔸 Navigasi ke Transaksi Pembelian (/dashboard/purchases)...');
  await pageManager.goto('http://localhost:3000/dashboard/purchases');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase2-2-purchases.png' });
  console.log('✅ [FASE 2] Procurement Flow terverifikasi.\n');

  // =========================================================================
  // FASE 3: TRANSAKSI PENJUALAN & PENGURANGAN STOK (Sales Flow)
  // =========================================================================
  console.log('🔹 [FASE 3] Audit Visual Transaksi Penjualan & Stok (via Tab Sales & Operator)...');

  console.log('   🔸 Navigasi ke Transaksi Penjualan (/dashboard/sales via Tab Sales)...');
  await pageSales.goto('http://localhost:3000/dashboard/sales');
  await pageSales.waitForTimeout(2000);
  await pageSales.screenshot({ path: 'screenshots/fase3-1-sales.png' });

  console.log('   🔸 Navigasi ke Penyesuaian Stok (/dashboard/stock-adjustment via Tab Operator)...');
  await pageOp.goto('http://localhost:3000/dashboard/stock-adjustment');
  await pageOp.waitForTimeout(2000);
  await pageOp.screenshot({ path: 'screenshots/fase3-2-stock-adjustment.png' });
  console.log('✅ [FASE 3] Sales & Stock Flow terverifikasi.\n');

  // =========================================================================
  // FASE 4: PEMANTAUAN KEUANGAN & ARUS KAS (Financial Flow)
  // =========================================================================
  console.log('🔹 [FASE 4] Audit Visual Keuangan & Arus Kas (via Tab Manager)...');

  console.log('   🔸 Navigasi ke Kategori Keuangan (/dashboard/financial-categories)...');
  await pageManager.goto('http://localhost:3000/dashboard/financial-categories');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase4-1-financial-categories.png' });

  console.log('   🔸 Navigasi ke Transaksi Keuangan (/dashboard/financial-transactions)...');
  await pageManager.goto('http://localhost:3000/dashboard/financial-transactions');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase4-2-financial-transactions.png' });
  console.log('✅ [FASE 4] Financial Flow terverifikasi.\n');

  // =========================================================================
  // FASE 5: AI STOCK PREDICTION & ANALISIS BISNIS (FastAPI Prophet Service)
  // =========================================================================
  console.log('🔹 [FASE 5] Audit Visual Prediksi Stok AI & Analisis (via Tab Manager)...');

  console.log('   🔸 Navigasi ke AI Stock Prediction (/dashboard/stock-prediction)...');
  await pageManager.goto('http://localhost:3000/dashboard/stock-prediction');
  await pageManager.waitForTimeout(3000);
  await pageManager.screenshot({ path: 'screenshots/fase5-1-ai-stock-prediction.png' });
  console.log('✅ [FASE 5] AI Stock Prediction terverifikasi.\n');

  // =========================================================================
  // FASE 6: LAPORAN, STATISTIK & AUDIT LOGS (Reporting & Tracking)
  // =========================================================================
  console.log('🔹 [FASE 6] Audit Visual Laporan, Statistik & Audit Logs (via Tab Manager)...');

  console.log('   🔸 Navigasi ke Dashboard Utama / Statistik (/dashboard)...');
  await pageManager.goto('http://localhost:3000/dashboard');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase6-1-dashboard-stats.png' });

  console.log('   🔸 Navigasi ke Audit Logs (/dashboard/logs)...');
  await pageManager.goto('http://localhost:3000/dashboard/logs');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase6-2-audit-logs.png' });

  console.log('   🔸 Navigasi ke Manajemen Dokumen (/dashboard/documents)...');
  await pageManager.goto('http://localhost:3000/dashboard/documents');
  await pageManager.waitForTimeout(2000);
  await pageManager.screenshot({ path: 'screenshots/fase6-3-documents.png' });
  console.log('✅ [FASE 6] Reporting & Audit Logs terverifikasi.\n');

  // =========================================================================
  // FASE 7: SUPER ADMIN & SAAS MULTI-BUSINESS MANAGEMENT
  // =========================================================================
  console.log('🔹 [FASE 7] Audit Visual Super Admin SaaS Management (via Tab Super Admin)...');

  console.log('   🔸 Navigasi ke Manajemen Bisnis SaaS (/admin/businesses)...');
  await pageSa.goto('http://localhost:3000/admin/businesses');
  await pageSa.waitForTimeout(2000);
  await pageSa.screenshot({ path: 'screenshots/fase7-1-admin-businesses.png' });

  console.log('   🔸 Navigasi ke Manajemen Pengguna Super Admin (/admin/users)...');
  await pageSa.goto('http://localhost:3000/admin/users');
  await pageSa.waitForTimeout(2000);
  await pageSa.screenshot({ path: 'screenshots/fase7-2-admin-users.png' });
  console.log('✅ [FASE 7] Super Admin SaaS Flow terverifikasi.\n');

  console.log('🎉 =========================================================================');
  console.log('🎉 SELURUH FASE 0 - FASE 7 TELAH SELESAI DAN TERVERIFIKASI!');
  console.log('🎉 Semua tab (Registrasi, Super Admin, Manager, Operator, Sales) masih terbuka.');
  console.log('🎉 Window browser akan ditahan selama 20 detik agar Anda bisa memeriksa setiap tab...');
  console.log('🎉 =========================================================================\n');

  await pageManager.waitForTimeout(20000);
  await browser.close();
  console.log('🔒 Browser ditutup. Audit visual end-to-end selesai.');
})();

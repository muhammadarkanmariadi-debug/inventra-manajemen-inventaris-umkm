const { chromium } = require('@playwright/test');
const fs = require('fs');

if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots', { recursive: true });
}

(async () => {
  console.log('🚀 Membuka browser Chromium dalam mode Headless=False (Visible)...');
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });

  // Tab Pertama: Registrasi Akun Baru
  console.log('📑 [Tab 1] Membuka halaman Registrasi Akun Baru...');
  const pageReg = await context.newPage();
  await pageReg.goto('http://localhost:3000/auth/signup');
  await pageReg.screenshot({ path: 'screenshots/manual-tab1-signup.png' });

  await pageReg.fill('input[name="fname"]', 'QA');
  await pageReg.fill('input[name="lname"]', 'Audit');
  await pageReg.fill('input[name="email"]', `audit.${Date.now()}@demo.com`);
  await pageReg.fill('input[placeholder="Enter your password"]', 'Password123!');

  const checkbox = pageReg.locator('input[type="checkbox"]').first();
  if (await checkbox.isVisible()) {
    await checkbox.check();
  }

  await pageReg.screenshot({ path: 'screenshots/manual-tab1-signup-filled.png' });
  await pageReg.click('button:has-text("Sign Up")');
  await pageReg.waitForTimeout(2000);
  console.log(`✅ [Tab 1] Judul setelah Sign Up: ${await pageReg.title()}`);

  // Tab Kedua: Login Super Admin
  console.log('📑 [Tab 2] Membuka tab baru untuk Login Super Admin...');
  const pageSa = await context.newPage();
  await pageSa.goto('http://localhost:3000/auth/signin');
  await pageSa.fill('input[type="email"]', 'superadmin@demo.com');
  await pageSa.fill('input[placeholder="Enter your password"]', 'demo1234');
  await pageSa.screenshot({ path: 'screenshots/manual-tab2-signin-sa.png' });
  await pageSa.click('button:has-text("Sign in")');
  await pageSa.waitForTimeout(3000);
  await pageSa.screenshot({ path: 'screenshots/manual-tab2-dashboard-sa.png' });
  console.log(`✅ [Tab 2] Judul setelah Login Super Admin: ${await pageSa.title()} (${pageSa.url()})`);

  // Tab Ketiga: Login Operator Gudang
  console.log('📑 [Tab 3] Membuka tab baru untuk Login Operator Gudang...');
  const pageOp = await context.newPage();
  await pageOp.goto('http://localhost:3000/auth/signin');
  await pageOp.fill('input[type="email"]', 'operator@demo.com');
  await pageOp.fill('input[placeholder="Enter your password"]', 'demo1234');
  await pageOp.click('button:has-text("Sign in")')
  await pageOp.waitForTimeout(3000);
  await pageOp.screenshot({ path: 'screenshots/manual-tab3-dashboard-operator.png' });
  console.log(`✅ [Tab 3] Judul setelah Login Operator: ${await pageOp.title()} (${pageOp.url()})`);

  // Tab Keempat: Login Sales
  console.log('📑 [Tab 4] Membuka tab baru untuk Login Sales...');
  const pageSales = await context.newPage();
  await pageSales.goto('http://localhost:3000/auth/signin');
  await pageSales.fill('input[type="email"]', 'sales@demo.com');
  await pageSales.fill('input[placeholder="Enter your password"]', 'demo1234');
  await pageSales.click('button:has-text("Sign in")');
  await pageSales.waitForTimeout(3000);
  await pageSales.screenshot({ path: 'screenshots/manual-tab4-dashboard-sales.png' });
  console.log(`✅ [Tab 4] Judul setelah Login Sales: ${await pageSales.title()} (${pageSales.url()})`);

  console.log('\n💡 Semua tab terbuka dan siap untuk Anda audit visual!');
  console.log('⏱️ Menahan window terbuka selama 15 detik agar Anda bisa memeriksa setiap tab...');
  await pageSales.waitForTimeout(15000);

  await browser.close();
  console.log('🔒 Browser ditutup. Audit manual visual selesai.');
})();

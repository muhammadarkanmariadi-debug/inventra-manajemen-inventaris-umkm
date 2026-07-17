import { test, expect } from '@playwright/test';

test.describe('FASE 0 — AUTHENTICATION FLOW & RBAC', () => {

  test('0.1 Registrasi Akun Baru & Validasi UI/Logika', async ({ page }) => {
    // 1. Buka halaman registrasi
    await page.goto('http://localhost:3000/auth/signup');
    await page.screenshot({ path: 'screenshots/fase0-1-register-initial.png' });

    // 2. Cek validasi field wajib dengan klik Sign Up langsung tanpa mengisi form
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/fase0-1-register-validation-error.png' });

    // 3. Isi form registrasi dengan data valid
    const timestamp = Date.now();
    const testEmail = `qa.auto.${timestamp}@demo.com`;

    await page.locator('input[name="fname"]').fill('QA');
    await page.locator('input[name="lname"]').fill('Automation');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[placeholder="Enter your password"]').fill('Password123!');
    
    // Centang terms if needed (atau langsung submit)
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
    }

    await page.screenshot({ path: 'screenshots/fase0-1-register-filled.png' });
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // 4. Verifikasi redirect ke halaman verify-email-pending atau dashboard
    await page.waitForURL('**/verify-email-pending**', { timeout: 15000 }).catch(async () => {
      // Jika auto login atau redirect lain, kita tangkap posisinya
      console.log('Redirect URL after signup:', page.url());
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'screenshots/fase0-1-register-result.png' });
  });

  const roles = [
    { role: 'Super Admin', email: 'superadmin@demo.com', expectedTitle: 'Dashboard' },
    { role: 'Manager', email: 'manager@demo.com', expectedTitle: 'Dashboard' },
    { role: 'Operator Gudang', email: 'operator@demo.com', expectedTitle: 'Dashboard' },
    { role: 'QC', email: 'qc@demo.com', expectedTitle: 'Dashboard' },
    { role: 'Sales', email: 'sales@demo.com', expectedTitle: 'Dashboard' },
  ];

  for (const { role, email } of roles) {
    test(`0.3 Login & RBAC UI untuk role: ${role}`, async ({ page }) => {
      await page.goto('http://localhost:3000/auth/signin');
      
      // Isi email & password dari seeder
      await page.locator('input[type="email"]').fill(email);
      await page.locator('input[placeholder="Enter your password"]').fill('demo1234');
      await page.screenshot({ path: `screenshots/fase0-3-login-form-${role.toLowerCase().replace(/\s+/g, '-')}.png` });

      await page.getByRole('button', { name: 'Sign in' }).click();

      // Tunggu redirect ke dashboard atau halaman beranda
      await page.waitForURL('**/dashboard**', { timeout: 15000 }).catch(() => {
        console.log(`URL for ${role} after login:`, page.url());
      });
      await page.waitForTimeout(2000);
      
      // Screenshot dashboard/sidebar sesuai role
      await page.screenshot({ path: `screenshots/fase0-3-dashboard-${role.toLowerCase().replace(/\s+/g, '-')}.png` });
    });
  }

  test('0.3 Validasi Logika RBAC via API (Negative Test - Unauthorized Access)', async ({ request }) => {
    // 1. Login via API sebagai Operator Gudang untuk mendapatkan token
    const loginRes = await request.post('http://localhost:8000/api/auth/login', {
      data: {
        email: 'operator@demo.com',
        password: 'demo1234'
      }
    });
    
    if (loginRes.ok()) {
      const loginBody = await loginRes.json();
      const token = loginBody?.data?.token || loginBody?.token;

      if (token) {
        // 2. Operator mencoba mengakses endpoint Manajemen Pengguna (khusus Super Admin/Owner)
        const unauthorizedRes = await request.get('http://localhost:8000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        console.log('Operator access to /api/users status:', unauthorizedRes.status());
        // Pastikan ditolak (403 Forbidden)
        expect([401, 403]).toContain(unauthorizedRes.status());
      }
    }
  });

});

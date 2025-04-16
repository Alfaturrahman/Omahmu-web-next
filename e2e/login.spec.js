import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Mengunjungi halaman login
  await page.goto('http://localhost:3000/Login');
  
  // Mengisi form dengan data kosong untuk memicu error
  await page.getByRole('textbox', { name: 'Email' }).fill('');
  await page.getByRole('textbox', { name: 'Kata Sandi' }).fill('');
  
  // Klik tombol masuk untuk menguji validasi error
  await page.getByRole('button', { name: 'Masuk' }).click();

  // Verifikasi apakah error muncul
  await expect(page.locator('p.text-red-500:has-text("Email tidak boleh kosong")')).toBeVisible();
  await expect(page.locator('p.text-red-500:has-text("Password tidak boleh kosong")')).toBeVisible();

  // Mengisi form dengan email tidak valid
  await page.getByRole('textbox', { name: 'Email' }).fill('input@email');
  await page.getByRole('textbox', { name: 'Kata Sandi' }).fill('validpassword');
  await page.getByRole('button', { name: 'Masuk' }).click();

  // Verifikasi error email tidak valid
  await expect(page.locator('p.text-red-500:has-text("Email tidak valid")')).toBeVisible();

  // Mengisi form dengan data yang benar
  await page.getByRole('textbox', { name: 'Email' }).fill('valid@email.com');
  await page.getByRole('textbox', { name: 'Kata Sandi' }).fill('validpassword');
  await page.getByRole('button', { name: 'Masuk' }).click();

  // ✅ Verifikasi notifikasi login berhasil muncul
  await expect(
    page.locator('div.bg-green-100:has-text("Login berhasil!")')
  ).toBeVisible();
});

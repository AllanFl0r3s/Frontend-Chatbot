import { test, expect } from '@playwright/test';

test('vendedor entra, consulta su cartera, identifica pulpería y cierra sesión', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Usuario o correo', { exact: true }).fill('ci.vendedor');
  await page.locator('input[type="password"]').fill('SoloPruebaCI-2026!');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/chat$/);
  await page.getByRole('button', { name: 'Consultar mi cartera', exact: true }).click();
  await expect(page.locator('.msg:not(.me) .text').last()).toContainText('Saldo pendiente: L 3,200.00');
  const composer = page.getByPlaceholder('Escribe tu mensaje… (máx 300)');
  await composer.fill('3');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.locator('.msg:not(.me) .text').last()).toContainText('CLI-001 — Pulpería La Bendición');
  await composer.fill('CLI-001');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.locator('.msg:not(.me) .text').last()).toContainText('Saldo: L 800.00');
  await expect(page.locator('.msg:not(.me) .text').last()).toContainText('Vencido');
  await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto('/users');
  await expect(page).toHaveURL(/\/login$/);
});

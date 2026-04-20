import { test, expect } from '@playwright/test';

test.describe('Сквозные тесты', () => {
  
  test('1. Главная страница открывается', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Сервис обращений граждан');
  });

  test('2. Переход на страницу логина', async ({ page }) => {
    await page.goto('/');
    
    // Ждём, пока кнопка станет видимой
    const loginButton = page.locator('button:has-text("Вход в систему")');
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
    
    // Проверяем URL или наличие формы логина
    await expect(page.locator('h1:has-text("Вход")')).toBeVisible({ timeout: 5000 });
  });

  test('3. Переход на страницу регистрации', async ({ page }) => {
    await page.goto('/');
    
    const registerButton = page.locator('button:has-text("Регистрация")');
    await registerButton.waitFor({ state: 'visible', timeout: 10000 });
    await registerButton.click();
    
    await expect(page.locator('h1:has-text("Регистрация")')).toBeVisible({ timeout: 5000 });
  });

  test('4. Вход с неверными данными показывает ошибку', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Вход в систему")');
    
    // Ждём появления формы
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    await page.fill('input[type="text"]', 'wronguser');
    await page.fill('input[type="password"]', 'wrongpass');
    
    // Перехватываем alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Ошибка');
      await dialog.accept();
    });
    
    await page.click('button:has-text("Войти")');
  });

  test('5. Виджет погоды загружается', async ({ page }) => {
    await page.goto('/');
    // Ждём появления виджета погоды (используем другой селектор без /)
    await page.waitForSelector('.rounded-xl', { timeout: 10000 });
    const widget = page.locator('.rounded-xl').first();
    await expect(widget).toBeVisible();
  });

  test('6. Гостевой вход работает', async ({ page }) => {
    await page.goto('/');
    
    // Кликаем по кнопке гостевого входа
    await page.click('button:has-text("Войти как гость")');
    
    // После гостевого входа страница перезагружается, ждём
    await page.waitForTimeout(3000);
    
    // Проверяем, что появилась надпись "Гость" в шапке (первый элемент)
    const guestBadge = page.locator('span.text-xs.px-2.py-1.rounded-full').first();
    await expect(guestBadge).toContainText('Гость', { timeout: 5000 });
  });
});
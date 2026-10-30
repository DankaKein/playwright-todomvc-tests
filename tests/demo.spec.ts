import { test, expect } from '@playwright/test';

test.describe('TodoMVC Playwright Demo Tests', () => {

  test('1. Page contains expected texts', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');

    await expect(page).toHaveTitle(/TodoMVC/);
    await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
  });

  test('2. Interactive form: add and complete a todo', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');
    await expect(page.getByText('Buy groceries')).toBeVisible();

    const checkbox = page.getByRole('checkbox').first();
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await page.getByText('Buy groceries').hover();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Buy groceries')).not.toBeVisible();
  });

  test('3. Navigate to another page/state', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');

    const input = page.getByPlaceholder('What needs to be done?');
    
    // 1. Добавляем задачу и делаем её выполненной
    await input.fill('Task Active');
    await input.press('Enter');
    await page.getByRole('checkbox').first().check(); 

    // 2. Добавляем вторую задачу (она остается активной)
    await input.fill('Task Completed');
    await input.press('Enter');

    // 3. Переходим на вкладку "Active"
    await page.getByRole('link', { name: 'Active' }).click();

    // 4. Проверяем URL
    await expect(page).toHaveURL(/\/active/);

    // 5. Проверяем, что видимая задача осталась только одна (вторая)
    const visibleTasks = page.locator('.todo-list li:visible');
    await expect(visibleTasks).toHaveCount(1);
    await expect(visibleTasks).toHaveText('Task Completed');
  });
});
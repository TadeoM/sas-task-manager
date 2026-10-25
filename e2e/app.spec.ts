import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders the three columns from seed data', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'SAS Task Manager' }),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: 'To Do' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'In Progress' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Done' })).toBeVisible();
});

test('adding a task shows it in that column', async ({ page }) => {
  const todoColumn = page.getByRole('region', { name: 'To Do' });
  await todoColumn.getByPlaceholder('Add a task…').fill('Write tests');
  await todoColumn.getByPlaceholder('Add a task…').press('Enter');

  await expect(
    todoColumn.getByRole('button', {name: "Write tests"}).last(),
  ).toBeVisible;
  await expect(todoColumn.getByRole('listitem')).toHaveCount(2);
});

test('Ctrl+Right/Left shifts the focused task between columns', async ({
  page,
}) => {
  const todoColumn = page.getByRole('region', { name: 'To Do' });
  const inProgressColumn = page.getByRole('region', { name: 'In Progress' });
  const doneColumn = page.getByRole('region', { name: 'Done' });

  await todoColumn.getByRole('button', { name: /Delete/ }).focus();
  await page.keyboard.press('Control+ArrowRight');

  await expect(
    inProgressColumn.getByRole('button', {name: "Wire up fake database"}).last(),
  ).toBeVisible();

  await inProgressColumn
    .getByRole('listitem')
    .last()
    .getByRole('button', { name: /Delete/ })
    .focus();
  await page.keyboard.press('Control+ArrowRight');

  await expect(
    doneColumn.getByRole('button', {name: "Wire up fake database"}).last(),
  ).toBeVisible();

  await doneColumn
    .getByRole('listitem')
    .last()
    .getByRole('button', { name: /Delete/ })
    .focus();
  await page.keyboard.press('Control+ArrowLeft');

  await expect(
    inProgressColumn.getByRole('button', {name: "Wire up fake database"}).last(),
  ).toBeVisible();
});

test('dragging a task by keyboard reorders it within its column', async ({
  page,
}) => {
  const todoColumn = page.getByRole('region', { name: 'To Do' });

  await todoColumn.getByPlaceholder('Add a task…').fill('Second task');
  await todoColumn.getByPlaceholder('Add a task…').press('Enter');

  await expect(todoColumn.getByRole('listitem')).toHaveCount(2);
  await expect(
    todoColumn.getByRole('button' , {name: "Wire up fake database"}).first(),
  ).toBeVisible();

  await todoColumn
    .getByRole('listitem')
    .first()
    .getByRole('button', { name: /Reorder/ })
    .focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(300);
  await page.keyboard.press('Space');

  await expect(
    todoColumn.getByRole('button', {name: "Second task"}).first(),
  ).toBeVisible();
});

test('shows the due date and a description indicator', async ({ page }) => {
  const todoColumn = page.getByRole('region', { name: 'To Do' });
  const task = todoColumn.getByRole('listitem').first();

  await expect(task.getByText('Overdue Apr 13')).toBeVisible();
  await expect(task.locator('svg title')).toHaveText('Has a description');
});

test('deleting a task removes it', async ({ page }) => {
  const doneColumn = page.getByRole('region', { name: 'Done' });
  await doneColumn.getByRole('button', { name: /Delete/ }).click();

  await expect(doneColumn.getByRole('listitem')).toHaveCount(0);
});

test('opens the details modal with the task\'s current values', async ({
  page,
}) => {
  const todoColumn = page.getByRole('region', { name: 'To Do' });
  await todoColumn
    .getByRole('button', { name: /^Wire up fake database$/ })
    .click();

  const dialog = page.getByRole('dialog');
  await expect(dialog.getByLabel('Title')).toHaveValue(
    'Wire up fake database',
  );
  await expect(dialog.getByLabel('Description')).toHaveValue(
    'This is a description',
  );
  await expect(dialog.getByLabel('Due Date')).toHaveValue('2024-04-13');
});

test('saving in the details modal updates the task', async ({ page }) => {
  const todoColumn = page.getByRole('region', { name: 'To Do' });
  const doneColumn = page.getByRole('region', { name: 'Done' });
  await todoColumn
    .getByRole('button', { name: /^Wire up fake database$/ })
    .click();

  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Title').fill('Updated title');
  await dialog.getByLabel('Status').click();
  await page.getByRole('option', { name: 'Done' }).click();
  await dialog.getByRole('button', { name: 'Save' }).click();

  await expect(dialog).not.toBeVisible();
  await expect(
    doneColumn.getByRole('button', { name: /^Updated title$/ }),
  ).toBeVisible();
});

test('canceling the details modal discards changes', async ({ page }) => {
  const todoColumn = page.getByRole('region', { name: 'To Do' });
  await todoColumn
    .getByRole('button', { name: /^Wire up fake database$/ })
    .click();

  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Title').fill('Should not be saved');
  await dialog.getByRole('button', { name: 'Cancel' }).click();

  await expect(dialog).not.toBeVisible();
  await expect(
    todoColumn.getByRole('button', { name: /^Wire up fake database$/ }),
  ).toBeVisible();
  await expect(todoColumn.getByText('Should not be saved')).toHaveCount(0);
});

test('deleting from within the details modal removes the task', async ({
  page,
}) => {
  const todoColumn = page.getByRole('region', { name: 'To Do' });
  await todoColumn
    .getByRole('button', { name: /^Wire up fake database$/ })
    .click();

  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Delete' }).click();

  await expect(dialog).not.toBeVisible();
  await expect(todoColumn.getByRole('listitem')).toHaveCount(0);
});

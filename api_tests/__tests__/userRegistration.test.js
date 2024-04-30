const { test, expect, browser } = require('@playwright/test');

// Helper functions for generating random emails and strings
function generateRandomEmail() {
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${randomString}@test.com`;
}

function generateRandomString() {
    return Math.random().toString(36).substring(2, 8); // Generates a random string
}

let sharedPage;

// Initialize shared browser context and page before all tests
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
        headless: false, // Run tests in a visible browser
        slowMo: 500     // Slow down operations for visibility
    });
    sharedPage = await context.newPage();
});

// Cleanup after all tests are done
test.afterAll(async () => {
    await sharedPage.context().close();
});

// Describe the test suite
test.describe('Qubika Sports Club Management System E2E Tests', () => {
    let registeredUser = {};

    // Register user before all tests
    test.beforeAll(async ({ request }) => {
        const email = generateRandomEmail();
        const password = 'AStrongPass123!';
        const requestBody = {
            email: email,
            password: password,
            roles: ['ROLE_ADMIN']
        };

        // Send the POST request to the register endpoint
        const response = await request.post('https://api.club-administration.qa.qubika.com/api/auth/register', {
            data: requestBody,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok()) {
            throw new Error(`Failed to register user, status is ${response.status()}`);
        }

        const userData = await response.json();
        registeredUser.email = email;
        registeredUser.password = password;
        registeredUser.id = userData.id;
    });

    // Test for login with the newly created user
    test('Login with the newly created user and validate login', async () => {
        await sharedPage.goto('https://club-administration.qa.qubika.com/#/auth/login');
        await expect(sharedPage.locator('input[formControlName="email"]')).toBeVisible();
        await expect(sharedPage.locator('input[formControlName="password"]')).toBeVisible();
        await sharedPage.fill('input[formControlName="email"]', registeredUser.email);
        await sharedPage.fill('input[formControlName="password"]', registeredUser.password);
        await expect(sharedPage.locator('button:has-text("Autenticar")')).toBeEnabled();
        await sharedPage.click('button:has-text("Autenticar")');
        await expect(sharedPage.locator('a .ni-button-power')).toBeVisible();
    });

    // Test for creating a new category
    test('Create a new category and validate success', async () => {
        await sharedPage.waitForSelector('a.nav-link:has-text("Tipos de Categorias")');
        await sharedPage.click('a.nav-link:has-text("Tipos de Categorias")');
        await sharedPage.click('button:has-text("Adicionar")');
        await sharedPage.fill('input[placeholder="Nombre de categoría"]', generateRandomString());
        await sharedPage.click('button:has-text("Aceptar")');
        await expect(sharedPage.locator('.toast-message')).toContainText('Tipo de categoría adicionada satisfactoriamente');
    });

});

import { expect, test } from 'flows';

/*
This test exists as an initial test development implementation for confirming configuration.
 */

test.describe('Login Tests', () => {
    test('TC00 - Existing user can login', async ({ testUser, LoginStep }) => {
        await LoginStep.fill(testUser.email, testUser.password);
        const DashboardStep = await LoginStep.submit();
        await expect(DashboardStep.elements.bookAScanButton).toBeVisible();
    });
});

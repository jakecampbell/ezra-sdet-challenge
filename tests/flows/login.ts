import { Page } from '@playwright/test';
import { UserStep } from './common';
import { DashboardFlow } from './dashboard';
import { expect } from './flow.fixtures';

export namespace LoginFlow {
    export async function begin(page: Page) {
        await page.goto('/sign-in');
        const firstStep = new LoginStep(page);
        await expect(firstStep.elements.emailInput).toBeVisible();
        return firstStep;
    }

    // ----
    // STEP
    // ----

    export class LoginStep extends UserStep {
        get elements() {
            return {
                acceptCookiesButton: this.page.locator('button', { hasText: 'Accept' }),
                emailInput: this.page.locator('#email'),
                passwordInput: this.page.locator('#password'),
                submitButton: this.page.locator('button', { hasText: 'Submit' }),
            };
        }

        async acceptCookies() {
            await this.elements.acceptCookiesButton.click();
            await expect(this.elements.acceptCookiesButton).not.toBeVisible();
        }

        async fill(email: string, password: string) {
            await this.elements.emailInput.fill(email);
            await this.elements.passwordInput.fill(password);
        }

        async submit() {
            await this.elements.submitButton.click();
            return new DashboardFlow.DashboardStep(this.page);
        }
    }
}
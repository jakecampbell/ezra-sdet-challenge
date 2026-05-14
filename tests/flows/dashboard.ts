import { Page } from '@playwright/test';
import { UserStep } from './common';
import { BookingFlow } from './booking';
import { expect } from './flow.fixtures';

export namespace DashboardFlow {
    export async function begin(page: Page) {
        await page.goto('/');
        const firstStep = new DashboardStep(page);
        await expect(firstStep.elements.bookAScanButton).toBeVisible();
        return firstStep;
    }

    // ----
    // STEP
    // ----

    export class DashboardStep extends UserStep {
        get elements() {
            return {
                bookAScanButton: this.page.getByRole('button', { name: 'Book a scan' }),
            };
        }

        async bookAScan() {
            await this.elements.bookAScanButton.click();
            return new BookingFlow.SelectYourScanStep(this.page);
        }
    }
}

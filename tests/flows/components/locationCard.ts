import { BaseComponent } from './baseComponent';
import { expect } from '@playwright/test';

export class LocationCard extends BaseComponent {
    async select() {
        await this.locator.click();
    }

    async expectSelected() {
        await expect(this.locator).toContainClass('--selected');
    }
}

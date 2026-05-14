import { BaseComponent } from './baseComponent';
import { expect, type Locator } from '@playwright/test';

export class EncounterCard extends BaseComponent {
    title: Locator
    affirmPaymentContainer: Locator

    constructor(locator: Locator) {
        super(locator);
        this.title = this.locator.locator('.encounter-title');
        this.affirmPaymentContainer = locator.locator('.stripe-element-container');
    }

    async select() {
        // waiting for the affirmPaymentContainer to be attached to the DOM prevents clicking the card too soon
        await this.affirmPaymentContainer.locator('iframe').waitFor({ state: 'visible' });
        await this.affirmPaymentContainer.scrollIntoViewIfNeeded(); // this greatly improves the stability of clicking a card
        await expect(this.affirmPaymentContainer.frameLocator('iframe').getByText('See if you qualify')).toBeVisible();
        await this.title.click();
    }

    async expectSelected() {
        await expect(this.locator.locator('div.encounter-card')).toContainClass('__active');
    }
}
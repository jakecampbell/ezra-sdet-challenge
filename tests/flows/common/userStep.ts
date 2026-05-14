import type { Locator, Page } from '@playwright/test';
import type { BaseComponent } from '../components/baseComponent';

export abstract class UserStep {
    abstract get elements(): { [key: string]: Locator | BaseComponent };

    constructor(readonly page: Page) {
    }
}

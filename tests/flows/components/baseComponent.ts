import type { Locator } from '@playwright/test';

export class BaseComponent {
    constructor(readonly locator: Locator) {
    }
}
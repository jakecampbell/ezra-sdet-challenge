import type { Locator } from '@playwright/test';
import { BaseComponent } from './baseComponent';

export class BreadcrumbStepper extends BaseComponent {
    steps: Locator;
    selectedStep: Locator;

    constructor(readonly locator: Locator) {
        super(locator);
        this.steps = this.locator.locator('.stepper__steps');
        this.selectedStep = this.steps.locator('.step.step--selected');
    }
}

import { expect, Locator, Page } from '@playwright/test';
import { UserStep } from './common';
import { BreadcrumbStepper, EncounterCard, LocationCard } from './components';

export namespace BookingFlow {
    export async function begin(page: Page) {
        await page.goto('/sign-up/select-plan');
        const firstStep = new SelectYourScanStep(page);
        await expect(firstStep.elements.header).toBeVisible();
        return firstStep;
    }

    abstract class BookingStep extends UserStep {
        get elements() {
            return {
                breadcrumb: new BreadcrumbStepper(this.page.locator('.sign-up-navbar .stepper')),
                header: this.page.locator('.title-container h4'),
                cancelButton: this.page.locator('button', { hasText: 'Cancel' }),
                continueButton: this.page.locator('button', { hasText: 'Continue' }),
            };
        }

        async continue(): Promise<UserStep> {
            await this.elements.continueButton.click();
            return this;
        }
    }

    // ----
    // STEP
    // ----

    export class SelectYourScanStep extends BookingStep {
        get elements() {
            return {
                ...super.elements,
                mriCard: new EncounterCard(this.page.getByTestId('FB30-encounter-card')),
                mriWithSpineCard: new EncounterCard(this.page.getByTestId('FB60-encounter-card')),
                mriWithSkeletalAndNero: new EncounterCard(this.page.getByTestId('BLUEPRINTNR-encounter-card')),
                heartCtCard: new EncounterCard(this.page.getByTestId('GATEDCAC-encounter-card')),
                lungsCtCard: new EncounterCard(this.page.getByTestId('LUNG-encounter-card')),
            };
        }

        async continue() {
            await super.continue();
            return new SelectYourAddOnStep(this.page);
        }
    }

    // ----
    // STEP
    // ----

    export class SelectYourAddOnStep extends BookingStep {
        get elements() {
            return {
                ...super.elements,
                lungCtAddOnCard: this.page.getByTestId('lung-addon-card'),
                heartCtAddOnCard: this.page.getByTestId('gatedcac-addon-card'),
            };
        }

        async expectCardSelected(card: Locator) {
            await expect(card.locator('div.addon-card')).toContainClass('__active');
        }

        async expectStepNotVisible() {
            await expect(this.elements.lungCtAddOnCard).not.toBeAttached();
            await expect(this.elements.heartCtAddOnCard).not.toBeAttached();
        }

        async continue() {
            await super.continue();
            return new ScheduleYourScanStep(this.page);
        }
    }

    // ----
    // STEP
    // ----

    export class PreScreenQuestionnaireStep extends UserStep {
        ynButtonIds = {
            chestSymptoms: 'chest-symptoms',
            cardiacStent: 'gatedCacStent',
            pacemaker: 'pacemaker',
            coronaryHistory: 'coronaryHistory',
            coronaryCalciumScore: 'previousCacScoreThreeYears',
            coronaryCalciumScoreGreaterThan400: 'previousCacScoreOver400',
        }

        get elements() {
            return {
                submitButton: this.page.getByTestId('cac-prescreen-modal-submit-btn'),
            };
        }

        async fill(answers: {
            chestSymptoms: boolean,
            cardiacStent: boolean,
            pacemaker: boolean,
            coronaryHistory: boolean,
            coronaryCalciumScore: boolean,
            coronaryCalciumScoreGreaterThan400: boolean,
        }) {
            for (const [key, value] of Object.entries(answers)) {
                const id = `${value ? 'yes' : 'no'}-${this.ynButtonIds[key as keyof typeof this.ynButtonIds]}`;
                const button = this.page.getByTestId(id);
                await button.click();
            }
        }

        async submit() {
            await this.elements.submitButton.click();
        }
    }

    // ----
    // STEP
    // ----

    export class FailedPreScreenStep extends UserStep {
        get elements() {
            return {
                continueButton: this.page.locator('div.pre-screen-modal button', { hasText: 'Continue' }),
                backButton: this.page.locator('div.pre-screen-modal button', { hasText: 'back' }),
            };
        }
    }

    // ----
    // STEP
    // ----

    export class ScheduleYourScanStep extends BookingStep {
        get elements() {
            return {
                ...super.elements,
                locationCardLocator: this.page.locator('.location-card'),
                equipmentUnavailableLocationCardLocator: this.page.locator('.location-card')
                    .filter({ has: this.page.locator('.unavailable-pill') }),
            };
        }

        async findEquipmentUnavailableLocationCard(indexOrName: number | string) {
            if (typeof indexOrName === 'number') {
                return new LocationCard(this.elements.equipmentUnavailableLocationCardLocator.nth(indexOrName));
            } else {
                return new LocationCard(this.elements.equipmentUnavailableLocationCardLocator.filter({ hasText: indexOrName }));
            }
        }

        async continue() {
            await super.continue();
            return new SelectAppointmentDateTime(this.page);
        }
    }

    // ----
    // STEP
    // ----

    export class ScanNotAvailableAtFacilityStep extends UserStep {
        get elements() {
            return {
                title: this.page.locator('.modal--header h4').filter({ visible: true }),
                continueButton: this.page.locator('.modal-dialogue__container button', { hasText: 'Continue' }).filter({ visible: true }),
            };
        }

        async continue() {
            await this.elements.continueButton.click();
            return new SelectAppointmentDateTime(this.page);
        }
    }

    // ----
    // STEP
    // ----

    export class SelectAppointmentDateTime extends BookingStep {
        get elements() {
            return {
                ...super.elements,
                calendar: this.page.locator('.calendar'),
            };
        }
    }
}

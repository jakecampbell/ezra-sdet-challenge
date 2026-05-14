import { BookingFlow, expect, test } from 'flows';

/**
 * TC-01 of the list of Test Cases devised in response to Question 1 of this challenge.
 * @see [Q1 Booking Process Test Cases](../docs/q1BookingProcessTestCases.md)
 */
test.describe('Booking Flow Prescreen Tests', () => {
    test('TC01 - "Yes" answers to contraindication questions must hard-block the booking flow', async ({ page, SelectYourScanStep }) => {
        // As a user over the age of 35 and under the age of 85 Select a Heart CT scan
        await SelectYourScanStep.elements.heartCtCard.select();

        // Assert the card is selected
        await SelectYourScanStep.elements.heartCtCard.expectSelected();

        // Attempt to continue to the flow
        const SelectYourAddOnStep = await SelectYourScanStep.continue();

        // Assert no add-ons are available for the selected scan
        await SelectYourAddOnStep.expectStepNotVisible();

        // Assert the pre-screen questionnaire is displayed
        const PreScreenQuestionnaireStep = new BookingFlow.PreScreenQuestionnaireStep(page);
        await expect(PreScreenQuestionnaireStep.elements.submitButton).toBeVisible();

        // Fill the form with a yes answer
        await PreScreenQuestionnaireStep.fill({
            chestSymptoms: true,
            cardiacStent: false,
            pacemaker: false,
            coronaryHistory: false,
            coronaryCalciumScore: false,
            coronaryCalciumScoreGreaterThan400: false,
        });
        await PreScreenQuestionnaireStep.submit();

        // Assert the booking flow is blocked
        const FailedPreScreenStep = new BookingFlow.FailedPreScreenStep(page);
        await expect(FailedPreScreenStep.elements.backButton).toBeVisible();

        // Click back button
        await FailedPreScreenStep.elements.backButton.click();

        // Assert still on the SelectYourScanStep
        await expect(SelectYourScanStep.elements.heartCtCard.locator).toBeVisible();
        await SelectYourScanStep.elements.heartCtCard.expectSelected();
    });
});

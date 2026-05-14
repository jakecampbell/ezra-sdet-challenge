import { BookingFlow, expect, test } from 'flows';

/**
 * TC-07 of the list of Test Cases devised in response to Question 1 of this challenge.
 * @see [Q1 Booking Process Test Cases](../docs/q1BookingProcessTestCases.md)
 */
test.describe('Booking Flow Location Capability Tests', () => {
    test('TC07 - Selecting a scan location that does not support the chosen MRI plan allows user to continue with a supported plan', async ({ page, SelectYourScanStep }) => {
        // Select an MRI scan
        await SelectYourScanStep.elements.mriCard.select();

        // Assert the card is selected
        await SelectYourScanStep.elements.mriCard.expectSelected();

        // Continue to the next step
        const SelectYourAddOnStep = await SelectYourScanStep.continue();
        const ScheduleYourScanStep = await SelectYourAddOnStep.continue();

        // Assert next step reached
        await expect(ScheduleYourScanStep.elements.header).toBeVisible();
        await expect(ScheduleYourScanStep.elements.breadcrumb.selectedStep).toHaveText('Schedule your scan');

        // Choose a location without compatible equipment
        const locationCard = await ScheduleYourScanStep.findEquipmentUnavailableLocationCard(0);
        await locationCard.select();

        // Assert the flow is blocked because the selected location does not support the chosen MRI plan
        const ScanNotAvailableAtFacilityStep = new BookingFlow.ScanNotAvailableAtFacilityStep(page);
        await expect(ScanNotAvailableAtFacilityStep.elements.title).toBeVisible();
        await expect(ScanNotAvailableAtFacilityStep.elements.title).toHaveText('MRI Scan is not available at this facility.');

        // continue with the supported plan
        const SelectAppointmentDateTime = await ScanNotAvailableAtFacilityStep.continue();

        // Assert the location card is still selected and the booking flow continues to the appointment date time selection
        await locationCard.expectSelected();
        await expect(SelectAppointmentDateTime.elements.calendar).toBeVisible();
    });
});

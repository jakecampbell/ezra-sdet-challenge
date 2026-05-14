import { expect, test as base } from '../base.fixtures';
import { LoginFlow } from './login';
import { DashboardFlow } from './dashboard';
import { BookingFlow } from './booking';

type StartingSteps = {
    /**
     * Start the test on the login page.
     */
    LoginStep: LoginFlow.LoginStep;
    /**
     * Start the test on the dashboard page.
     */
    DashboardStep: DashboardFlow.DashboardStep;
    /**
     * Start the test on the booking flow SelectYourScanStep
     */
    SelectYourScanStep: BookingFlow.SelectYourScanStep;
};

export const test = base.extend<StartingSteps>({
    LoginStep: async ({ page }, use) => {
        const LoginStep = await LoginFlow.begin(page);
        await LoginStep.acceptCookies();
        await use(LoginStep);
    },
    DashboardStep: async ({ LoginStep, testUser }, use) => {
        await LoginStep.fill(testUser.email, testUser.password);
        const DashboardStep = await LoginStep.submit();
        await use(DashboardStep);
    },
    SelectYourScanStep: async ({ page, DashboardStep }, use) => {
        const SelectYourScanStep = await DashboardStep.bookAScan();
        await expect(SelectYourScanStep.elements.header).toBeVisible();
        await use(SelectYourScanStep);
    },
});

export { expect } from '../base.fixtures';

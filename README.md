# Ezra SDET Challenge — Playwright Test Suite

A TypeScript Playwright end-to-end test automation project built as a response to the Ezra SDET technical challenge.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node.js)
- Access credentials for an Ezra test account

---

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd ezra-sdet-challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.pw.example .env.pw
```

Open `.env.pw` and set the three required variables:

```
BASE_URL=https://<ezra-environment-hostname>
TEST_USER_EMAIL=<your-test-account-email>
TEST_USER_PASSWORD=<your-test-account-password>
```

> The `.env.pw` file is loaded automatically by `playwright.config.ts` at test runtime. It is listed in `.gitignore` and must never be committed.

---

## Running the Tests

| Command                 | Description                                          |
|-------------------------|------------------------------------------------------|
| `npm test`              | Run all tests across all configured browser projects |
| `npm run test:e2e`      | Run only the e2e test suite                          |
| `npm run test:chromium` | Run tests in Chromium only                           |
| `npm run test:firefox`  | Run tests in Firefox only                            |
| `npm run test:mobile`   | Run tests in Mobile Chrome only                      |
| `npm run test:headed`   | Run tests with a visible browser window              |
| `npm run test:debug`    | Run tests with the Playwright debugger               |
| `npm run test:ui`       | Open the Playwright interactive UI mode              |
| `npm run test:report`   | Open the last HTML test report                       |

### Viewing the HTML Report

After a test run, open the report with:

```bash
npm run test:report
```

---

## Project Structure

```
.
├── .env.pw.example          # Template for required environment variables
├── playwright.config.ts     # Playwright configuration (browsers, reporters, timeouts)
├── tsconfig.json            # TypeScript configuration with path aliases
├── package.json
└── tests/
    ├── base.fixtures.ts     # Root fixture: testUser credentials
    ├── docs/                # Challenge documentation and test case specifications
    │   ├── q1BookingProcessTestCases.md
    │   ├── q2IDORTestCase.md
    │   ├── foundBugs.md
    │   └── playwright.md
    ├── e2e/                 # Test spec files
    │   ├── login.spec.ts
    │   ├── bookingPrescreen.spec.ts
    │   └── bookingLocationCompatability.spec.ts
    └── flows/               # User flow library (page objects + fixtures)
        ├── index.ts
        ├── flow.fixtures.ts
        ├── login.ts
        ├── dashboard.ts
        ├── booking.ts
        └── common/
            ├── index.ts
            └── userStep.ts
        └── components/
            ├── index.ts
            ├── baseComponent.ts
            ├── breadcrumbStepper.ts
            ├── encounterCard.ts
            └── locationCard.ts
```

---

## Architecture

This project uses a **User Flow pattern** — a custom organization strategy I designed to make end-to-end tests user-centric.
For a full explanation of the design, see [`tests/docs/playwright.md`](tests/docs/playwright.md).

### Flows and Steps

Every file in `tests/flows/` exports a **namespace** representing a named user flow (e.g., `LoginFlow`, `BookingFlow`). Each namespace contains:

- A `begin()` function that navigates to the flow's entry point and returns the first step.
- **Step classes** (subclasses of `UserStep`) that model a single screen or modal in the flow. Each step exposes:
  - An `elements` property containing all Playwright locators for that screen.
  - Methods that drive transitions to the next step (e.g., `step.continue()` returns the next step instance).

This structure makes test scripts read like a user narrative and makes coverage gaps immediately visible.

### Fixtures

Playwright fixtures are co-located with the functionality they support:

- `tests/base.fixtures.ts` — provides base fixtures used across the entire test suite.
- `tests/flows/flow.fixtures.ts` — extends the base with flow-starting fixtures (`LoginStep`, `DashboardStep`, 
`SelectYourScanStep`) that handle setup so individual tests can start at any point in the flow without repeating logic.

All fixtures and flow exports are re-exported from `tests/flows/index.ts`, aliased as `flows` via `tsconfig.json` paths 
so test files can import cleanly:

```typescript
import { BookingFlow, expect, test } from 'flows';
```

---

## Challenge Automation Test Cases

TC-01 and TC-07 were chosen deliberately. TC-01 is the highest-priority case in the Q1 list - a Patient Safety / Clinical 
Liability scenario where automation has the most concrete risk-reduction value. TC-07 represents the Trust pillar and 
tests a non-trivial business rule (location-equipment compatibility). Together they also serve as clear examples of the 
User Flow pattern: TC-01 shows a **blocking negative path** (a conditional step is skipped, the flow is hard-stopped, and 
state is verified on back-navigation), while TC-07 shows a **conditional modal detour** (a mid-flow interstitial appears 
under a specific condition, then the flow resumes) with explicit multi-step chaining across three typed step transitions. 
TC-02 (end-to-end with Stripe) was too long and noisy. TC-01 and TC-07 sit at the right complexity level for the
structure and patterns to be readable at a glance.

### `bookingPrescreen.spec.ts` — TC-01

Implements [TC-01 from the Q1 test case list](tests/docs/q1BookingProcessTestCases.md): **Medical Gatekeeping**.

Verifies that answering "yes" to a cardiac contraindication question on the Heart CT pre-screen questionnaire hard-blocks
the booking flow and returns the user to the scan selection step with their prior selection preserved.

### `bookingLocationCompatability.spec.ts` — TC-07

Implements [TC-07 from the Q1 test case list](tests/docs/q1BookingProcessTestCases.md): **Location-Capability Sync**.

Verifies that selecting a scan location whose equipment does not support the chosen MRI plan presents the user with an 
incompatibility notice and allows them to continue with a supported plan variant, keeping the location selection intact.

### `login.spec.ts` — TC-00

Baseline configuration sanity check. Verifies that a test user can log in and reach the dashboard. I didn't have time
to investigate authentication injection in UI, so I opted to simply use the login form directly. For scalable testing,
I would recommend using an API-based authentication with UI injection to avoid having every test start with login.

### Future Automation Implementations

This is a very basic test suite. The user-flow pattern is well-suited for scalability and maintainability, but for a 
large robust test suite of end-to-end tests, several features are missing: dynamic test user selection, dymanic environment 
selection, network recording and replay, advanced test reporting, api-based data staging and validations, 
snapshot comparisons, and more.

---

## Challenge Question 1 - 15 prioritized test cases

My answers to all parts of question 1 are in [`tests/docs/q1BookingProcessTestCases.md`](tests/docs/q1BookingProcessTestCases.md).

## Challenge Question 2 - IDOR integration test case with raw HTTP request examples

My answers to all parts of question 2 are in [`tests/docs/q2IDORTestCase.md`](tests/docs/q2IDORTestCase.md).

## Documentation

| Document | Description |
|---|---|
| [`tests/docs/q1BookingProcessTestCases.md`](tests/docs/q1BookingProcessTestCases.md) | 15 prioritized test cases for the booking flow with risk-based justification |
| [`tests/docs/q2IDORTestCase.md`](tests/docs/q2IDORTestCase.md) | IDOR integration test case with raw HTTP request examples and a strategy for managing API security at scale |
| [`tests/docs/foundBugs.md`](tests/docs/foundBugs.md) | 8 bugs identified during exploratory testing of the booking flow |
| [`tests/docs/playwright.md`](tests/docs/playwright.md) | Explanation of the User Flow pattern used in this project |

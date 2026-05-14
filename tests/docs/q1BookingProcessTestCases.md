# Booking Process Test Cases

> **Part 1:** Devise 15 test cases throughout the 3 steps of the booking process.
> Devise test cases you think are the most important.
> List them in priority order.
>
> **Part 2:** Justify the top 3 test cases.

### Testing Strategy & Prioritization

In a healthcare environment like Ezra, software quality is not merely a measure of functional correctness – it is a
cornerstone of Patient Safety, Regulatory Compliance, and Operational Integrity. My approach to identifying and
ordering these 15 test cases is governed by Risk-Based Testing, where scenarios are weighted by their potential impact
on the patient and the business. I have categorized the test suite into four critical pillars:

1. **Privacy & Security:**
   A security lapse is not just a bug; it is a potential HIPAA compliance violation. My highest-priority case
   focuses on Insecure Direct Object Reference (IDOR) prevention and session integrity. We must verify that Protected
   Health
   Information (PHI) and medical questionnaires are isolated at the API level, ensuring that one member can never access
   or
   modify another’s clinical data.
2. **Clinical Liability & Safety (Eligibility Gatekeeping):**
   In healthcare automation, the "Negative Paths" are often more critical than the "Happy Path". A failure in medical
   eligibility logic—such as allowing an ineligible patient to book a scan—creates a dangerous clinical scenario and
   significant liability. My test cases validate the "gatekeeping" logic of the medical questionnaire to ensure we never
   clear a patient for a procedure that is medically contraindicated.
3. **Revenue Integrity & Financial Compliance:**
   As Ezra scales within the Function Health ecosystem, the durability of financial systems is paramount. My strategy
   ensures the handoff to Stripe and Affirm is 100% reliable. Validations for payment processing, financing terms, and
   promo code logic are mathematically accurate prevent both lost conversions and uncompensated medical services.
4. Patient Trust & Experience:
   The booking flow is a primary touchpoint for members. I focus on the "Trust" pillar by validating complex
   multi-appointment synchronization and location-based plan adjustments. If the software permits a booking that the
   physical imaging center cannot support, we fail our "Patient-First" mission and create administrative friction.

### Assumptions

I made the following assumptions while devising these test cases:

1. Scope: the scope described was the "first three steps of the booking process". I omitted features that are commonly
   interacted with immediately before or after the initiation/completion of this flow: login, join, dashboard display,
   medical questionnaire, logout.
2. Company start-up position: I noticed that the booking process is not accessible via keyboard navigation.
   This is a critical accessibility issue. However, since Ezra is a relatively new product under highly active
   development,
   I decided to de-prioritize some non-functional testing such as accessibility and internationalization.

## Part 1: Strategic Test Case List

| ID        | Pillar        | Scenario                                                                                                                                  | Expected Result                                                                                               |
|-----------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| **TC-01** | **Liability** | **Medical Gatekeeping:** "Yes" answers to contraindication questions (e.g., Heart CT) must hard-block the booking flow.                   | User is presented with a safety warning and prevented from proceeding to payment for that scan.               |
| **TC-02** | **Revenue**   | **End-to-End Booking Path:** Join/Book a scan -> Plan Selection (+add-ons) -> Location/Appointment date/time -> Successful Stripe Payment | User reaches the Confirmation page; Stripe reflects the correct transaction amount.                           |
| **TC-03** | **Trust**     | **Concurrency Race Condition:** Two users attempting to book the last available appointment slot simultaneously.                          | System prevents double-booking; the first user to pay secures the slot; the second is prompted to reschedule. |
| **TC-04** | **Liability** | **Age Restriction Logic:** Attempting to book a Heart or Lung CT scan for a user under the age of 35.                                     | System enforces clinical guidelines by disabling these specific add-ons.                                      |
| **TC-05** | **Privacy**   | **Session Inactivity Timeout:** Force logout after 600 seconds of inactivity on any step of the booking page.                             | Session is invalidated; user is redirected to Login; sensitive form data is cleared from memory.              |
| **TC-06** | **Revenue**   | **Financial Integrity:** Verify total in Stripe matches the logic of `Plan + Add-ons - Promo Code`.                                       | The transaction amount processed by Stripe is mathematically accurate to the selected items.                  |
| **TC-07** | **Trust**     | **Location-Capability Sync:** Selecting a scan location that does not support the chosen MRI plan.                                        | The plan is automatically adjusted to match the equipment available at that facility.                         |
| **TC-08** | **Trust**     | **Appointment Sequence Logic:** Booking multiple scans within a single plan.                                                              | System ensures the first appointment occurs chronologically before the subsequent appointments.               |
| **TC-09** | **Revenue**   | **Affirm Financing Integration:** Successfully completing the booking using Affirm as the payment method.                                 | User completes the external financing flow and is redirected back to the Ezra confirmation page.              |
| **TC-10** | **Revenue**   | **Promo Code Validation:** Applying an expired or invalid discount code during the checkout step.                                         | System rejects the code with a clear error message; the total cost remains at the original price.             |
| **TC-11** | **Trust**     | **State Persistence (Breadcrumbs):** Navigating backward and forward through the booking steps.                                           | Previously entered data (Name, DOB, Location) is retained without requiring re-entry.                         |
| **TC-12** | **Revenue**   | **Affirm Term Restrictions:** Attempting to use Affirm for an appointment booked more than 1 year in the future.                          | Affirm is hidden as a payment option due to financing term limits.                                            |
| **TC-13** | **Privacy**   | **Session Timeout:** Auto-logout when closing the page and returning after 600 seconds.                                                   | Session is invalidated; user is redirected to Login; sensitive form data is cleared from memory.              |
| **TC-14** | **Trust**     | **Mobile UI Responsiveness:** Completing the full booking and payment flow on a mobile viewport.                                          | All interactive elements (Modals, Date Pickers) are functional and accessible on small screens.               |
| **TC-15** | **Revenue**   | **Payment Failure Recovery:** Attempting to pay with a declined credit card.                                                              | User receives a specific, non-technical error and remains on the payment page to try a different method.      |

## Part 2: Top 3 Justification

### 1. TC-01: Liability (Medical Gatekeeping)

This is about **Patient Safety**. If Ezra fails to block an ineligible user from a scan, there is a physical
risk for the member. The application must act as a reliable clinical barrier before a patient ever reaches an imaging
center.

### 2. TC-02: Revenue (End-to-End Critical Path)

This is the primary business engine. If a member cannot successfully navigate through the booking steps to a
"Paid Confirmation," the mission of detecting cancer early fails. This test ensures the critical integrations between
the Member Portal, the Scheduler, and Stripe are functioning in harmony.

### 3. TC-03: Trust (Appointment Concurrency)

This preserves Operational Scalability. Double-booking creates high-volume support tickets, forces manual rescheduling,
and damages the "Patient-First" brand reputation with both members and partner facilities.

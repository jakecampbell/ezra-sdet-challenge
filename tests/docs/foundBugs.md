# Found Bugs

The following bugs were observed during exploratory testing of the booking flow. They were not part of the
formal test scope but are reported here for visibility. Full reproduction details are available on request.

---

## Summary

| ID | Severity | Title |
|----|----------|-------|
| [BUG-001](#bug-001) | Medium | Calendar navigation is restricted after an initial date selection |
| [BUG-002](#bug-002) | Medium | Downgrading a plan does not re-evaluate the selected location's compatibility |
| [BUG-003](#bug-003) | Medium | Scan selection page is not keyboard accessible |
| [BUG-004](#bug-004) | Low | Booking flow provides no guidance for first-time users |
| [BUG-005](#bug-005) | Low | Multi-date appointment request gives no explanation to the user |
| [BUG-006](#bug-006) | Low | Selecting a scan scrolls the page down and leaves the continue button disabled with no explanation visible |
| [BUG-007](#bug-007) | Low | Returning to the plan review page does not restore the previous selection highlight |
| [BUG-008](#bug-008) | Low | Add-on availability is asymmetric between Heart CT and Lungs CT |

---

## BUG-001

**Severity:** Medium  
**Area:** Appointment Scheduling — Date/Time Selection

**Description:**  
After selecting a date and time for an appointment, if the user returns to the date/time selection step, they
cannot navigate to any month prior to the one in which the original selection was made. The calendar's backward
navigation is effectively blocked by the first selection.

**Expected:** The user can freely navigate to any available month regardless of prior selections.  
**Actual:** Backward month navigation is blocked at the month of the initial selection.

---

## BUG-002

**Severity:** Medium  
**Area:** Plan Selection — Location Compatibility

**Steps to reproduce:**
1. Select an MRI Scan plan.
2. Continue to the schedule page and choose a location that only supports MRI with Spine.
3. Accept the notice of the package change.
4. Click the **Review Your Plan** breadcrumb.
5. Re-select the base MRI Scan (without Spine) and click **Continue**.

**Expected:** The system detects that the selected location no longer supports the chosen plan and either
prompts the user to choose a new location or resets the location selection.  
**Actual:** The incompatible location remains selected with no warning or indication that the plan change was
not fully applied.

---

## BUG-003

**Severity:** Medium  
**Area:** Scan Selection — Accessibility

**Description:**  
The scan selection page cannot be navigated or operated using a keyboard alone. Interactive elements (scan
cards) do not receive focus and cannot be activated via the keyboard, which fails WCAG 2.1 Success Criterion
2.1.1 (Keyboard).

**Expected:** All scan cards are reachable and selectable via keyboard navigation (Tab, Enter/Space).  
**Actual:** Keyboard focus does not reach scan cards; selection is only possible via mouse.

---

## BUG-004

**Severity:** Low  
**Area:** Booking Flow — Onboarding / UX

**Description:**  
The booking flow begins immediately on plan selection with no introductory context. Users unfamiliar with the
available scan types have no guidance on how to choose. A brief intro screen or contextual tooltips would
reduce drop-off for first-time users.

---

## BUG-005

**Severity:** Low  
**Area:** Appointment Scheduling — UX

**Description:**  
On some bookings, the appointment scheduling step presents multiple date/time selection inputs without
explaining why more than one is required (e.g., due to scan type, availability constraints, or multi-part
appointments). Users are left to guess the reason.

**Expected:** A short explanation is shown when multiple date/time selections are required.  
**Actual:** Multiple inputs appear with no context.

---

## BUG-006

**Severity:** Low  
**Area:** Plan Selection — UX / Scroll Behavior

**Description:**  
When a scan is selected on the plan selection page before the date-of-birth and sex fields are filled in, the
page scrolls down to the bottom. The **Continue** button is disabled, but the unfilled fields that are causing
the block are now above the fold and not visible. The user has no immediate indication of why they cannot
proceed.

**Expected:** The page either keeps the required fields in view or displays an inline validation message near
the **Continue** button.  
**Actual:** The page scrolls down, the disabled **Continue** button is visible, but the reason for it being
disabled is off-screen.

---

## BUG-007

**Severity:** Low  
**Area:** Plan Review — UX

**Description:**  
Navigating back to the plan review page (e.g., via the breadcrumb) does not restore the visual highlight on
the previously selected plan. The user must re-identify their selection manually, which creates uncertainty
about the current state of the booking.

**Expected:** The previously selected plan is highlighted when the user returns to the plan review page.  
**Actual:** No plan appears selected; the page renders as if no selection has been made.

---

## BUG-008

**Severity:** Low  
**Area:** Plan Selection — Add-on Logic

**Description:**  
Add-on availability between Heart CT and Lungs CT is not symmetric:

- Selecting **Heart CT** as the primary scan → Lungs CT is **not** available as an add-on.
- Selecting **Lungs CT** as the primary scan → Heart CT **is** available as an add-on.

This inconsistency is likely unintentional and may confuse users or allow unintended plan combinations.

**Expected:** Add-on availability is consistent regardless of which scan is chosen as the primary.  
**Actual:** Availability depends on selection order in a way that is not explained to the user.

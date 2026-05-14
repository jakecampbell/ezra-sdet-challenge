# Insecure Direct Object Reference (IDOR) Test Case

> **Part 1:** Devise an integration test case that prevents members from accessing other's medical data.
>
> **Part 2:** Devise HTTP requests from Part 1 to implement the test case.
>
> **Part 3:** How can Ezra manage the security of 100's of endpoints?

## Part 1: Test Case

### Pillar:

Privacy & Security

### Scenario:

Verify that an authenticated Member (User A) is strictly prohibited from accessing or modifying the Medical
Questionnaire data belonging to another Member (User B) via direct API manipulation.

### Steps:

1. Authentication: Authenticate as User A and capture a valid Bearer token.
2. Unauthorized Request: Given a known questionnaire id belonging to User B, attempt to perform a GET request to the
   questionnaire endpoint (`/diagnostics/api/medicaldata/forms/mq/submissions/{quesitonnaireId}/data`) using User A's
   token
   but User B's questionnaire id.
3. Data Modification Attempt: Attempt a POST request to modify User B's questionnaire data using User A's token.

### Expected Results:

- The API must return an HTTP status code 403 Forbidden or 404 Not Found.
- The response body must not contain any PHI or medical data belonging to User B.

## Part 2: HTTP Requests

1. Export login credentials to environment vars:

```shell
export BASE_URL=
export CLIENT_ID=
export USER_A_EMAIL=
export USER_A_PASSWORD=
export USER_B_QUESTIONNAIRE_ID=
```

2. Authenticate as User A and capture a valid Bearer token:

```shell
curl \
 -d "grant_type=password&scope=openid+offline_access+profile+roles+email&username=$USER_A_EMAIL&password=$USER_A_PASSWORD&client_id=$CLIENT_ID"\
 -X POST "$BASE_URL/individuals/member/connect/token"
```

Copy the `access_token` from the response body. Export the access token as an environment variable:

```shell
export ACCESS_TOKEN=
```

3. Unauthorized Request:

```shell
curl \
 -H "Authorization: Bearer $ACCESS_TOKEN" \
 "$BASE_URL/diagnostics/api/medicaldata/forms/mq/submissions/$USER_B_QUESTIONNAIRE_ID/data"
```

Expected Response: 403 Forbidden

```json
{
  "message": "Authentication failed",
  "path": "/api/medicaldata/forms/mq/submissions/6622/data"
}
```

4. Data Modification Attempt:

```shell
curl \
 -H "Authorization: Bearer $ACCESS_TOKEN" \
 -H "Content-Type: application/json" \
 -X POST "$BASE_URL/diagnostics/api/medicaldata/forms/mq/submissions/$USER_B_QUESTIONNAIRE_ID/data" \
 -d '{"key":"ethnicOrigin","value":"\"other\"","hasAnswer":true}'
 ```

Expected Response: 403 Forbidden

```json
{
  "message": "Authentication failed",
  "path": "/api/medicaldata/forms/mq/submissions/6622/data"
}
```

## Part 3: Security

My thought process for managing security quality at this scale involves engineering security into the SDLC. Managing a
large surface area of sensitive endpoints requires an **OWASP-aligned**, developer-driven security model. I propose a
strategy that focuses on high-confidence automation at the lowest possible level of the stack:

1. Contract-First API Development (OpenAPI/Swagger):
   Before a single line of code is written, define the API contract using OpenAPI specifications. This allows us to
   enforce strict schema validation—ensuring that endpoints only accept and return exactly what is defined. By defining
   security requirements directly in the spec, we create a "source of truth" that our automation can audit against.
2. Test-Driven Development (TDD) for Security:
   Security shouldn't be an afterthought. I advocate for writing Security Unit Tests that target authorization logic at
   the function level. For every endpoint, we should have unit tests specifically validating the endpoint
   authorization logic and data exposure.
3. Tiered Security Validation:
    - Unit Level: Validate granular permission logic, data masking, controllers and middleware, data stores.
    - Integration Level: Test the interactions between system components (e.g., verifying that the Auth service and the
      Booking service hand off tokens correctly). Testing authorization logic across multiple components.
    - Architectural Level: Validate the security of the system’s architecture, such as ensuring that internal
      microservices are not inadvertently exposed to the public.
4. Enforcement of Non-Enumerable Identifiers (UUIDs):
   We strictly avoid auto-incrementing integers for primary keys (e.g., .../questionnaire/101). Resource IDs should be
   impossible to guess or "scrape," significantly mitigating the success rate of a potential IDOR attack.

**Trade-offs and Potential Risks**

Trade-off: Initial Development Velocity vs. Long-term Stability

Implementing a contract-first, TDD-heavy approach requires more upfront time from both developers and QA engineers.
It can feel like a bottleneck during the initial stages of a sprint. However, it drastically reduces "rework" and
expensive late-stage bug fixes. In healthcare, shipping a vulnerability is far more costly than shipping a feature a
few days later.

Risk: Contract Drift

If developers update code without updating the OpenAPI spec, our automated security audits lose their
effectiveness. However, we can use automated contract testing to ensure the implementation and the documentation
remain in sync.

Risk: Over-Reliance on Automation

While unit and integration tests are excellent at catching known patterns (like IDOR), they may miss complex,
multi-step business logic vulnerabilities. We can supplement automated tests with periodic, focused manual security
"bug bashes" and external penetration testing to view the system from an attacker's perspective.

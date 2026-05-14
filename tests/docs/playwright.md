# Playwright End-to-End Tests

This implementation of playwright follows a **user flow pattern** that I designed myself. It is a highly effective
organization strategy for writing end-to-end tests that prioritizes the user's experience over the test's
implementation. End-to-end test automation should be user-centric – testing what a **user** can/might do, rather than
what a page can do. This organizational pattern is also highly effective for auditing user flow test coverage because
it allows you to see exactly which flows and steps in a flow are covered by tests. LLM's are particularly good at
understanding this organization of user flows and steps, making this pattern a great fit for AI tool usage.

## User Flows

Every file in the `tests/flows` directory is a collection of user flows. Each flow is a collection of
steps that a user can take. These flows are organized into namespaces, making them easy to identify and reference in
code. For example, `flows/login.ts` contains the `LoginFlow` namespace, with methods and step classes for each step in
the login flow.

Every flow should have a `begin` function that starts the flow - usually by navigating to a page - and returns the
first step of the flow.

## User Steps

User steps are classes that contain the elements and methods for a user experience step within a user story flow. User
step classes should follow the following conventions:

- They must be a child class of `UserStep`.
- They must be defined within a user flow namespace unless they are shared or abstract.
- Steps shared across flows should be defined in the `flows/common` directory.
- All UI elements should be defined in the `elements` property.

## Fixtures

Fixture definitions are located in files closest to the functionality they provide. For example, flow fixtures are
located in `tests/flows/flow.fixtures.ts`. These fixtures provide user flow initiation logic.

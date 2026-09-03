# Playwright Test Automation Framework

This project is a test automation framework built with Playwright and TypeScript. It has evolved from individual test scenarios into a maintainable framework with reusable components supporting UI, API, and integration testing, including API-assisted UI scenarios.

The architecture aims to keep tests readable and focused on their intent by separating reusable setup and implementation details into API clients, helpers, custom fixtures, typed models, and page objects.

## Project structure

```text
├── api/
│   ├── clients/
│   ├── helpers/
│   └── models/
├── config/
├── fixtures/
├── pages/
├── tests/
│   ├── api/
│   └── ui/
├── .env.example
└── playwright.config.ts
```

- `api/`: API-specific components, including client classes responsible for endpoint interactions, helper functions for reusable API workflows, and models defining request/response data types.
- `config/`: Framework configuration utilities. `env.ts` loads required environment variables and fails early when mandatory configuration is missing.
- `fixtures/`: Composable Playwright fixtures. `api.fixture.ts` manages the API request context and exposes API clients. `authenticated.fixture.ts` extends it with user creation, authentication, and an authenticated browser page initialized through storage state.
- `pages/`: Page objects encapsulating UI locators and reusable interactions.
- `tests/`: Test specifications separated into API and UI projects. UI specifications also contain API-assisted integration scenarios when API setup and UI verification are combined.
- `.env.example`: Template containing the environment variables required to configure the UI and API base URLs without committing local `.env` values.
- `playwright.config.ts`: Playwright configuration defining the UI and API projects, their test matching rules, project-specific base URLs, and shared test options.

## Architecture & Design Decisions

### Dedicated API Request Context

UI tests inherit the UI `baseURL` defined in the Playwright project configuration. However, some UI scenarios require direct API calls for test setup or integration flows. To keep these calls independent from the project executing the test, the API fixture creates a dedicated `APIRequestContext` configured with the API `baseURL` and exposes API clients that share this context.

### Layered and Composable Fixtures

Fixtures are organized by capability so tests only depend on the setup they require. `api.fixture.ts` manages the dedicated API request context and exposes API clients, while `authenticated.fixture.ts` extends it with fresh user data, authentication, and an authenticated browser page initialized through storage state.

This allows API and scenarios requiring API access to use the API fixture without unnecessary browser authentication setup, while authenticated UI and integration scenarios can reuse the additional authentication layer.

### API-Assisted Authentication

Authentication is performed through the API for scenarios where login itself is not under test. A fresh user is created and authenticated during fixture setup, and the resulting token is applied to a new browser context through storage state.

This keeps authentication transparent to tests that only require an authenticated user, reduces repetitive UI setup, and avoids coupling unrelated UI scenarios to the login flow. Tests specifically targeting login behavior can still exercise the authentication flow explicitly through the UI.

### Isolated Test Data

Authenticated tests create a fresh user as part of their setup instead of relying on pre-existing accounts. The target environment does not guarantee persistent test data and its database may be cleared frequently, making shared or predefined users unreliable.

Generating users on demand keeps tests independent from pre-existing data and reduces dependencies between test executions, improving test isolation and reliability.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Install project dependencies:

```bash
npm install
```

2. Install the Playwright browsers:

```bash
npx playwright install
```

3. Create a local `.env` file based on the provided template:

```bash
cp .env.example .env
```

### Running the Tests

Run the complete test suite:

```bash
npm test
```

Run only UI tests:

```bash
npx playwright test --project=ui 
```

Run only API tests:

```bash
npx playwright test --project=api
```

Run the TypeScript check:

```bash
npm run typecheck
```
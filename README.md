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
│   ├── ui/
│   ├── support/
│   └── effectiveness/
├── specs/
├── .codex/agents/
├── .env.example
└── playwright.config.ts
```

- `api/`: API-specific components, including client classes responsible for endpoint interactions, helper functions for reusable API workflows, and models defining request/response data types.
- `config/`: Framework configuration utilities. `env.ts` loads required environment variables and fails early when mandatory configuration is missing.
- `fixtures/`: Composable Playwright fixtures. `api.fixture.ts` manages the API request context and exposes API clients. `authenticated.fixture.ts` extends it with user creation, authentication, and an authenticated browser page initialized through storage state.
- `pages/`: Page objects encapsulating UI locators and reusable interactions.
- `tests/`: API and UI specifications, including API-assisted integration scenarios, shared journey functions, and an opt-in effectiveness suite excluded from ordinary UI/API discovery.
- `specs/`: Exercise specifications, test plans, exploration observations and limitations.
- `.codex/agents/`: Playwright planner, generator and healer agent definitions. These use Playwright tools; they are not a custom agent framework.
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
- Network access to the configured demo UI and API, including registration and login endpoints.
- For agent-assisted exploration and generation: Codex with the Playwright Test MCP server connected and the required tools available. Running committed tests does not require an agent session.

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

Set `UI_BASE_URL` and `API_BASE_URL` in `.env` for the intended demo environment. Keep local values out of version control.

For the optional agent workflow, Codex launches the Playwright Test MCP server through local MCP configuration. Configure its command and arguments to invoke the installed server from the repository root; the equivalent command is:

```bash
./node_modules/.bin/playwright run-test-mcp-server
```

Manually running this command does not establish a Codex MCP connection. `.codex/config.toml` is ignored because connection settings may contain machine-specific paths. Verify the required tools are exposed in the Codex session before invoking an agent.

### Running the Tests

Run the ordinary UI/API suite (excludes the opt-in effectiveness cases):

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

## Playwright-agent workflow

The Favourites exercise used the installed planner to explore the demo UI and save [the plan](specs/favourites-ui-persistence.md), followed by the generator to create a test for human review. The healer definition is available but was not invoked for this exercise.

`tests/ui/seed.spec.ts` is an exploration entry point for project `ui`. The regression test independently uses `authenticatedPage`; it does not require the seed to run first or reuse an exploratory session. The shared journey selects a catalogue product at runtime, adds it through its product page once, and checks one total favourite entry with the captured exact title before and after reload.

Run only the regression:

```bash
./node_modules/.bin/playwright test \
  tests/ui/favourites-ui-persistence.spec.ts \
  --project=ui --workers=1 --retries=0
```

## Opt-in assertion-effectiveness check

Commit `d0d0d92` adds two independent tests using the same journey and assertions with fresh authenticated fixtures:

- **Baseline:** real responses throughout; expected to pass.
- **Fault:** after pre-reload assertions pass, replace the reload-triggered GET `/favorites` response with `[]`. Routing is restricted to the configured API origin, exact path and GET method.

Run explicitly:

```bash
./node_modules/.bin/playwright test \
  --config=tests/effectiveness/playwright.config.ts \
  --workers=1 --retries=0
```

Interpret results manually. Intended detection requires all of:

- Baseline passes and fault-case pre-reload checks complete.
- Upstream contains the favourite, and exactly one successful replacement delivers an empty collection.
- The labelled **Post-reload Favourites total entry count** assertion fails with expected **1**, received **0**.

Intended detection produces one pass, one deliberate assertion failure and exit status 1. If baseline passes and the injection is confirmed but the fault test passes, classify it as **fault missed**. Setup errors, missing interception evidence or unrelated failures are **inconclusive**. Exit status alone is insufficient. No automated effectiveness classifier or expected-failure marker is implemented.

Inspect `test-results/effectiveness/results.json` and `playwright-report/effectiveness/index.html`. Attachments record addition status, completion of pre-reload checks, upstream/delivered collection lengths and successful fulfilment count. Reports and exploration artifacts are ignored.

## Recorded verification and limitations

Historical validation recorded type checking and discovery checks passing, followed by a passing targeted regression execution. In the recorded effectiveness run on 2026-11-17, baseline passed and the fault case recorded upstream length 1, delivered length 0, one fulfilment and the intended labelled assertion failure. These observations are not current CI status or evidence of production use or broad reliability.

- Favourites identity verification uses the captured exact title because no product ID/link was observed on its card.
- Tests depend on the external demo service and current UI structure. Sandbox DNS failures occurred during setup; an earlier exploratory addition returned 401 for an unresolved reason.
- Authentication failures remain failures; persistence is then unverified.
- This check covers one empty-after-reload fault. Broader fault coverage, repeated-add behaviour and cross-session persistence are not implemented by this exercise.

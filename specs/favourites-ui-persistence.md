# Favourites UI persistence — portfolio exercise

## Application Overview

## Exercise specification

This is the agreed portfolio exercise specification, not an official application requirement: “A signed-in user adds a product to Favourites from its product page. The product appears exactly once on the Favourites page and remains there after a page reload.”

## Scope

One scenario: one UI addition, exact selected-product count before and after a full document reload. No API additions, repeated-add/idempotency scenario, removal, cart, or other account flows. The generated test is `tests/ui/favourites-ui-persistence.spec.ts`; exploration observations below describe their respective historical runs.

## Preconditions and test-data assumptions

- Run the future generated test in project `ui`, directly using `test` and `authenticatedPage` from the existing `fixtures/authenticated.fixture.ts`. The fixture creates its own authenticated browser context; the test performs its own catalogue and Favourites navigation. It must not depend on `tests/ui/seed.spec.ts` executing beforehand or share the planner's exploratory session. The seed is an exploration entry point only. Begin with a fresh account/favourites state.
- The catalogue and chosen product must be available. The authenticated fixture must establish a server-accepted signed-in session; a displayed user name alone is insufficient proof of write authorization.
- Before addition, verify the fresh user's Favourites list is empty: the loaded page shows its empty-state message and zero favourite entries. Do not reuse a populated account or perform cleanup within this scenario.
- Select an available product through the current catalogue UI. A suitable candidate has a visible product card with a non-empty displayed title and a product link; opening it must load the matching product URL, show the same exact title, and expose a visible, enabled `Add to favourites` button. Choose one such candidate without requiring a particular card position or checking catalogue-wide title uniqueness. If no suitable candidate is available, fail the data/setup precondition with evidence rather than creating a product or substituting an API addition.
- Capture the chosen card's displayed name and product href/ID at runtime. Use the captured href/ID to verify product-page navigation and the captured name for exact title assertions. Do not assert historical IDs, names, prices, brands or categories; those details below are exploration observations only.
- After the single UI addition, assert that exactly one favourite entry exists in the entire loaded Favourites list and its title exactly matches the captured name, both before and after reload. Count entries, not repeated name occurrences in image alt text and headings. No card product ID/link was observed, so these assertions retain a name-only identity limitation and do not independently establish product-ID identity.

## Exploration observations (2026-11-04)

1. Seed completed and paused normally at the catalogue. The UI showed `Pepe Lorca`; its menu exposed `My favorites` and `Sign out`.
2. `My favorites` navigated to `/account/favorites`, heading `Favorites`, with “There are no favorites yet. In order to add favorites, please go to the product listing and mark some products as your favorite.”
3. Opened the observed Combination Pliers catalogue card, verified its product page and clicked `Add to favourites` exactly once. The UI displayed: **“Unauthorized, can not add product to your favorite list.”**
4. Returned via the account menu to Favorites. No selected product or other favourite entry was displayed; the empty-state message remained.
5. Performed a full document reload of `/account/favorites` using `window.location.reload()` through a browser tool. The same Favorites heading and empty-state message remained.

### Retained evidence for the earlier failed addition

- The planner's retained network capture showed `POST https://api.practicesoftwaretesting.com/favorites` returning **401**. Relevant `GET /users/me` requests returned 200 before the addition, 401 after it, and 200 after reload. This is an observed application authentication failure whose cause remains unresolved; it is not evidence of a persistence defect.

### Separate diagnostic failures

- One proposed custom diagnostic was rejected before execution.
- A later custom diagnostic failed with `ReferenceError: URL is not defined`; subsequent tools reported `Test has already stopped`. Whether that diagnostic reached the addition is unverified. These are diagnostic/session failures, not additional confirmed application 401s.
- A subsequent inspection failed because an assumed selector used an earlier product ID. That attempt stopped before clicking Add to favourites. The correction used an unrestricted snapshot and its observed current product link.

### Later successful UI addition and reload observation

1. Continued the existing seed session without restarting it for the addition or reload. Session age and exact login-to-attempt time are **unverified**.
2. Opened `Combination Pliers` through the current catalogue link, `/product/01M6M2BXPKDXYFCHEJ9FHHQYE0`. This differs from the earlier observed product ID; neither is a permanent fixture value.
3. Identified the current product-page button from its DOM text `Add to favourites` and observed `data-test="add-to-favorites"`, then clicked it **exactly once**. The visible alert was **“Product added to your favorites list.”** Built-in network evidence showed `POST https://api.practicesoftwaretesting.com/favorites` returning **201**, with two retained `GET /users/me` requests returning **200**. No authentication values were inspected for this attempt.
4. Navigated through `My favorites` to `/account/favorites`. One Combination Pliers card appeared.
5. Reloaded that Favourites document **once** using the built-in browser evaluation tool and `window.location.reload()`. The page returned with heading `Favorites` and the product still visible. A DOM count found **exactly one** level-5 heading whose trimmed text was exactly `Combination Pliers`; the matching heading was visible, and the snapshot showed one corresponding favourite card. The image alt text was not counted as a second entry.
6. The inspected card container exposed no product links or ID/data attributes. Consequently the post-reload match relies **only on the exact product name**, not verification against the captured product ID. This supports visible single-entry persistence for Combination Pliers in this run, with that identity limitation. The earlier 401 did not reproduce; its cause remains unknown. No second favourite was added, no retry or seed restart occurred during this continuation, and no test code was generated.

## Ambiguities and requirement discrepancies

- In the original planner run, the visible signed-in name conflicted with the Unauthorized add result. That run did not establish accepted authentication for addition or successful persistence. The later 201 and visible persistence are separate successful evidence, with name-only identity matching; they do not explain or invalidate the earlier authentication/precondition discrepancy. Do not report the earlier failure as a proven persistence defect.
- The UI uses mixed spelling: `Add to favourites`, `My favorites`, and `Favorites`; these refer to the exercise's Favourites flow.
- Empty-state help refers to marking products from the product listing, whereas the agreed exercise specifically requires the product-page button. The actual product page exposes that button; follow the exercise's product-page route.
- “Exactly once” is interpreted as one saved entry for the selected product after a single click, and again after reload. Repeated clicking, cross-session/device persistence, and duplicate prevention after repeated additions are unspecified and outside this exercise.
- No success-toast wording, populated favourite-card selector, or persistence outcome was inferred from the failed add.

## Success and failure criteria

Pass only if the fresh user's Favourites list is empty initially, a single product-page addition succeeds for a signed-in user, and exactly one favourite entry exists in the entire list with a title exactly matching the captured name, both before and after a full reload. Zero matches or more than one match fails the corresponding requirement assertion. An Unauthorized addition must fail the test with evidence: preserve the visible error and the add request method, endpoint and response status where available, without secret values. Persistence is then unverified. Do not suppress the failure, skip the test, retry the addition or test, or substitute an API addition. Favourites assertions require exactly one entry in the entire loaded list and an exact match between its title and the runtime-captured name, before and after reload. No card product ID/link was observed, so this remains name-only identity verification.

## Test Scenarios

### 1. Single product favourite persistence

**Exploration seed only:** `tests/ui/seed.spec.ts`

**Test setup:** Directly use the existing authenticated fixture in `fixtures/authenticated.fixture.ts` and its `authenticatedPage`. The generated test navigates for itself and runs independently of the seed and planner session.

#### 1.1. A signed-in user adds one product from its product page and sees it exactly once after Favourites reload

**File:** `tests/ui/favourites-ui-persistence.spec.ts`

**Steps:**
  1. Run in project ui with the existing authenticated fixture's own authenticatedPage and fresh account/favourites state. Navigate that page to the catalogue, wait for it to load and inspect the account menu. Do not run seed.spec.ts as a prerequisite or reuse the planner session.
    - expect: Catalogue product cards are loaded.
    - expect: The user's account menu is visible with My favorites and Sign out. Treat this as visible session evidence; the later authorized addition must also succeed.
  2. Open the account menu > My favorites and wait for the Favorites page to finish loading. Verify the fresh user's Favourites list is empty before selecting and adding a product.
    - expect: URL is /account/favorites and heading is Favorites.
    - expect: The loaded list contains zero favourite entries and its empty-state message is visible.
  3. Return to the catalogue through the site logo/Home. Select one visible product card with a non-empty displayed title and a product link. Capture its displayed name and href/ID at runtime, then open that card. Use the captured href/ID to verify navigation and retain the captured name for Favourites assertions.
    - expect: The product-page URL matches the captured href/ID.
    - expect: The visible product heading exactly matches the captured name.
    - expect: The Add to favourites button is visible and enabled, making this candidate suitable for the single addition.
    - expect: No historical product ID, name, price, brand or category is asserted; no catalogue-wide uniqueness check or product creation is required.
  4. Click Add to favourites exactly once on the selected product page and wait for the add operation's visible outcome.
    - expect: The addition succeeds without an Unauthorized or other error.
    - expect: If an Unauthorized addition occurs, fail the test with the visible message and request method, endpoint and status where available, without secret values. Persistence is then unverified. Do not suppress the failure, skip, retry the addition or test, or add via API.
  5. Open the user menu > My favorites. Wait for the loaded Favorites content and count all favourite entries in the list, then inspect the sole entry's title. No card product ID/link was observed, so title matching relies on name only.
    - expect: Favorites page at /account/favorites is displayed.
    - expect: Exactly one favourite entry exists in the entire loaded list.
    - expect: That entry's title exactly matches the runtime-captured product name. No independently verified product-ID match is claimed.
    - expect: The empty-state message is absent. Multiple text nodes inside one entry do not count as duplicates.
  6. Perform a full browser/document reload while on /account/favorites, wait for loaded content again, and repeat the total-entry count and exact-title assertion, retaining the name-only identity limitation.
    - expect: The Favorites page returns after reload without requiring an unexpected new login.
    - expect: Exactly one favourite entry exists in the entire loaded list and remains visible.
    - expect: Its title exactly matches the same runtime-captured name. No product-ID/link match is claimed.
    - expect: Zero entries, more than one entry, or a title mismatch fails the corresponding assertion. A successful toast alone is not evidence of persistence.

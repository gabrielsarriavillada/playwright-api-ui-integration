import { test } from "../../fixtures/authenticated.fixture.js";
import { env } from "../../config/env.js";
import { favouritesPersistenceJourney } from "../support/favourites-persistence-journey.js";

// Independent tests: no serial group, expected-failure marker or automated classification.
test("baseline: real Favourites responses", async ({ authenticatedPage }, testInfo) => {
    await favouritesPersistenceJourney(authenticatedPage, testInfo);
});

test("fault: reload delivers an empty Favourites collection", async ({ authenticatedPage }, testInfo) => {
    let fulfilledCount = 0;
    await favouritesPersistenceJourney(authenticatedPage, testInfo, async () => {
        // This callback is reached only after every pre-reload assertion passes.
        await testInfo.attach("pre-reload-checks-passed", {
            body: JSON.stringify({ preReloadChecksPassed: true }),
            contentType: "application/json",
        });
        const apiOrigin = new URL(env.apiBaseUrl).origin;
        await authenticatedPage.route(
            url => url.origin === apiOrigin && url.pathname === "/favorites",
            async route => {
                if (route.request().method() !== "GET") {
                    await route.fallback();
                    return;
                }
                const upstream = await route.fetch({ timeout: 15_000, maxRetries: 0, maxRedirects: 0 });
                if (!upstream.ok()) {
                    throw new Error(`Fault setup inconclusive: upstream GET /favorites returned ${upstream.status()}`);
                }
                const body: unknown = await upstream.json();
                if (!Array.isArray(body)) {
                    throw new Error("Fault setup inconclusive: GET /favorites is no longer a root array");
                }
                // Observed 2026-11-17: successful GET /favorites, application/json, root array; empty = [].
                await route.fulfill({ response: upstream, json: [] });
                fulfilledCount += 1;
                // No headers, bodies, identifiers or authentication values are attached.
                await testInfo.attach(`reload-favourites-fulfilled-${fulfilledCount}`, {
                    body: JSON.stringify({
                        method: "GET",
                        endpoint: `${apiOrigin}/favorites`,
                        status: upstream.status(),
                        contentType: "application/json",
                        rootType: "array",
                        upstreamCollectionLength: body.length,
                        deliveredCollectionLength: 0,
                        successfulFulfilments: fulfilledCount,
                    }, null, 2),
                    contentType: "application/json",
                });
            },
        );
    });
});

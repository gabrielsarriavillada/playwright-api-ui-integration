import type { Product, ProductsResponse } from "../models/products.js";

function isProduct(value: unknown): value is Product {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (!("id" in value) || typeof value.id !== "string") {
        return false;
    }

    if (!("name" in value) || typeof value.name !== "string") {
        return false;
    }

    return true;
}

export function isProductResponse(value: unknown): value is ProductsResponse {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (!("data" in value) || !Array.isArray(value.data)) {
        return false;
    }

    return value.data.every((product) => isProduct(product));
}
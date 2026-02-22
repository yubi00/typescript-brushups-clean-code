/**
 * EXERCISE 15: Comprehensive Refactoring Challenge (Mock Assessment)
 *
 * This simulates a REAL refactoring assessment. You're given a "legacy"
 * system with multiple code smells. Your job: refactor it to clean code.
 *
 * SCENARIO: A food delivery order management system.
 * It works (all tests pass), but the code is terrible.
 *
 * CODE SMELLS TO FIND AND FIX:
 * 1. God function (processDeliveryOrder does EVERYTHING)
 * 2. Magic numbers everywhere (what's 5.99? what's 0.0875? what's 2.5?)
 * 3. Poor naming (d, t, p, calc, etc.)
 * 4. Deeply nested conditionals (arrow anti-pattern)
 * 5. Duplicate logic (fee calculation repeated)
 * 6. No types for important data (string-based "type" checks)
 * 7. Mixed responsibilities (pricing, validation, formatting all in one place)
 * 8. No separation of concerns
 *
 * RULES:
 * - The refactored code MUST produce the SAME output as the original
 * - You can create as many types, interfaces, functions, and classes as needed
 * - Apply everything you've learned: SOLID, clean functions, guard clauses,
 *   discriminated unions, exhaustiveness checking, parameter objects, etc.
 *
 * TIPS:
 * - Start by identifying the responsibilities (what does this code DO?)
 * - Extract types first (what data does it work with?)
 * - Then extract functions (one responsibility each)
 * - Finally, verify the output matches
 *
 * Run with: npx tsx exercise-15.ts
 */

// ============================================================================
// THE MESSY CODE - Refactor this entire section
// ============================================================================

function processDeliveryOrder(
    items: { n: string; p: number; q: number; cat: string }[],
    addr: string,
    dist: number,
    payMethod: string,
    tip: number,
    promo: string | null,
    isNewUser: boolean
): string {
    // Validate
    if (!items || items.length === 0) return 'ERROR: No items';
    if (!addr || addr.trim() === '') return 'ERROR: No address';
    if (dist < 0) return 'ERROR: Invalid distance';
    if (dist > 30) return 'ERROR: Too far for delivery (max 30km)';

    // Calculate item totals
    let subtotal = 0;
    let hasAlcohol = false;
    for (let i = 0; i < items.length; i++) {
        if (items[i].p <= 0 || items[i].q <= 0) {
            return `ERROR: Invalid item: ${items[i].n}`;
        }
        subtotal += items[i].p * items[i].q;
        if (items[i].cat === 'alcohol') {
            hasAlcohol = true;
        }
    }

    // Delivery fee (duplicated logic pattern)
    let deliveryFee: number;
    if (dist <= 3) {
        deliveryFee = 2.99;
    } else if (dist <= 10) {
        deliveryFee = 5.99;
    } else if (dist <= 20) {
        deliveryFee = 9.99;
    } else {
        deliveryFee = 14.99;
    }

    // Free delivery for orders over $50 (except alcohol)
    if (subtotal >= 50 && !hasAlcohol) {
        deliveryFee = 0;
    }

    // Promo code
    let discount = 0;
    if (promo) {
        if (promo === 'WELCOME50' && isNewUser) {
            discount = subtotal * 0.5;
            if (discount > 25) discount = 25; // max $25 discount
        } else if (promo === 'FRIDAY20') {
            discount = subtotal * 0.2;
        } else if (promo === 'FREEDELIVERY') {
            deliveryFee = 0;
        } else if (promo !== 'FREEDELIVERY' && promo !== 'FRIDAY20' && !(promo === 'WELCOME50' && isNewUser)) {
            return `ERROR: Invalid promo code: ${promo}`;
        }
    }

    // New user bonus (separate from promo)
    if (isNewUser && !promo) {
        discount = subtotal * 0.1; // 10% off for new users without promo
    }

    // Tax
    const taxableAmount = subtotal - discount;
    let tax: number;
    if (hasAlcohol) {
        tax = taxableAmount * 0.0875 + taxableAmount * 0.05; // regular tax + alcohol surcharge
    } else {
        tax = taxableAmount * 0.0875;
    }

    // Payment processing fee
    let processingFee: number;
    if (payMethod === 'card') {
        processingFee = (taxableAmount + tax) * 0.029 + 0.30;
    } else if (payMethod === 'cash') {
        processingFee = 0;
    } else if (payMethod === 'digital_wallet') {
        processingFee = (taxableAmount + tax) * 0.015;
    } else {
        return `ERROR: Unknown payment method: ${payMethod}`;
    }

    // Tip validation
    if (tip < 0) return 'ERROR: Tip cannot be negative';

    // Build the total
    const total = taxableAmount + tax + deliveryFee + processingFee + tip;

    // Build receipt (messy string concatenation)
    let receipt = `\n  === DELIVERY ORDER ===\n`;
    receipt += `  To: ${addr}\n`;
    receipt += `  Distance: ${dist}km\n`;
    receipt += `  ---\n`;
    for (let i = 0; i < items.length; i++) {
        receipt += `  ${items[i].q}x ${items[i].n} @ $${items[i].p.toFixed(2)} = $${(items[i].p * items[i].q).toFixed(2)}`;
        if (items[i].cat === 'alcohol') receipt += ' [21+]';
        receipt += '\n';
    }
    receipt += `  ---\n`;
    receipt += `  Subtotal: $${subtotal.toFixed(2)}\n`;
    if (discount > 0) receipt += `  Discount: -$${discount.toFixed(2)}${promo ? ` (${promo})` : ' (new user)'}\n`;
    receipt += `  Tax: $${tax.toFixed(2)}${hasAlcohol ? ' (incl. alcohol surcharge)' : ''}\n`;
    receipt += `  Delivery: ${deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}\n`;
    if (processingFee > 0) receipt += `  Processing: $${processingFee.toFixed(2)} (${payMethod})\n`;
    if (tip > 0) receipt += `  Tip: $${tip.toFixed(2)}\n`;
    receipt += `  ---\n`;
    receipt += `  TOTAL: $${total.toFixed(2)}\n`;
    receipt += `  Payment: ${payMethod}\n`;
    receipt += `  ===`;

    return receipt;
}


// ============================================================================
// YOUR REFACTORED CODE HERE
// ============================================================================

/**
 * SUGGESTED APPROACH (you don't have to follow this exactly):
 *
 * 1. TYPES: Create clean types for order items, delivery info, payment, etc.
 *    Consider using discriminated unions for payment methods.
 *
 * 2. CONSTANTS: Replace all magic numbers with named constants.
 *    e.g., const TAX_RATE = 0.0875, const MAX_DELIVERY_DISTANCE = 30, etc.
 *
 * 3. EXTRACT FUNCTIONS:
 *    - validateOrder(...)
 *    - calculateSubtotal(items)
 *    - calculateDeliveryFee(distance, subtotal, hasAlcohol)
 *    - applyPromoCode(promo, subtotal, isNewUser)
 *    - calculateTax(amount, hasAlcohol)
 *    - calculateProcessingFee(amount, paymentMethod)
 *    - formatReceipt(orderDetails)
 *
 * 4. ORCHESTRATOR: A clean processOrder() function that reads like English:
 *    - validate the order
 *    - calculate subtotal
 *    - apply discounts
 *    - calculate fees and tax
 *    - format and return receipt
 *
 * 5. GUARD CLAUSES: Use early returns for validation instead of nesting.
 *
 * 6. NAMING: Everything should be self-documenting.
 */

// Write your refactored code here:

// ── TYPES ────────────────────────────────────────────────────────────────────

type Category = 'food' | 'drink' | 'alcohol';

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    category: Category;
}

// Union type — TypeScript enforces only these 3 values are valid at compile time
type PaymentMethod = 'card' | 'cash' | 'digital_wallet';

// Union type — acts as an enum for known promo codes
// Benefit: PROMO_CODES_DISCOUNTS Record below will error if a code is missing
type PromoCode = 'WELCOME50' | 'FRIDAY20' | 'FREEDELIVERY';

// Parameter object pattern — replaces 7 separate function parameters with one typed object
// Makes call sites readable: processOrder({ address: ..., items: ... }) vs processOrder('addr', [], ...)
interface DeliveryOrder {
    items: OrderItem[];
    address: string;
    distance: number;
    paymentMethod: PaymentMethod;
    tip: number;
    promoCode?: string | null; // optional — customer may not have a promo code
    isNewUser: boolean;
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const TAX_RATE = 0.0875;
const ALCOHOL_SURCHARGE_RATE = 0.05;
// Derived constant — avoids duplicating the addition logic everywhere alcohol tax is applied
const TAX_RATE_WITH_ALCOHOL = TAX_RATE + ALCOHOL_SURCHARGE_RATE;

const MAX_DELIVERY_DISTANCE = 30;
const FREE_DELIVERY_THRESHOLD = 50; // orders above this get free delivery (non-alcohol)
const NEW_USER_DISCOUNT_RATE = 0.1; // 10% off for new users without a promo code

// Record<PaymentMethod, ...> ensures all 3 payment methods are covered —
// if you add a new PaymentMethod to the union, TypeScript will error here until you add its fees
const PROCESSING_FEES: Record<PaymentMethod, { rate: number; flatFee: number }> = {
    card:           { rate: 0.029, flatFee: 0.30 }, // % of total + flat fee per transaction
    cash:           { rate: 0,     flatFee: 0     },
    digital_wallet: { rate: 0.015, flatFee: 0     },
};

const PROMO_CODES_DISCOUNTS: Record<PromoCode, { rate: number; maxDiscount?: number }> = {
    WELCOME50:    { rate: 0.5, maxDiscount: 25 }, // 50% off subtotal, capped at $25 (new users only)
    FRIDAY20:     { rate: 0.2 },                  // 20% off subtotal
    FREEDELIVERY: { rate: 0 },                    // no subtotal discount — only waives delivery fee
};

// Distance-based delivery fee tiers — checked in order (first match wins)
// .find() / for...of stops at the first bracket where distance <= maxDistance
const DISTANCE_FEE_BRACKETS: { maxDistance: number; fee: number }[] = [
    { maxDistance: 3,  fee: 2.99  },
    { maxDistance: 10, fee: 5.99  },
    { maxDistance: 20, fee: 9.99  },
    { maxDistance: 30, fee: 14.99 }, // also acts as the upper bound (validation blocks > 30km)
];

// ── VALIDATION ────────────────────────────────────────────────────────────────

// Separated from order-level validation so each function has one responsibility (SRP)
const validateOrderItems = (items: OrderItem[]): string | null => {
    for (const item of items) {
        if (item.price <= 0 || item.quantity <= 0) {
            return `ERROR: Invalid item: ${item.name}`;
        }
    }
    return null;
};

// Returns an error string or null (no throws) — caller decides how to handle errors
// Guard clause pattern: all invalid states are rejected at the top, happy path flows below
const validateOrder = (order: DeliveryOrder): string | null => {
    if (!order.items || order.items.length === 0) return 'ERROR: No items';
    if (!order.address || order.address.trim() === '') return 'ERROR: No address';
    if (order.distance < 0) return 'ERROR: Invalid distance';
    if (order.distance > MAX_DELIVERY_DISTANCE) return `ERROR: Too far for delivery (max ${MAX_DELIVERY_DISTANCE}km)`;
    if (order.tip < 0) return 'ERROR: Tip cannot be negative';

    // TypeScript already enforces PaymentMethod at compile time,
    // but this guard catches invalid values passed at runtime (e.g. from an API)
    if (!PROCESSING_FEES[order.paymentMethod]) return `ERROR: Unknown payment method: ${order.paymentMethod}`;

    if (order.promoCode && !PROMO_CODES_DISCOUNTS[order.promoCode as PromoCode]) {
        return `ERROR: Invalid promo code: ${order.promoCode}`;
    }
    // WELCOME50 is restricted to new users — must be validated before applyPromoCode runs
    if (order.promoCode === 'WELCOME50' && !order.isNewUser) {
        return `ERROR: Invalid promo code: ${order.promoCode}`;
    }

    const itemsError = validateOrderItems(order.items);
    if (itemsError) return itemsError;

    return null;
};

// ── CALCULATIONS ──────────────────────────────────────────────────────────────

const calculateSubtotal = (items: OrderItem[]): number => {
    // reduce: accumulates (total + price * qty) for each item, starting at 0
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Intention-revealing name — reads like English in the orchestrator: if (hasAlcohol(items))
const hasAlcohol = (items: OrderItem[]): boolean => {
    return items.some(item => item.category === 'alcohol');
};

const calculateDeliveryFee = (distance: number, subtotal: number, alcoholInOrder: boolean): number => {
    // Free delivery for qualifying orders — alcohol orders never qualify (legal/business rule)
    if (subtotal >= FREE_DELIVERY_THRESHOLD && !alcoholInOrder) return 0;

    // Walk through brackets in order; first bracket where distance fits wins
    for (const bracket of DISTANCE_FEE_BRACKETS) {
        if (distance <= bracket.maxDistance) return bracket.fee;
    }

    // Fallback: should never be reached since validation blocks distance > 30km
    // .at(-1)! accesses the last array element; ! asserts it's not undefined (array is never empty)
    return DISTANCE_FEE_BRACKETS.at(-1)!.fee;
};

// Returns both the subtotal discount AND whether delivery is free
// (FREEDELIVERY promo has rate: 0, so discount = 0, but freeDelivery = true)
const applyPromoCode = (promoCode: string | null, subtotal: number, isNewUser: boolean): { discount: number; freeDelivery: boolean } => {
    if (!promoCode) {
        // No promo: new users get a flat 10% discount as a welcome benefit
        return { discount: isNewUser ? subtotal * NEW_USER_DISCOUNT_RATE : 0, freeDelivery: false };
    }

    const promo = PROMO_CODES_DISCOUNTS[promoCode as PromoCode];
    if (!promo) {
        // Defensive fallback — invalid promos should have been caught in validateOrder
        return { discount: 0, freeDelivery: false };
    }

    // Math.min enforces the cap: e.g. WELCOME50 caps at $25
    // ?? Infinity means "no cap" when maxDiscount is not defined
    const discount = Math.min(subtotal * promo.rate, promo.maxDiscount ?? Infinity);
    const freeDelivery = promoCode === 'FREEDELIVERY';
    return { discount, freeDelivery };
};

const calculateTax = (taxableAmount: number, alcoholInOrder: boolean): number => {
    // Alcohol orders pay regular tax + surcharge (combined into TAX_RATE_WITH_ALCOHOL)
    return taxableAmount * (alcoholInOrder ? TAX_RATE_WITH_ALCOHOL : TAX_RATE);
};

const calculateProcessingFee = (amount: number, paymentMethod: PaymentMethod): number => {
    const { rate, flatFee } = PROCESSING_FEES[paymentMethod];
    return amount * rate + flatFee;
};

// ── FORMATTING ────────────────────────────────────────────────────────────────

// Note: 7 parameters is a code smell (parameter object pattern would be cleaner here),
// but since this is an internal function only called by processOrder, it's acceptable.
const formatReceipt = (
    order: DeliveryOrder,
    subtotal: number,
    discount: number,
    tax: number,
    deliveryFee: number,
    processingFee: number,
    total: number
): string => {
    let receipt = `\n  === DELIVERY ORDER ===\n`;
    receipt += `  To: ${order.address}\n`;
    receipt += `  Distance: ${order.distance}km\n`;
    receipt += `  ---\n`;

    for (const item of order.items) {
        receipt += `  ${item.quantity}x ${item.name} @ $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}`;
        if (item.category === 'alcohol') receipt += ' [21+]';
        receipt += '\n';
    }

    receipt += `  ---\n`;
    receipt += `  Subtotal: $${subtotal.toFixed(2)}\n`;
    if (discount > 0) receipt += `  Discount: -$${discount.toFixed(2)}${order.promoCode ? ` (${order.promoCode})` : ' (new user)'}\n`;
    receipt += `  Tax: $${tax.toFixed(2)}${hasAlcohol(order.items) ? ' (incl. alcohol surcharge)' : ''}\n`;
    receipt += `  Delivery: ${deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}\n`;
    if (processingFee > 0) receipt += `  Processing: $${processingFee.toFixed(2)} (${order.paymentMethod})\n`;
    if (order.tip > 0) receipt += `  Tip: $${order.tip.toFixed(2)}\n`;
    receipt += `  ---\n`;
    receipt += `  TOTAL: $${total.toFixed(2)}\n`;
    receipt += `  Payment: ${order.paymentMethod}\n`;
    receipt += `  ===`;
    return receipt;
};

// ── ORCHESTRATOR ──────────────────────────────────────────────────────────────

// Clean entry point — reads like a plain-English description of the process.
// Each step is delegated to a focused function (SRP + DIP: depends on abstractions, not details).
function processOrder(order: DeliveryOrder): string {
    const validationError = validateOrder(order);
    if (validationError) return validationError;

    const subtotal = calculateSubtotal(order.items);
    const alcoholPresent = hasAlcohol(order.items);

    // Destructuring: applyPromoCode returns two values we need independently
    const { discount, freeDelivery } = applyPromoCode(order.promoCode ?? null, subtotal, order.isNewUser);

    const taxableAmount = subtotal - discount;
    const tax = calculateTax(taxableAmount, alcoholPresent);

    // FREEDELIVERY promo bypasses the fee calculation entirely
    const deliveryFee = freeDelivery ? 0 : calculateDeliveryFee(order.distance, subtotal, alcoholPresent);

    const processingFee = calculateProcessingFee(taxableAmount + tax, order.paymentMethod);
    const total = taxableAmount + tax + deliveryFee + processingFee + order.tip;

    return formatReceipt(order, subtotal, discount, tax, deliveryFee, processingFee, total);
}



// ============================================================================
// TESTS - These must produce the same output for both versions
// ============================================================================

console.log('=== TEST 1: Basic order ===');
const test1 = processDeliveryOrder(
    [
        { n: 'Burger', p: 12.99, q: 2, cat: 'food' },
        { n: 'Fries', p: 4.99, q: 2, cat: 'food' },
        { n: 'Soda', p: 2.49, q: 3, cat: 'drink' },
    ],
    '123 Main St',
    5,
    'card',
    5.00,
    null,
    false
);
console.log(test1);

console.log('\n=== TEST 2: New user with promo ===');
const test2 = processDeliveryOrder(
    [
        { n: 'Pizza', p: 18.99, q: 1, cat: 'food' },
        { n: 'Wings', p: 11.99, q: 1, cat: 'food' },
    ],
    '456 Oak Ave',
    2,
    'digital_wallet',
    3.00,
    'WELCOME50',
    true
);
console.log(test2);

console.log('\n=== TEST 3: Alcohol order (extra tax, no free delivery) ===');
const test3 = processDeliveryOrder(
    [
        { n: 'Steak', p: 32.99, q: 1, cat: 'food' },
        { n: 'Red Wine', p: 24.99, q: 1, cat: 'alcohol' },
        { n: 'Salad', p: 8.99, q: 1, cat: 'food' },
    ],
    '789 Pine Rd',
    15,
    'cash',
    10.00,
    'FRIDAY20',
    false
);
console.log(test3);

console.log('\n=== TEST 4: Error cases ===');
console.log(processDeliveryOrder([], '123 St', 5, 'card', 0, null, false));
console.log(processDeliveryOrder([{ n: 'X', p: 10, q: 1, cat: 'food' }], '', 5, 'card', 0, null, false));
console.log(processDeliveryOrder([{ n: 'X', p: 10, q: 1, cat: 'food' }], '123 St', 35, 'card', 0, null, false));
console.log(processDeliveryOrder([{ n: 'X', p: 10, q: 1, cat: 'food' }], '123 St', 5, 'card', 0, 'BADCODE', false));

// ============================================================================
// After refactoring, uncomment these to verify your version matches:
// ============================================================================

console.log('\n\n========== REFACTORED VERSION ==========');

console.log('\n=== TEST 1: Basic order ===');
// Replace processDeliveryOrder with your refactored function name:
const refactored1 = processOrder({
    items: [
        { name: 'Burger', price: 12.99, quantity: 2, category: 'food' },
        { name: 'Fries', price: 4.99, quantity: 2, category: 'food' },
        { name: 'Soda', price: 2.49, quantity: 3, category: 'drink' },
    ],
    address: '123 Main St',
    distance: 5,
    paymentMethod: 'card',
    tip: 5.00,
    promoCode: null,
    isNewUser: false
});
console.log(refactored1);
//
// ... repeat for tests 2, 3, 4
const refactored2 = processOrder({
    items: [
        { name: 'Pizza', price: 18.99, quantity: 1, category: 'food' },
        { name: 'Wings', price: 11.99, quantity: 1, category: 'food' },
    ],
    address: '456 Oak Ave',
    distance: 2,
    paymentMethod: 'digital_wallet',
    tip: 3.00,
    promoCode: 'WELCOME50',
    isNewUser: true
});
console.log(refactored2);

const refactored3 = processOrder({
    items: [
        { name: 'Steak', price: 32.99, quantity: 1, category: 'food' },
        { name: 'Red Wine', price: 24.99, quantity: 1, category: 'alcohol' },
        { name: 'Salad', price: 8.99, quantity: 1, category: 'food' },
    ],
    address: '789 Pine Rd',
    distance: 15,
    paymentMethod: 'cash',
    tip: 10.00,
    promoCode: 'FRIDAY20',
    isNewUser: false
});
console.log(refactored3);

console.log('\n=== TEST 4: Error cases ===');
console.log(processOrder({
    items: [],
    address: '123 St',
    distance: 5,
    paymentMethod: 'card',
    tip: 0,
    promoCode: null,
    isNewUser: false
}));
console.log(processOrder({
    items: [{ name: 'X', price: 10, quantity: 1, category: 'food' }],
    address: '',
    distance: 5,
    paymentMethod: 'card',
    tip: 0,
    promoCode: null,
    isNewUser: false
}));
console.log(processOrder({
    items: [{ name: 'X', price: 10, quantity: 1, category: 'food' }],
    address: '123 St',
    distance: 35,
    paymentMethod: 'card',
    tip: 0,
    promoCode: null,
    isNewUser: false
}));
console.log(processOrder({
    items: [{ name: 'X', price: 10, quantity: 1, category: 'food' }],
    address: '123 St',
    distance: 5,
    paymentMethod: 'card',
    tip: 0,
    promoCode: 'BADCODE',
    isNewUser: false
}));

export {};

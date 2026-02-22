/**
 * EXERCISE 12: Type Guards & Narrowing (Focused for Refactoring)
 *
 * You already learned `is` predicates in Exercise 11 BONUS.
 * This exercise focuses on the patterns that show up in refactoring:
 * - typeof guards (quick review)
 * - instanceof guards (refactoring class hierarchies)
 * - Discriminated unions (THE key refactoring pattern)
 * - Exhaustiveness checking with `never` (catch missing cases at compile time)
 * - Comprehensive challenge: Refactor messy conditionals → clean discriminated union
 *
 * Run with: npx tsx exercise-12.ts
 */

// ============================================================================
// PART 1: typeof Type Guards
// ============================================================================

/**
 * TODO: Create a function formatValue that handles different types:
 *
 * - string → return it wrapped in quotes: '"hello"'
 * - number → return it with 2 decimal places: "42.00"
 * - boolean → return "YES" or "NO"
 * - undefined → return "N/A"
 *
 * Use typeof checks to narrow the type in each branch.
 */

// Your formatValue function here

// CONCEPT: typeof type guard
// After a typeof check, TypeScript NARROWS the type inside that branch.
// e.g. after `typeof value === 'string'`, TS knows value is string (not number/boolean/etc.)
// This means you get full autocomplete and type safety inside each branch.
// NOTE: Better to use a union type instead of `any` for the parameter -
// `any` disables type checking. Union type gives you narrowing + safety:
function formatValue(value: string | number | boolean | undefined): string {
    if (typeof value === 'string') {
        // TS knows: value is string here
        return `"${value}"`;
    } else if (typeof value === 'number') {
        // TS knows: value is number here → .toFixed() is available
        return value.toFixed(2);
    } else if (typeof value === 'boolean') {
        // TS knows: value is boolean here
        return value ? "YES" : "NO";
    } else {
        // TS knows: value is undefined here (only option left)
        return "N/A";
    }
}


// Test Part 1
console.log('=== PART 1: typeof Type Guards ===');
console.log(formatValue('hello'));     // → "hello"
console.log(formatValue(42));          // → 42.00
console.log(formatValue(true));        // → YES
console.log(formatValue(false));       // → NO
console.log(formatValue(undefined));   // → N/A

// ============================================================================
// PART 2: instanceof Type Guards
// ============================================================================

/**
 * TODO: You have these error classes (already provided below).
 *
 * Create a function handleError(error: AppError) that returns a user-friendly message:
 * - NetworkError → "Network issue: [message]. Retry: [retryable]"
 * - ValidationError → "Invalid input: [field] - [message]"
 * - AuthError → "Auth failed: [message]. Expired: [expired]"
 *
 * Use instanceof to check which error type it is.
 */

// Given error classes:
class AppError {
    constructor(public message: string) {}
}

class NetworkError extends AppError {
    constructor(message: string, public retryable: boolean) {
        super(message);
    }
}

class ValidationError extends AppError {
    constructor(message: string, public field: string) {
        super(message);
    }
}

class AuthError extends AppError {
    constructor(message: string, public expired: boolean) {
        super(message);
    }
}

// Your handleError function here

// CONCEPT: instanceof type guard
// Works with CLASS hierarchies. After instanceof check, TS narrows to that specific class,
// giving you access to that class's unique properties (retryable, field, expired).
// KEY DIFFERENCE from typeof:
//   - typeof works with primitives (string, number, boolean)
//   - instanceof works with classes (checks the prototype chain)
// REFACTORING USE: When you have a class hierarchy (like error types), instanceof
// lets you handle each subclass differently while maintaining type safety.
function handleError(error: AppError): string {
    if (error instanceof NetworkError) {
        // TS knows: error is NetworkError → .retryable is available
        return `Network issue: ${error.message}. Retry: ${error.retryable}`;
    } else if (error instanceof ValidationError) {
        // TS knows: error is ValidationError → .field is available
        return `Invalid input: ${error.field} - ${error.message}`;
    } else if (error instanceof AuthError) {
        // TS knows: error is AuthError → .expired is available
        return `Auth failed: ${error.message}. Expired: ${error.expired}`;
    }
    // Fallback for base AppError (or any future subclass we haven't handled)
    return `Unknown error: ${error.message}`;
}


// Test Part 2
console.log('\n=== PART 2: instanceof Type Guards ===');
const errors: AppError[] = [
    new NetworkError('Connection timeout', true),
    new ValidationError('Too short', 'username'),
    new AuthError('Token invalid', true),
    new AppError('Something went wrong'),
];
errors.forEach(err => console.log(handleError(err)));

// ============================================================================
// PART 3: Discriminated Unions (THE refactoring pattern)
// ============================================================================

/**
 * CONCEPT: Discriminated unions use a shared literal property (the "discriminant")
 * to tell types apart. TypeScript automatically narrows inside switch/if.
 *
 * This is THE pattern you'll use to refactor messy if/else chains.
 *
 * TODO: Define these types using a discriminated union:
 *
 * type Shape =
 *   | { kind: 'circle';    radius: number }
 *   | { kind: 'rectangle'; width: number; height: number }
 *   | { kind: 'triangle';  base: number; height: number }
 *
 * Then create:
 * 1. function getArea(shape: Shape): number
 *    - circle: Math.PI * radius^2
 *    - rectangle: width * height
 *    - triangle: (base * height) / 2
 *
 * 2. function describe(shape: Shape): string
 *    - circle: "Circle with radius [r]"
 *    - rectangle: "Rectangle [w]x[h]"
 *    - triangle: "Triangle with base [b] and height [h]"
 */

// Your Shape discriminated union type here

// CONCEPT: Discriminated Union (THE key refactoring pattern)
// A union of object types that all share a common literal property (the "discriminant").
// Here `kind` is the discriminant - it's a string LITERAL type ('circle' | 'rectangle' | 'triangle'),
// not just any string. This lets TypeScript narrow automatically inside switch/if.
//
// WHY THIS MATTERS FOR REFACTORING:
// Instead of one big type with tons of optional fields (where nothing stops invalid combos),
// each variant has EXACTLY the fields it needs. Invalid states become impossible.
// This is the #1 pattern for replacing messy if/else chains with type-safe code.
type Shape =
    | { kind: 'circle'; radius: number }
    | { kind: 'rectangle'; width: number; height: number }
    | { kind: 'triangle'; base: number; height: number };


// Your getArea function here

// CONCEPT: Switch on discriminant for automatic narrowing
// When you switch on shape.kind, TS narrows the type in each case block.
// In case 'circle': TS knows shape has .radius (not .width or .base)
// No type assertions needed, no optional chaining, no runtime checks!
function getArea(shape: Shape): number {
    switch (shape.kind) {
        case 'circle':
            return Math.PI * shape.radius ** 2;
        case 'rectangle':
            return shape.width * shape.height;
        case 'triangle':
            return (shape.base * shape.height) / 2;
    }
}

// Your describe function here
function describe(shape: Shape): string {
    switch (shape.kind) {
        case 'circle':
            return `Circle with radius ${shape.radius}`;
        case 'rectangle':
            return `Rectangle ${shape.width}x${shape.height}`;
        case 'triangle':
            return `Triangle with base ${shape.base} and height ${shape.height}`;
    }
}


// Test Part 3
console.log('\n=== PART 3: Discriminated Unions ===');
const shapes: Shape[] = [
    { kind: 'circle', radius: 5 },
    { kind: 'rectangle', width: 10, height: 20 },
    { kind: 'triangle', base: 6, height: 8 },
];
shapes.forEach(s => {
    console.log(`${describe(s)} → Area: ${getArea(s).toFixed(2)}`);
});

// ============================================================================
// PART 4: Exhaustiveness Checking with `never`
// ============================================================================

/**
 * CONCEPT: The `never` type represents values that should NEVER exist.
 * If you assign a value to `never` and TypeScript doesn't error,
 * it means you've handled ALL possible cases. If you add a new case
 * to the union and forget to handle it, TypeScript will error HERE.
 *
 * TODO: Create a discriminated union for API actions and a handler:
 *
 * type Action =
 *   | { type: 'FETCH_START' }
 *   | { type: 'FETCH_SUCCESS'; data: string[] }
 *   | { type: 'FETCH_ERROR'; error: string }
 *
 * Create function handleAction(action: Action): string
 *   - FETCH_START → "Loading..."
 *   - FETCH_SUCCESS → "Got [n] items"
 *   - FETCH_ERROR → "Error: [error]"
 *   - default → use exhaustive check with `never` (see pattern below)
 *
 * PATTERN for exhaustiveness:
 *   default: {
 *       const _exhaustive: never = action;
 *       throw new Error(`Unhandled action: ${_exhaustive}`);
 *   }
 *
 * WHY THIS WORKS:
 * After handling all cases in switch, TypeScript narrows action to `never`.
 * If you add a 4th action type later and forget the case, action WON'T be
 * `never` anymore → TypeScript gives a compile error. Bug caught at build time!
 */

// Your Action type here
type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; data: string[] }
    | { type: 'FETCH_ERROR'; error: string };


// Your handleAction function here

// CONCEPT: Exhaustiveness checking with `never`
// After handling ALL cases in a switch, TS narrows the remaining type to `never`
// (meaning "this can never happen"). By assigning to a `never` variable in default,
// we get a COMPILE-TIME error if we later add a new action type but forget to handle it.
//
// EXAMPLE: If you add | { type: 'FETCH_CANCEL' } to Action but don't add a case for it,
// TS will error: "Type { type: 'FETCH_CANCEL' } is not assignable to type never"
// This is a safety net that catches bugs BEFORE your code runs!
function handleAction(action: Action): string {
    switch (action.type) {
        case 'FETCH_START':
            return "Loading...";
        case 'FETCH_SUCCESS':
            return `Got ${action.data.length} items`;
        case 'FETCH_ERROR':
            return `Error: ${action.error}`;
        default: {
            // If all cases handled, action is `never` here → this compiles fine
            // If a case is missing, action is NOT `never` → compile error!
            const _exhaustive: never = action;
            throw new Error(`Unhandled action: ${_exhaustive}`);
        }
    }
}

// Test Part 4
console.log('\n=== PART 4: Exhaustiveness Checking ===');
const actions: Action[] = [
    { type: 'FETCH_START' },
    { type: 'FETCH_SUCCESS', data: ['item1', 'item2', 'item3'] },
    { type: 'FETCH_ERROR', error: 'Network timeout' },
];
actions.forEach(action => console.log(handleAction(action)));

// ============================================================================
// PART 5: Comprehensive Challenge - Refactor to Discriminated Union
// ============================================================================

/**
 * SCENARIO: You're refactoring a payment processing system.
 * The original code uses a messy type with optional fields.
 * Your job: refactor it into a clean discriminated union.
 *
 * BEFORE (messy - the code you're refactoring):
 *
 *   interface Payment {
 *       method: string;
 *       amount: number;
 *       cardNumber?: string;
 *       cardExpiry?: string;
 *       email?: string;
 *       bankName?: string;
 *       accountNumber?: string;
 *       cryptoAddress?: string;
 *       cryptoNetwork?: string;
 *   }
 *
 * PROBLEMS with the above:
 *   - Nothing stops you from creating { method: 'card', email: 'x@y.com' }
 *   - Every handler must check if optional fields exist
 *   - Adding a new method? Good luck finding all the places to update
 *
 * TODO: Refactor into a discriminated union:
 *
 * type Payment =
 *   | { method: 'card';   amount: number; cardNumber: string; cardExpiry: string }
 *   | { method: 'paypal'; amount: number; email: string }
 *   | { method: 'bank';   amount: number; bankName: string; accountNumber: string }
 *   | { method: 'crypto'; amount: number; cryptoAddress: string; cryptoNetwork: string }
 *
 * Then create:
 * 1. function processPayment(payment: Payment): string
 *    - card: "Charging card [last 4 digits] $[amount]"
 *    - paypal: "Charging PayPal [email] $[amount]"
 *    - bank: "Transferring $[amount] from [bankName] account [last 4 digits]"
 *    - crypto: "Sending $[amount] to [cryptoAddress] on [cryptoNetwork]"
 *    - Use exhaustive check!
 *
 * 2. function getPaymentSummary(payment: Payment): string
 *    - card: "Card ending in [last 4]"
 *    - paypal: "[email]"
 *    - bank: "[bankName] - [last 4]"
 *    - crypto: "[cryptoNetwork]: [first 8 chars of address]..."
 *    - Use exhaustive check!
 *
 * 3. function calculateFee(payment: Payment): number
 *    - card: 2.9% + $0.30
 *    - paypal: 3.5%
 *    - bank: flat $5.00
 *    - crypto: flat $1.00
 *    - Use exhaustive check!
 *
 * HINT: To get last 4 digits: str.slice(-4)
 * HINT: To get first 8 chars: str.slice(0, 8)
 */

// Your Payment discriminated union type here

// CONCEPT: Refactoring messy optionals → clean discriminated union
// BEFORE: One interface with method: string and tons of optional fields (cardNumber?, email?, etc.)
//   Problem: Nothing prevents invalid combos like { method: 'card', email: 'x@y.com' }
//   Problem: Every handler must check if fields exist (undefined checks everywhere)
// AFTER: Each variant has EXACTLY the fields it needs. TypeScript enforces correctness.
//   You literally CANNOT create a 'card' payment without cardNumber - the type won't allow it.
// This is THE refactoring pattern you'll use most in real codebases.
type Payment =
    | { method: 'card'; amount: number; cardNumber: string; cardExpiry: string }
    | { method: 'paypal'; amount: number; email: string }
    | { method: 'bank'; amount: number; bankName: string; accountNumber: string }
    | { method: 'crypto'; amount: number; cryptoAddress: string; cryptoNetwork: string };


// Your processPayment function here
function processPayment(payment: Payment): string {
    switch (payment.method) {
        case 'card':
            return `Charging card ${payment.cardNumber.slice(-4)} $${payment.amount}`;
        case 'paypal':
            return `Charging PayPal ${payment.email} $${payment.amount}`;
        case 'bank':
            return `Transferring $${payment.amount} from ${payment.bankName} account ${payment.accountNumber.slice(-4)}`;
        case 'crypto':
            return `Sending $${payment.amount} to ${payment.cryptoAddress} on ${payment.cryptoNetwork}`;
        default: {
            const _exhaustive: never = payment;
            throw new Error(`Unhandled payment method: ${_exhaustive}`);
        }
    }
}


// Your getPaymentSummary function here
function getPaymentSummary(payment: Payment): string {
    switch (payment.method) {
        case 'card':
            return `Card ending in ${payment.cardNumber.slice(-4)}`;
        case 'paypal':
            return payment.email;
        case 'bank':
            return `${payment.bankName} - ${payment.accountNumber.slice(-4)}`;
        case 'crypto':
            return `${payment.cryptoNetwork}: ${payment.cryptoAddress.slice(0, 8)}...`;
        default: {
            const _exhaustive: never = payment;
            throw new Error(`Unhandled payment method: ${_exhaustive}`);
        }
    }
}

// Your calculateFee function here
function calculateFee(payment: Payment): number {
    switch (payment.method) {
        case 'card':
            return 0.029 * payment.amount + 0.30;
        case 'paypal':
            return 0.035 * payment.amount;
        case 'bank':
            return 5.00;
        case 'crypto':
            return 1.00;
        default: {
            const _exhaustive: never = payment;
            throw new Error(`Unhandled payment method: ${_exhaustive}`);
        }
    }
}


// Test Part 5
console.log('\n=== PART 5: Refactor to Discriminated Union ===');
// Uncomment when ready:
const payments: Payment[] = [
    { method: 'card', amount: 99.99, cardNumber: '4532015112830366', cardExpiry: '12/25' },
    { method: 'paypal', amount: 49.99, email: 'user@example.com' },
    { method: 'bank', amount: 1000, bankName: 'Chase', accountNumber: '9876543210' },
    { method: 'crypto', amount: 250, cryptoAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', cryptoNetwork: 'Ethereum' },
];

payments.forEach(p => {
    console.log(`--- ${getPaymentSummary(p)} ---`);
    console.log(processPayment(p));
    console.log(`Fee: $${calculateFee(p).toFixed(2)}`);
    console.log(`Total: $${(p.amount + calculateFee(p)).toFixed(2)}`);
});

export {};

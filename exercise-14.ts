/**
 * EXERCISE 14: Clean Functions & Refactoring Patterns
 *
 * Now that you know SOLID principles, this exercise focuses on
 * the hands-on refactoring patterns you'll use in real code:
 * - Extract Method (break down long functions)
 * - Naming & Magic Numbers (self-documenting code)
 * - Guard Clauses & Encapsulate Conditionals (clean flow)
 * - Remove Duplicate Code (DRY)
 * - Parameter Objects (reduce parameter count)
 * - BONUS: Replace Conditionals with Polymorphism
 *
 * Run with: npx tsx exercise-14.ts
 */

// ============================================================================
// PART 1: Extract Method (Break Down Long Functions)
// ============================================================================

/**
 * PRINCIPLE: Functions should do ONE thing. If a function has sections
 * that could be described with a comment, extract them into separate functions.
 *
 * PROBLEM: This processEmployee function does WAY too much:
 * 1. Validates input
 * 2. Calculates pay (with complex overtime logic)
 * 3. Calculates tax
 * 4. Formats a report string
 *
 * TODO: Extract into focused functions:
 * - validateEmployee(employee) → throws or returns void
 * - calculateGrossPay(hoursWorked, hourlyRate) → number
 * - calculateTax(grossPay) → number
 * - formatPayReport(name, grossPay, tax) → string
 * - processEmployee(employee) → string (orchestrates the above)
 *
 * The main function should read like a high-level summary.
 */

// --- BAD CODE (refactor this) ---

interface Employee {
    name: string;
    hoursWorked: number;
    hourlyRate: number;
}

function processEmployeeBAD(employee: Employee): string {
    // Validation
    if (!employee.name || employee.name.trim() === '') {
        return 'Error: Employee name is required';
    }
    if (employee.hoursWorked < 0) {
        return 'Error: Hours worked cannot be negative';
    }
    if (employee.hourlyRate <= 0) {
        return 'Error: Hourly rate must be positive';
    }

    // Calculate gross pay with overtime
    let grossPay: number;
    if (employee.hoursWorked > 40) {
        const regularPay = 40 * employee.hourlyRate;
        const overtimeHours = employee.hoursWorked - 40;
        const overtimePay = overtimeHours * employee.hourlyRate * 1.5;
        grossPay = regularPay + overtimePay;
    } else {
        grossPay = employee.hoursWorked * employee.hourlyRate;
    }

    // Calculate tax (progressive)
    let tax: number;
    if (grossPay <= 500) {
        tax = grossPay * 0.1;
    } else if (grossPay <= 1000) {
        tax = 500 * 0.1 + (grossPay - 500) * 0.2;
    } else {
        tax = 500 * 0.1 + 500 * 0.2 + (grossPay - 1000) * 0.3;
    }

    // Format report
    const netPay = grossPay - tax;
    return `${employee.name}: Gross=$${grossPay.toFixed(2)}, Tax=$${tax.toFixed(2)}, Net=$${netPay.toFixed(2)}`;
}

// --- YOUR REFACTORED CODE HERE ---
// Extract: validateEmployee, calculateGrossPay, calculateTax, formatPayReport
// Then: processEmployee orchestrates them

// CONCEPT: Extract Method pattern
// Each extracted function has ONE job and a descriptive name.
// The orchestrator (processEmployee) reads like a high-level summary:
//   validate → calculate gross → calculate tax → format report
// If any step needs to change (e.g. new tax brackets), you edit ONE function.
function validateEmployee(employee: Employee): string | null {
    if (!employee.name || employee.name.trim() === '') {
        return 'Error: Employee name is required';
    }
    if (employee.hoursWorked < 0) {
        return 'Error: Hours worked cannot be negative';
    }
    if (employee.hourlyRate <= 0) {
        return 'Error: Hourly rate must be positive';
    }
    return null;
}

function calculateGrossPay(hoursWorked: number, hourlyRate: number): number {
    if (hoursWorked > 40) {
        const regularPay = 40 * hourlyRate;
        const overtimeHours = hoursWorked - 40;
        const overtimePay = overtimeHours * hourlyRate * 1.5;
        return regularPay + overtimePay;
    } else {
        return hoursWorked * hourlyRate;
    }
}

function calculateTax(grossPay: number): number {
    if (grossPay <= 500) {
        return grossPay * 0.1;
    } else if (grossPay <= 1000) {
        return 500 * 0.1 + (grossPay - 500) * 0.2;
    } else {
        return 500 * 0.1 + 500 * 0.2 + (grossPay - 1000) * 0.3;
    }
}

function formatPayReport(name: string, grossPay: number, tax: number): string {
    const netPay = grossPay - tax;
    return `${name}: Gross=$${grossPay.toFixed(2)}, Tax=$${tax.toFixed(2)}, Net=$${netPay.toFixed(2)}`;
}

function processEmployee(employee: Employee): string {
    const validationError = validateEmployee(employee);
    if (validationError) {
        return validationError;
    }

    const grossPay = calculateGrossPay(employee.hoursWorked, employee.hourlyRate);
    const tax = calculateTax(grossPay);
    
    return formatPayReport(employee.name, grossPay, tax);
}



// Test Part 1
console.log('=== PART 1: Extract Method ===');
console.log(processEmployee({ name: '', hoursWorked: 40, hourlyRate: 25 }));
console.log(processEmployee({ name: 'Alice', hoursWorked: -5, hourlyRate: 25 }));
console.log(processEmployee({ name: 'Alice', hoursWorked: 40, hourlyRate: 25 }));
console.log(processEmployee({ name: 'Bob', hoursWorked: 50, hourlyRate: 30 }));
console.log(processEmployee({ name: 'Carol', hoursWorked: 60, hourlyRate: 50 }));


// ============================================================================
// PART 2: Naming & Magic Numbers
// ============================================================================

/**
 * PRINCIPLE: Code should be self-documenting. Use meaningful names and
 * named constants instead of magic numbers.
 *
 * PROBLEM: This function is full of magic numbers and cryptic names.
 * What does 86400000 mean? What's 0.0725? What's "t"?
 *
 * TODO: Refactor with:
 * - Meaningful variable/function names
 * - Named constants (UPPER_SNAKE_CASE) for magic numbers
 * - The code should read like English
 */

// --- BAD CODE (refactor this) ---

function calc(p: number, d: number, t: string): { tot: number; tx: number; s: number; exp: string } {
    // What do these numbers mean? Nobody knows!
    const tx = t === 'A' ? p * 0.0725 : t === 'B' ? p * 0.04 : 0;
    const s = d > 3 ? p * 0.15 : d > 1 ? p * 0.05 : 0;
    const tot = p + tx - s;

    // 86400000 ??? 30 ???
    const expDate = new Date(Date.now() + 86400000 * 30);
    const exp = `${expDate.getMonth() + 1}/${expDate.getDate()}/${expDate.getFullYear()}`;

    return { tot, tx, s, exp };
}

// --- YOUR REFACTORED CODE HERE ---
// Rename: calc → calculateInvoice (or similar)
// Rename: p → price, d → yearsAsCustomer, t → taxRegion
// Add constants: TAX_RATE_REGION_A = 0.0725, LOYALTY_DISCOUNT_RATE = 0.15, etc.
// Rename return fields: tot → total, tx → tax, s → discount, exp → expirationDate
// Replace 86400000 with named constant

// CONCEPT: Named constants (UPPER_SNAKE_CASE)
// Magic numbers like 0.0725 or 86400000 are meaningless without context.
// Named constants make code self-documenting:
//   price * 0.0725          → "what's 0.0725?"
//   price * TAX_RATE_REGION_A → "ah, it's the tax rate for region A"
const TAX_RATE_REGION_A = 0.0725;
const TAX_RATE_REGION_B = 0.04;
const LOYALTY_DISCOUNT_RATE = 0.15;
const NEW_CUSTOMER_DISCOUNT_RATE = 0.05;
const EXPIRATION_DAYS = 30;
const MS_PER_DAY = 86400000;

function calculateInvoice(price: number, yearsAsCustomer: number, taxRegion: string): { total: number; tax: number; discount: number; expirationDate: string } {
    const tax = taxRegion === 'A' ? price * TAX_RATE_REGION_A : taxRegion === 'B' ? price * TAX_RATE_REGION_B : 0;
    const discount = yearsAsCustomer > 3 ? price * LOYALTY_DISCOUNT_RATE : yearsAsCustomer > 1 ? price * NEW_CUSTOMER_DISCOUNT_RATE : 0;
    const total = price + tax - discount;

    const expirationDateObj = new Date(Date.now() + MS_PER_DAY * EXPIRATION_DAYS);
    const expirationDate = `${expirationDateObj.getMonth() + 1}/${expirationDateObj.getDate()}/${expirationDateObj.getFullYear()}`;

    return { total, tax, discount, expirationDate };
}



// Test Part 2
console.log('\n=== PART 2: Naming & Magic Numbers ===');
// The BAD version works but is unreadable:
console.log('BAD:', calc(100, 5, 'A'));
console.log('GOOD:', calculateInvoice(100, 5, 'A'));
console.log('GOOD:', calculateInvoice(250, 1, 'B'));
console.log('GOOD:', calculateInvoice(50, 0, 'C'));


// ============================================================================
// PART 3: Guard Clauses & Encapsulate Conditionals
// ============================================================================

/**
 * PRINCIPLES:
 * 1. Guard Clauses: Handle edge cases early with early returns.
 *    This eliminates deep nesting and makes the "happy path" clear.
 *
 * 2. Encapsulate Conditionals: Extract complex boolean expressions
 *    into named functions/variables for readability.
 *
 * PROBLEM: This function has deeply nested if/else (the "arrow anti-pattern")
 * and complex inline conditions that are hard to read.
 *
 * TODO: Refactor using:
 * - Guard clauses (early returns for error/edge cases at the top)
 * - Encapsulated conditionals (extract complex checks to named booleans/functions)
 * - The happy path should be the main (non-indented) code path
 */

// --- BAD CODE (refactor this) ---

interface Order {
    id: string;
    items: { name: string; price: number; quantity: number }[];
    customer: { name: string; memberSince: Date; isPremium: boolean } | null;
    couponCode: string | null;
}

function processOrderBAD(order: Order): string {
    if (order) {
        if (order.items && order.items.length > 0) {
            let subtotal = 0;
            for (const item of order.items) {
                subtotal += item.price * item.quantity;
            }

            if (order.customer) {
                if (order.customer.isPremium || (new Date().getTime() - order.customer.memberSince.getTime()) > 365 * 24 * 60 * 60 * 1000) {
                    // Premium or member for over a year: 10% discount
                    subtotal = subtotal * 0.9;
                }

                if (order.couponCode) {
                    if (order.couponCode === 'SAVE20') {
                        subtotal = subtotal * 0.8;
                    } else if (order.couponCode === 'SAVE10') {
                        subtotal = subtotal * 0.9;
                    } else {
                        return `Order ${order.id}: Invalid coupon code`;
                    }
                }

                return `Order ${order.id} for ${order.customer.name}: $${subtotal.toFixed(2)}`;
            } else {
                return `Order ${order.id}: Customer information required`;
            }
        } else {
            return `Order ${order.id}: No items in order`;
        }
    } else {
        return 'Error: No order provided';
    }
}

// --- YOUR REFACTORED CODE HERE ---
// Use guard clauses, encapsulated conditionals, and early returns
// Hint: Extract isLoyalCustomer(), applyCoupon(), calculateSubtotal() helpers

// CONCEPT: Encapsulate Conditionals
// Complex boolean expressions like `isPremium || (Date.now() - memberSince > 365*24*60*60*1000)`
// are hard to read inline. Extract them into named functions/variables that describe WHAT
// they check, not HOW. Now the calling code reads: `if (isLoyalCustomer(customer))`
function isLoyalCustomer(customer: { memberSince: Date; isPremium: boolean } | null): boolean {
    if (!customer) return false;
    const isPremium = customer.isPremium;
    const isLongTermMember = (new Date().getTime() - customer.memberSince.getTime()) > 365 * 24 * 60 * 60 * 1000;
    return isPremium || isLongTermMember;
}

function applyCoupon(subtotal: number, couponCode: string | null): number {
    if (!couponCode) return subtotal;

    switch (couponCode) {
        case 'SAVE20':
            return subtotal * 0.8;
        case 'SAVE10':
            return subtotal * 0.9;
        default:
            throw new Error('Invalid coupon code');
    }
}

function calculateSubtotal(items: { name: string; price: number; quantity: number }[]): number {
    let subtotal = 0;
    for (const item of items) {
        subtotal += item.price * item.quantity;
    }
    return subtotal;
}

// CONCEPT: Guard Clauses (early returns)
// BAD: deeply nested if/else (the "arrow anti-pattern" — code drifts rightward)
// GOOD: handle error cases FIRST with early returns, then the happy path is flat.
// Read top-to-bottom: "if no order, bail. if no items, bail. if no customer, bail. OK, proceed."
function processOrder(order: Order): string {
    if (!order) {
        return 'Error: No order provided';
    }

    if (!order.items || order.items.length === 0) {
        return `Order ${order.id}: No items in order`;
    }

    const subtotal = calculateSubtotal(order.items);

    if (!order.customer) {
        return `Order ${order.id}: Customer information required`;
    }

    let total = subtotal;

    if (isLoyalCustomer(order.customer)) {
        total = total * 0.9; // 10% discount for loyal customers
    }

    // CONCEPT: catch clause typing in TypeScript
    // TS only allows `any` or `unknown` in catch — you can't do `catch (error: Error)`.
    // Why? Because in JS, ANYTHING can be thrown: throw "oops", throw 42, throw {}.
    // TS can't guarantee what lands in catch, so it restricts the type.
    // Best practice: use `unknown` (safe) and narrow with instanceof before using.
    // NOTE: An alternative design avoids try/catch entirely — applyCoupon could return
    // { success: true, value: number } | { success: false, error: string } instead
    // of throwing. Throwing is for unexpected failures; validation is expected flow.
    try {
        total = applyCoupon(total, order.couponCode);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return `Order ${order.id}: ${error.message}`;
        }
        return `Order ${order.id}: Unknown error`;
    }

    return `Order ${order.id} for ${order.customer.name}: $${total.toFixed(2)}`;
}



// Test Part 3
console.log('\n=== PART 3: Guard Clauses & Encapsulate Conditionals ===');
const testOrders: Order[] = [
    {
        id: 'ORD-1', items: [{ name: 'Laptop', price: 999, quantity: 1 }],
        customer: { name: 'Alice', memberSince: new Date('2020-01-01'), isPremium: true },
        couponCode: 'SAVE20'
    },
    {
        id: 'ORD-2', items: [{ name: 'Mouse', price: 25, quantity: 2 }],
        customer: { name: 'Bob', memberSince: new Date(), isPremium: false },
        couponCode: null
    },
    {
        id: 'ORD-3', items: [],
        customer: { name: 'Carol', memberSince: new Date(), isPremium: false },
        couponCode: null
    },
];
console.log('BAD results:');
testOrders.forEach(o => console.log(`  ${processOrderBAD(o)}`));
console.log('GOOD results:');
testOrders.forEach(o => console.log(`  ${processOrder(o)}`));


// ============================================================================
// PART 4: Remove Duplicate Code
// ============================================================================

/**
 * PRINCIPLE: Don't Repeat Yourself (DRY). If you see similar code in
 * multiple places, extract the common logic into a shared function.
 *
 * PROBLEM: These two report functions are nearly identical.
 * They share: calculating totals, finding min/max, computing averages.
 * The only difference is what data they operate on and how they format output.
 *
 * TODO: Extract shared logic into reusable helpers:
 * - calculateStats(values: number[]) → { total, min, max, average }
 * - Use it in both report functions
 */

// --- BAD CODE (refactor this) ---

function salesReportBAD(sales: number[]): string {
    // Calculate total
    let total = 0;
    for (const sale of sales) {
        total += sale;
    }

    // Find min and max
    let min = sales[0];
    let max = sales[0];
    for (const sale of sales) {
        if (sale < min) min = sale;
        if (sale > max) max = sale;
    }

    // Calculate average
    const average = total / sales.length;

    return `Sales Report: Total=$${total.toFixed(2)}, Avg=$${average.toFixed(2)}, Min=$${min.toFixed(2)}, Max=$${max.toFixed(2)}`;
}

function expenseReportBAD(expenses: number[]): string {
    // Calculate total (duplicated!)
    let total = 0;
    for (const expense of expenses) {
        total += expense;
    }

    // Find min and max (duplicated!)
    let min = expenses[0];
    let max = expenses[0];
    for (const expense of expenses) {
        if (expense < min) min = expense;
        if (expense > max) max = expense;
    }

    // Calculate average (duplicated!)
    const average = total / expenses.length;

    return `Expense Report: Total=$${total.toFixed(2)}, Avg=$${average.toFixed(2)}, Min=$${min.toFixed(2)}, Max=$${max.toFixed(2)}`;
}

// --- YOUR REFACTORED CODE HERE ---
// Create: calculateStats(values: number[]) → { total, min, max, average }
// Simplify both report functions to use calculateStats

// CONCEPT: DRY (Don't Repeat Yourself)
// Extract shared logic into a reusable function. The report functions go from
// ~15 lines of duplicated math to 2-line wrappers using destructuring.
// Bonus: if the calculation logic needs to change, you fix it in ONE place.
function calculateStats(values: number[]): { total: number; min: number; max: number; average: number } {
    let total = 0;
    let min = values[0];
    let max = values[0];

    for (const value of values) {
        total += value;
        if (value < min) min = value;
        if (value > max) max = value;
    }

    const average = total / values.length;
    return { total, min, max, average };
}

function salesReport(sales: number[]): string {
    const { total, min, max, average } = calculateStats(sales);
    return `Sales Report: Total=$${total.toFixed(2)}, Avg=$${average.toFixed(2)}, Min=$${min.toFixed(2)}, Max=$${max.toFixed(2)}`;
}

function expenseReport(expenses: number[]): string {
    const { total, min, max, average } = calculateStats(expenses);
    return `Expense Report: Total=$${total.toFixed(2)}, Avg=$${average.toFixed(2)}, Min=$${min.toFixed(2)}, Max=$${max.toFixed(2)}`;
}

// Test Part 4
console.log('\n=== PART 4: Remove Duplicate Code ===');
const monthlySales = [1200, 800, 1500, 950, 2000];
const monthlyExpenses = [500, 350, 700, 420, 600];
console.log('BAD:');
console.log(`  ${salesReportBAD(monthlySales)}`);
console.log(`  ${expenseReportBAD(monthlyExpenses)}`);
console.log('GOOD:');
console.log(`  ${salesReport(monthlySales)}`);
console.log(`  ${expenseReport(monthlyExpenses)}`);


// ============================================================================
// PART 5: Parameter Objects & Defaults
// ============================================================================

/**
 * PRINCIPLE: When a function takes too many parameters (3+), bundle them
 * into an options object. Use default values to reduce boilerplate.
 *
 * PROBLEM: This function has 7 parameters. Hard to call, easy to mess up
 * the order, and adding new options means changing every call site.
 *
 * TODO: Refactor to use a typed options object with sensible defaults:
 * - Create a SearchOptions type
 * - The function takes SearchOptions with only `query` as required
 * - All other fields have defaults
 */

// --- BAD CODE (refactor this) ---

function searchBAD(
    query: string,
    maxResults: number,
    sortBy: string,
    sortOrder: string,
    includeArchived: boolean,
    caseSensitive: boolean,
    fuzzyMatch: boolean
): string {
    return `Searching "${query}" | max=${maxResults}, sort=${sortBy} ${sortOrder}, archived=${includeArchived}, case=${caseSensitive}, fuzzy=${fuzzyMatch}`;
}

// --- YOUR REFACTORED CODE HERE ---
// Create: SearchOptions type with query (required) and optional fields with defaults
// Create: search(options: SearchOptions) function

// CONCEPT: Parameter Object pattern
// When a function has 3+ parameters, bundle them into a typed object.
// Benefits: named properties (no guessing param order), optional fields with defaults,
// adding new options doesn't break existing call sites.
// Destructuring with defaults: `const { maxResults = 10, sortBy = 'relevance' } = options`
// gives you default values inline — no separate "if undefined" checks needed.
interface SearchOptions {
    query: string;
    maxResults?: number;
    sortBy?: string;
    sortOrder?: string;
    includeArchived?: boolean;
    caseSensitive?: boolean;
    fuzzyMatch?: boolean;
}

function search(options: SearchOptions): string {
    const {
        query,
        maxResults = 10,
        sortBy = 'relevance',
        sortOrder = 'desc',
        includeArchived = false,
        caseSensitive = false,
        fuzzyMatch = true
    } = options;

    return `Searching "${query}" | max=${maxResults}, sort=${sortBy} ${sortOrder}, archived=${includeArchived}, case=${caseSensitive}, fuzzy=${fuzzyMatch}`;
}

// Test Part 5
console.log('\n=== PART 5: Parameter Objects & Defaults ===');
console.log('BAD (hard to read):');
console.log(`  ${searchBAD('typescript', 10, 'relevance', 'desc', false, false, true)}`);
console.log('GOOD (clean & readable):');
console.log(`  ${search({ query: 'typescript' })}`); // all defaults
console.log(`  ${search({ query: 'refactoring', maxResults: 5, sortBy: 'date' })}`);
console.log(`  ${search({ query: 'SOLID', caseSensitive: true, fuzzyMatch: false })}`);


// ============================================================================
// BONUS: Replace Conditionals with Polymorphism
// ============================================================================

/**
 * This is the ULTIMATE refactoring pattern. When you see switch/if-else
 * chains that check a "type" field, you can often replace them with
 * polymorphism (each type becomes a class with its own behavior).
 *
 * PROBLEM: This shipping cost calculator uses a switch on shipment type.
 * Adding a new shipping method means modifying the switch.
 *
 * TODO: Replace with polymorphism:
 * 1. Create a ShippingMethod interface with calculateCost(weight, distance) method
 * 2. Create: StandardShipping, ExpressShipping, OvernightShipping classes
 * 3. Each class encapsulates its own cost logic
 * 4. No switch needed - just call method.calculateCost()
 */

// --- BAD CODE (refactor this) ---

function calculateShippingCostBAD(type: string, weight: number, distance: number): string {
    let cost: number;

    switch (type) {
        case 'standard':
            // $0.50 per kg + $0.01 per km
            cost = weight * 0.5 + distance * 0.01;
            break;
        case 'express':
            // $1.00 per kg + $0.03 per km + $5 flat fee
            cost = weight * 1.0 + distance * 0.03 + 5;
            break;
        case 'overnight':
            // $2.00 per kg + $0.05 per km + $15 flat fee
            cost = weight * 2.0 + distance * 0.05 + 15;
            break;
        default:
            return `Unknown shipping type: ${type}`;
    }

    return `${type} shipping: ${weight}kg, ${distance}km → $${cost.toFixed(2)}`;
}

// --- YOUR REFACTORED CODE HERE ---
// Create: ShippingMethod interface
// Create: StandardShipping, ExpressShipping, OvernightShipping
// Each has: calculateCost(weight, distance) and describe() methods

// CONCEPT: Replace Conditionals with Polymorphism
// switch/if-else on "type" → each type becomes a class with its own behavior.
// Same pattern as OCP (Ex 13 Part 2): adding new shipping = new class, no switch to modify.
// The ShippingMethod[] array + forEach pattern = polymorphism in action.
interface ShippingMethod {
    calculateCost(weight: number, distance: number): number;
    describe(): string;
}

class StandardShipping implements ShippingMethod {
    calculateCost(weight: number, distance: number): number {
        return weight * 0.5 + distance * 0.01;
    }
    describe(): string {
        return 'Standard Shipping';
    }
}

class ExpressShipping implements ShippingMethod {
    calculateCost(weight: number, distance: number): number {
        return weight * 1.0 + distance * 0.03 + 5;
    }
    describe(): string {
        return 'Express Shipping';
    }
}

class OvernightShipping implements ShippingMethod {
    calculateCost(weight: number, distance: number): number {
        return weight * 2.0 + distance * 0.05 + 15;
    }
    describe(): string {
        return 'Overnight Shipping';
    }
}



// Test BONUS
console.log('\n=== BONUS: Replace Conditionals with Polymorphism ===');
console.log('BAD:');
console.log(`  ${calculateShippingCostBAD('standard', 10, 500)}`);
console.log(`  ${calculateShippingCostBAD('express', 10, 500)}`);
console.log(`  ${calculateShippingCostBAD('overnight', 10, 500)}`);
// Uncomment when ready:
console.log('GOOD:');
const methods: ShippingMethod[] = [
    new StandardShipping(),
    new ExpressShipping(),
    new OvernightShipping(),
];
methods.forEach(method => {
    const cost = method.calculateCost(10, 500);
    console.log(`  ${method.describe()}: 10kg, 500km → $${cost.toFixed(2)}`);
});

export {};

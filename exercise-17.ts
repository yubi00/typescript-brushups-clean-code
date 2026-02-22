/**
 * EXERCISE 17: Immutability & Side Effects
 *
 * SCENARIO: A shopping cart system for an e-commerce app.
 * The code works, but it's full of hidden mutations and side effects.
 * Functions modify the data they receive, making bugs nearly impossible to track down.
 *
 * CODE SMELLS TO FIND AND FIX:
 * 1. Functions that mutate their input arrays/objects directly
 * 2. Sorting in place (Array.sort mutates!) instead of returning a new sorted array
 * 3. Using `let` where `const` would work — signals accidental mutability
 * 4. Accumulating results by pushing into an outer array instead of mapping/filtering
 * 5. Object properties that should be `readonly` but aren't
 * 6. A "pure" calculation function that secretly has a side effect (logging, mutating)
 *
 * GOALS FOR THE REFACTORED VERSION:
 * 1. No function should modify its inputs — always return new objects/arrays
 * 2. Use `readonly` on interfaces where data should not change after creation
 * 3. Use `as const` for fixed lookup data (prevents accidental modification)
 * 4. Replace imperative loops that build arrays with map/filter/reduce
 * 5. Use `const` everywhere — only use `let` when a value genuinely needs to change
 * 6. Pure functions: same input → same output, no side effects
 *
 * TIPS:
 * - [...array].sort(...) creates a copy before sorting — use this instead of array.sort(...)
 * - Spread { ...obj, field: newValue } to "update" without mutating
 * - readonly on interface fields prevents reassignment after creation
 * - ReadonlyArray<T> (or readonly T[]) prevents push/pop/sort on the array itself
 * - as const on a literal object makes every field deeply readonly
 *
 * Run with: npx tsx exercise-17.ts
 */

// ============================================================================
// THE MESSY CODE — Refactor everything below this line
// ============================================================================

// SMELL 5: no readonly — nothing stops a function from writing item.price = 0
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
}

// SMELL 5: items array is not readonly — functions can push/splice freely
interface Cart {
    items: CartItem[];
    customerId: number;
    couponCode: string | null;
}

// SMELL 3: no `as const` — nothing stops: CATEGORY_DISCOUNTS['electronics'] = 0.9
const CATEGORY_DISCOUNTS: Record<string, number> = {
    electronics: 0.1,
    clothing: 0.2,
    food: 0.05,
};

// SMELL 1: mutates the input cart directly — returns void, caller's cart is changed
function addItem(cart: Cart, item: CartItem): void {
    cart.items.push(item); // ← modifies the caller's cart!
}

// SMELL 1: mutates the input cart directly — returns void
function removeItem(cart: Cart, itemId: number): void {
    const index = cart.items.findIndex(i => i.id === itemId);
    if (index !== -1) {
        cart.items.splice(index, 1); // ← modifies the caller's cart!
    }
}

// SMELL 2: Array.sort() mutates the original array — the caller's order is destroyed
// SMELL 3: `let` used for something that never changes
function getSortedByPrice(cart: Cart): CartItem[] {
    let items = cart.items;                          // ← let not needed, same reference
    return items.sort((a, b) => a.price - b.price); // ← sorts cart.items in place!
}

// SMELL 4: imperative push loop instead of .filter()
function getItemsByCategory(cart: Cart, category: string): CartItem[] {
    let result: CartItem[] = [];
    for (let i = 0; i < cart.items.length; i++) {
        if (cart.items[i].category === category) {
            result.push(cart.items[i]);
        }
    }
    return result;
}

// SMELL 6: looks like a pure calculation but mutates item.price AND logs a side effect
function applyDiscount(item: CartItem): number {
    const rate = CATEGORY_DISCOUNTS[item.category] ?? 0;
    item.price = item.price * (1 - rate);                          // ← mutates the item in the cart!
    console.log(`Applied ${rate * 100}% discount to ${item.name}`); // ← side effect inside a calculation
    return item.price;
}

// SMELL 4: push loop instead of .map()
// SMELL 1: calls applyDiscount which mutates each item's price in the cart
function calculateDiscountedPrices(cart: Cart): number[] {
    let prices: number[] = [];
    for (const item of cart.items) {
        prices.push(applyDiscount(item)); // ← permanently changes item.price in the cart
    }
    return prices;
}

// Depends on whether calculateDiscountedPrices ran first —
// calling these two in different orders gives different totals (hidden ordering dependency)
function calculateTotal(cart: Cart): number {
    let total = 0;
    for (const item of cart.items) {
        total += item.price * item.quantity;
    }
    return total;
}

// ============================================================================
// MESSY VERSION — Demo
// ============================================================================

console.log('=== MESSY VERSION ===\n');

const myCart: Cart = {
    customerId: 1,
    couponCode: null,
    items: [
        { id: 1, name: 'Laptop', price: 1000, quantity: 1, category: 'electronics' },
        { id: 2, name: 'T-Shirt', price: 30, quantity: 3, category: 'clothing' },
        { id: 3, name: 'Bread', price: 4, quantity: 2, category: 'food' },
    ],
};

console.log('Cart before addItem:', myCart.items.map(i => i.name));
addItem(myCart, { id: 4, name: 'Headphones', price: 200, quantity: 1, category: 'electronics' });
console.log('Cart after addItem: ', myCart.items.map(i => i.name)); // mutated!

console.log('\nSorted by price:', getSortedByPrice(myCart).map(i => i.name));
console.log('Original cart after sort:', myCart.items.map(i => i.name)); // also sorted — surprise!

console.log('\nItems in electronics:', getItemsByCategory(myCart, 'electronics').map(i => i.name));

console.log('\nApplying discounts...');
const discountedPrices = calculateDiscountedPrices(myCart);
console.log('Discounted prices:', discountedPrices);
console.log('Laptop price in cart NOW:', myCart.items.find(i => i.name === 'Laptop')?.price); // mutated from 1000!

console.log('\nTotal:', calculateTotal(myCart)); // prices already mutated — wrong if called before calculateDiscountedPrices
console.log('Total again:', calculateTotal(myCart)); // consistent only because items are already mutated


// ============================================================================
// YOUR REFACTORED CODE HERE
// ============================================================================

// STEP 1 — readonly interfaces
// `readonly` on fields prevents reassignment: item.price = 0 is now a compile error
// `ReadonlyArray` prevents push/pop/splice on the array itself
interface ReadonlyCartItem {
    readonly id: number;
    readonly name: string;
    readonly price: number;
    quantity: number;          // not readonly — user can change how many they want
    readonly category: string;
}

interface ReadonlyCart {
    readonly items: ReadonlyArray<ReadonlyCartItem>; // ReadonlyArray blocks push/splice/sort
    readonly customerId: number;
    readonly couponCode: string | null;
}

// STEP 2 — `as const` locks the object: TypeScript will error on any write attempt
const CATEGORY_DISCOUNTS_CONST = {
    electronics: 0.1,
    clothing: 0.2,
    food: 0.05,
} as const;

// STEP 3 — Fix each function

// Returns a new Cart — original is untouched
function addItemRefactored(cart: ReadonlyCart, item: ReadonlyCartItem): ReadonlyCart {
    return { ...cart, items: [...cart.items, item] };
}

// Returns a new Cart with the item filtered out — original is untouched
function removeItemRefactored(cart: ReadonlyCart, itemId: number): ReadonlyCart {
    return { ...cart, items: cart.items.filter(i => i.id !== itemId) };
}

// [...cart.items] copies the array first — sort operates on the copy, not the original
function getSortedByPriceRefactored(cart: ReadonlyCart): ReadonlyCartItem[] {
    return [...cart.items].sort((a, b) => a.price - b.price);
}

// .filter() always returns a new array — no mutation, no push loop
function getItemsByCategoryRefactored(cart: ReadonlyCart, category: string): ReadonlyCartItem[] {
    return cart.items.filter(i => i.category === category);
}

// Pure function: no mutation, no console.log — same input always gives same output
function applyDiscountRefactored(item: ReadonlyCartItem): number {
    const rate = CATEGORY_DISCOUNTS_CONST[item.category as keyof typeof CATEGORY_DISCOUNTS_CONST] ?? 0;
    return item.price * (1 - rate);
}

// .map() returns a new array of discounted prices — cart items are never touched
function calculateDiscountedPricesRefactored(cart: ReadonlyCart): number[] {
    return cart.items.map(item => applyDiscountRefactored(item));
}

// Pure: calculates total using original prices + discount inline — can be called any number of times
function calculateTotalRefactored(cart: ReadonlyCart): number {
    return cart.items.reduce(
        (sum, item) => sum + applyDiscountRefactored(item) * item.quantity,
        0
    );
}

// ============================================================================
// REFACTORED VERSION — Demo
// ============================================================================

console.log('\n\n=== REFACTORED VERSION ===\n');

const cleanCart: ReadonlyCart = {
    customerId: 1,
    couponCode: null,
    items: [
        { id: 1, name: 'Laptop', price: 1000, quantity: 1, category: 'electronics' },
        { id: 2, name: 'T-Shirt', price: 30, quantity: 3, category: 'clothing' },
        { id: 3, name: 'Bread', price: 4, quantity: 2, category: 'food' },
    ],
};

const cartWithHeadphones = addItemRefactored(cleanCart, { id: 4, name: 'Headphones', price: 200, quantity: 1, category: 'electronics' });
console.log('Original cart unchanged:', cleanCart.items.map(i => i.name));
console.log('New cart has item:      ', cartWithHeadphones.items.map(i => i.name));

const cartWithoutBread = removeItemRefactored(cleanCart, 3);
console.log('\nOriginal cart unchanged:', cleanCart.items.map(i => i.name));
console.log('Cart after removeItem:  ', cartWithoutBread.items.map(i => i.name));

console.log('\nElectronics only:', getItemsByCategoryRefactored(cleanCart, 'electronics').map(i => i.name));

console.log('\nSorted by price:', getSortedByPriceRefactored(cleanCart).map(i => i.name));
console.log('Original order unchanged:', cleanCart.items.map(i => i.name));

console.log('\nDiscounted prices:', calculateDiscountedPricesRefactored(cleanCart));
console.log('Laptop price in cart after discounts:', cleanCart.items.find(i => i.name === 'Laptop')?.price); // still 1000!

console.log('\nTotal (call 1):', calculateTotalRefactored(cleanCart));
console.log('Total (call 2):', calculateTotalRefactored(cleanCart)); // identical — pure function

export { };
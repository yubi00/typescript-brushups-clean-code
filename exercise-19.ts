/**
 * EXERCISE 19: Final Mock Assessment
 *
 * SCENARIO: A subscription billing system for a SaaS product.
 * Users can subscribe to plans, apply discount codes, and get charged.
 * The code below "works" — but it's a mess.
 *
 * THIS IS AN UNSEEN CHALLENGE — no hints, no step-by-step guide.
 * Read the code, identify the smells, and refactor it.
 *
 * TIME SUGGESTION: 45-60 minutes (similar to a real assessment)
 *
 * WHAT YOU'VE LEARNED THAT APPLIES HERE:
 * - Magic numbers → named constants
 * - God function → extract focused helpers
 * - Guard clauses → flatten nested ifs
 * - Inconsistent error signals → Result<T, E> or consistent pattern
 * - Input mutation → return new objects
 * - Public mutable state → private + readonly
 * - No interfaces → define contracts (OCP + DIP)
 * - Imperative loops → map/filter/reduce'
 * - Throwing strings → throw new Error(...)\\;745l
 * - Silent error swallowing → propagate or report
 *
 * Run with: npx tsx exercise-19.ts
 */

// ============================================================================
// THE MESS\
// 7/*-+/ CODE — Refactor everything below this line
// ============================================================================

const plans: any = {
    basic: { name: 'Basic', price: 9.99, maxUsers: 1, features: ['storage', 'email'] },
    pro: { name: 'Pro', price: 29.99, maxUsers: 5, features: ['storage', 'email', 'api'] },
    enterprise: { name: 'Enterprise', price: 99.99, maxUsers: 50, features: ['storage', 'email', 'api', 'sla'] },
};

const discountCodes: any = {
    SAVE10: { percent: 10, maxUses: 100, usedCount: 0, validUntil: '2099-12-31' },
    HALFOFF: { percent: 50, maxUses: 10, usedCount: 9, validUntil: '2099-12-31' },
    EXPIRED: { percent: 20, maxUses: 100, usedCount: 0, validUntil: '2020-01-01' },
};

// SMELL: public mutable state everywhere
class BillingSystem {
    public subscriptions: any[] = [];
    public revenue: number = 0;
    public failedPayments: number = 0;
    public secretKey: string;

    constructor(stripeKey: string) {
        this.secretKey = stripeKey; // public! anyone can read the key
    }

    // SMELL: god method — validates plan, validates code, calculates price,
    // creates subscription, processes payment, sends email, logs — all in one
    subscribe(userId: string, planId: string, discountCode: string | null, paymentMethod: any): any {
        // validate plan
        if (plans[planId] == undefined) {
            console.log('bad plan');
            return false; // inconsistent — sometimes returns false, sometimes throws
        }

        const plan = plans[planId];
        let price = plan.price;

        // apply discount
        if (discountCode != null) {
            if (discountCodes[discountCode] == undefined) {
                console.log('invalid code');
                return null; // different failure signal!
            } else {
                const dc = discountCodes[discountCode];
                if (dc.usedCount >= dc.maxUses) {
                    console.log('code used up');
                    return null;
                }
                if (new Date(dc.validUntil) < new Date()) {
                    console.log('code expired');
                    return null;
                }
                price = price - (price * dc.percent / 100); // magic numbers baked in
                dc.usedCount++; // mutates shared state directly!
            }
        }

        // validate payment
        if (paymentMethod == null || paymentMethod == undefined) {
            throw 'no payment method'; // string throw!
        }
        if (!paymentMethod.cardNumber || paymentMethod.cardNumber.length != 16) {
            throw 'bad card'; // string throw!
        }
        if (!paymentMethod.expiry || paymentMethod.cvv.length != 3) {
            throw 'bad card details'; // string throw, and this will crash if cvv is missing
        }

        // process payment — simulated
        const paymentSuccess = price < 1000; // simulate: always succeeds for reasonable amounts
        if (!paymentSuccess) {
            this.failedPayments++; // mutates class state
            console.log('payment failed');
            return false;
        }

        // create subscription
        const sub: any = {
            id: Math.random().toString(36).slice(2),
            userId,
            planId,
            price,
            status: 'active',
            startDate: new Date().toISOString(),
        };
        this.subscriptions.push(sub); // mutates array
        this.revenue += price;        // mutates total

        // send welcome email — inline, not separated
        console.log(`  [EMAIL] Welcome to ${plan.name}, user ${userId}! You're charged $${price.toFixed(2)}/month.`);

        // return raw subscription object — caller gets everything including internals
        return sub;
    }

    // SMELL: does too many things, returns void — no way to know what happened
    cancelSubscription(subscriptionId: string): void {
        let found = false;
        for (let i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].id === subscriptionId) {
                this.subscriptions[i].status = 'cancelled'; // mutates object in array
                found = true;
                console.log(`Cancelled ${subscriptionId}`);
                console.log(`  [EMAIL] Sorry to see you go, user ${this.subscriptions[i].userId}!`);
            }
        }
        if (!found) {
            console.log('subscription not found'); // swallowed — caller gets void regardless
        }
    }

    // SMELL: imperative loop, magic number, no type safety
    getActiveRevenue(): number {
        let total = 0;
        for (let i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].status == 'active') {
                total = total + this.subscriptions[i].price;
            }
        }
        return total;
    }
}

// ============================================================================
// MESSY VERSION — Demo
// ============================================================================

console.log('=== MESSY VERSION ===\n');

const billing = new BillingSystem('sk_live_supersecret');

// Smell: secret key is public
console.log('Exposed key:', billing.secretKey);

// Smell: caller has to handle false, null, and exceptions — all different signals
const r1 = billing.subscribe('user-1', 'pro', 'SAVE10', { cardNumber: '1234567890123456', expiry: '12/26', cvv: '123' });
console.log('Sub 1:', r1?.id ?? 'failed');

const r2 = billing.subscribe('user-2', 'basic', 'HALFOFF', { cardNumber: '9999888877776666', expiry: '01/25', cvv: '999' });
console.log('Sub 2:', r2?.id ?? 'failed');

const r3 = billing.subscribe('user-3', 'basic', 'EXPIRED', { cardNumber: '1111222233334444', expiry: '06/27', cvv: '456' });
console.log('Sub 3:', r3?.id ?? 'failed');

const r4 = billing.subscribe('user-4', 'invalid_plan', null, { cardNumber: '1234567890123456', expiry: '12/26', cvv: '123' });
console.log('Sub 4:', r4);

try {
    billing.subscribe('user-5', 'basic', null, null); // will throw a string
} catch (e) {
    console.log('Caught (might not have .message):', e);
}

console.log('\nActive monthly revenue:', billing.getActiveRevenue());

if (r1) billing.cancelSubscription(r1.id);
billing.cancelSubscription('nonexistent-id'); // swallowed silently

console.log('Revenue after cancel:', billing.getActiveRevenue());


// ============================================================================
// REFACTORED CODE
// ============================================================================

// --- Types ---

type PlanId = 'basic' | 'pro' | 'enterprise';
type SubscriptionStatus = 'active' | 'cancelled';

interface Plan {
    readonly name: string;
    readonly price: number;
    readonly maxUsers: number;
    readonly features: readonly string[];
}

interface DiscountCode {
    readonly percent: number;
    readonly maxUses: number;
    usedCount: number;          // mutable — tracks usage count
    readonly validUntil: string;
}

interface PaymentMethod {
    readonly cardNumber: string;
    readonly expiry: string;
    readonly cvv: string;
}

interface Subscription {
    readonly id: string;
    readonly userId: string;
    readonly planId: PlanId;
    readonly price: number;
    readonly status: SubscriptionStatus;
    readonly startDate: string;
}

// --- Result type (from exercise 16) ---

type Result<T, E = string> =
    | { ok: true; value: T }
    | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> { return { ok: true, value }; }
function fail<E>(error: E): Result<never, E> { return { ok: false, error }; }

// --- Constants ---

const PLANS: Record<PlanId, Plan> = {
    basic: { name: 'Basic', price: 9.99, maxUsers: 1, features: ['storage', 'email'] },
    pro: { name: 'Pro', price: 29.99, maxUsers: 5, features: ['storage', 'email', 'api'] },
    enterprise: { name: 'Enterprise', price: 99.99, maxUsers: 50, features: ['storage', 'email', 'api', 'sla'] },
} as const;

const DISCOUNT_CODES_REF: Record<string, DiscountCode> = {
    SAVE10: { percent: 10, maxUses: 100, usedCount: 0, validUntil: '2099-12-31' },
    HALFOFF: { percent: 50, maxUses: 10, usedCount: 9, validUntil: '2099-12-31' },
    EXPIRED: { percent: 20, maxUses: 100, usedCount: 0, validUntil: '2020-01-01' },
};

const CARD_NUMBER_LENGTH = 16;
const CVV_LENGTH = 3;

// --- Pure validation helpers (no side effects, no mutation) ---

function isPlanId(planId: string): planId is PlanId {
    return planId in PLANS;
}

function validatePlan(planId: string): Result<Plan> {
    if (!isPlanId(planId)) return fail(`Unknown plan: ${planId}`);
    return ok(PLANS[planId]);
}

function validateDiscountCode(code: string): Result<DiscountCode> {
    const dc = DISCOUNT_CODES_REF[code];
    if (!dc) return fail(`Invalid discount code: ${code}`);
    if (dc.usedCount >= dc.maxUses) return fail(`Discount code ${code} has reached its usage limit`);
    if (new Date(dc.validUntil) < new Date()) return fail(`Discount code ${code} has expired`);
    return ok(dc);
}

// Pure: returns discounted price without mutating anything
function applyDiscount(price: number, dc: DiscountCode): number {
    return price * (1 - dc.percent / 100);
}

function validatePaymentMethod(method: PaymentMethod): Result<PaymentMethod> {
    if (!method.cardNumber || method.cardNumber.length !== CARD_NUMBER_LENGTH) {
        return fail('Invalid card number: must be 16 digits');
    }
    if (!method.expiry) return fail('Missing card expiry');
    if (!method.cvv || method.cvv.length !== CVV_LENGTH) {
        return fail('Invalid CVV: must be 3 digits');
    }
    return ok(method);
}


// --- EmailNotifier: isolated side effect (SRP) ---

class EmailNotifier {
    sendWelcome(userId: string, planName: string, price: number): void {
        console.log(`  [EMAIL] Welcome to ${planName}, user ${userId}! You're charged $${price.toFixed(2)}/month.`);
    }

    sendCancellation(userId: string): void {
        console.log(`  [EMAIL] Sorry to see you go, user ${userId}!`);
    }
}

// --- BillingService: lean orchestrator (SRP + DIP) ---

class BillingService {
    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly stripeKey: string,       // private — key is never exposed
        private readonly notifier: EmailNotifier  // injected — swappable (DIP)
    ) { }

    // In a real app, this would use this.stripeKey to call the Stripe SDK
    private processPayment(price: number): Result<void> {
        const success = price < 1000; // simulated
        if (!success) return fail('Payment declined');
        return ok(undefined);
    }

    subscribe(
        userId: string,
        planId: string,
        discountCode: string | null,
        paymentMethod: PaymentMethod
    ): Result<Subscription> {
        const planResult = validatePlan(planId);
        if (!planResult.ok) return planResult;

        const paymentResult = validatePaymentMethod(paymentMethod);
        if (!paymentResult.ok) return paymentResult;

        let price = planResult.value.price;

        if (discountCode !== null) {
            const codeResult = validateDiscountCode(discountCode);
            if (!codeResult.ok) return codeResult;
            price = applyDiscount(price, codeResult.value);
            DISCOUNT_CODES_REF[discountCode].usedCount++; // controlled mutation — only happens here
        }

        const chargeResult = this.processPayment(price);
        if (!chargeResult.ok) return chargeResult;

        const subscription: Subscription = {
            id: Math.random().toString(36).slice(2),
            userId,
            planId: planId as PlanId,
            price,
            status: 'active',
            startDate: new Date().toISOString(),
        };

        this.subscriptions.push(subscription);
        this.notifier.sendWelcome(userId, planResult.value.name, price);

        return ok(subscription);
    }

    cancelSubscription(subscriptionId: string): Result<Subscription> {
        const index = this.subscriptions.findIndex(s => s.id === subscriptionId);
        if (index === -1) return fail(`Subscription ${subscriptionId} not found`);

        // spread to avoid mutation — returns new Subscription object
        const cancelled: Subscription = { ...this.subscriptions[index], status: 'cancelled' };
        this.subscriptions[index] = cancelled;
        this.notifier.sendCancellation(cancelled.userId);

        return ok(cancelled);
    }

    // filter + reduce instead of imperative loop
    getActiveRevenue(): number {
        return this.subscriptions
            .filter(s => s.status === 'active')
            .reduce((sum, s) => sum + s.price, 0);
    }
}

// ============================================================================
// REFACTORED VERSION — Demo
// ============================================================================

console.log('\n\n=== REFACTORED VERSION ===\n');

const emailNotifier = new EmailNotifier();
const billingService = new BillingService('sk_live_supersecret', emailNotifier);

const card1 = { cardNumber: '1234567890123456', expiry: '12/26', cvv: '123' };
const card2 = { cardNumber: '9999888877776666', expiry: '01/25', cvv: '999' };
const card3 = { cardNumber: '1111222233334444', expiry: '06/27', cvv: '456' };

const s1 = billingService.subscribe('user-1', 'pro', 'SAVE10', card1);
console.log('Sub 1:', s1.ok ? s1.value.id : `ERROR: ${s1.error}`);

const s2 = billingService.subscribe('user-2', 'basic', 'HALFOFF', card2);
console.log('Sub 2:', s2.ok ? s2.value.id : `ERROR: ${s2.error}`);

const s3 = billingService.subscribe('user-3', 'basic', 'EXPIRED', card3);
console.log('Sub 3:', s3.ok ? s3.value.id : `ERROR: ${s3.error}`);

const s4 = billingService.subscribe('user-4', 'invalid', null, card1);
console.log('Sub 4:', s4.ok ? s4.value.id : `ERROR: ${s4.error}`);

const s5 = billingService.subscribe('user-5', 'basic', null, { cardNumber: 'short', expiry: '12/26', cvv: '123' });
console.log('Sub 5:', s5.ok ? s5.value.id : `ERROR: ${s5.error}`);

console.log('\nActive monthly revenue: $', billingService.getActiveRevenue().toFixed(2));

if (s1.ok) {
    const cancel = billingService.cancelSubscription(s1.value.id);
    console.log('\nCancel result:', cancel.ok ? 'cancelled' : `ERROR: ${cancel.error}`);
}

const badCancel = billingService.cancelSubscription('nonexistent-id');
console.log('Bad cancel:', badCancel.ok ? 'cancelled' : `ERROR: ${badCancel.error}`);

console.log('\nRevenue after cancel: $', billingService.getActiveRevenue().toFixed(2));

export { };

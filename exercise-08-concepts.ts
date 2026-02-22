/**
 * NEW CONCEPTS FROM EXERCISE 8 - For Your Reference
 *
 * Copy these comments into your exercise-08.ts file wherever you want them!
 */

// ===========================================================================
// CONCEPT 1: Abstract Class Implementing an Interface
// ===========================================================================

// CONCEPT: Interface as a pure contract - defines what methods a class MUST have
// No implementation, no properties with values - just method signatures
interface PaymentMethod {
    processPayment(amount: number): boolean;
    getTransactionFee(amount: number): number;
}

// CONCEPT: Abstract class implementing an interface!
// Abstract classes CAN implement interfaces - they just defer the implementation to children
// This combines interface contract with shared concrete code (getReceipt)
// USE CASE: When you want both enforcement (interface) AND shared code (abstract methods)
abstract class Payment implements PaymentMethod {
    constructor(
        protected amount: number,
        protected description: string,
        protected timestamp: Date
    ) { }

    // CONCEPT: Abstract methods from interface - children must implement
    // Even though Payment "implements" PaymentMethod, it can leave methods abstract
    abstract processPayment(amount: number): boolean;
    abstract getTransactionFee(amount: number): number;

    // CONCEPT: Concrete method in abstract class - shared code all children inherit
    // All payment types get the same receipt format for free
    getReceipt(): string {
        return `Receipt for ${this.description}: Amount $${this.amount}, Fee $${this.getTransactionFee(this.amount)}, Total $${this.amount + this.getTransactionFee(this.amount)}, Timestamp: ${this.timestamp}`;
    }

    // CONCEPT: Helper method to expose protected property
    // Added this so external code can access amount without making it public
    // Alternative: add getAmount() to the interface, or make amount public
    getAmount(): number {
        return this.amount;
    }
}

// ===========================================================================
// CONCEPT 2: Type Assertion (Type Casting) with 'as'
// ===========================================================================

// CONCEPT: Type assertion - telling TypeScript "trust me, I know this is actually a Payment"
// Syntax: (variable as Type) or <Type>variable (but 'as' is preferred in TSX/React)
class PaymentProcessor {
    processAll(payments: PaymentMethod[]): number {
        let totalProcessed = 0;
        payments.forEach(payment => {
            // CONCEPT: Type assertion here - payment is PaymentMethod, but we know it's actually Payment
            // This gives us access to Payment-specific methods like getAmount()
            // WHY NEEDED: PaymentMethod interface doesn't include getAmount(), but Payment class does
            if (payment.processPayment((payment as Payment).getAmount())) {
                totalProcessed += (payment as Payment).getAmount() + payment.getTransactionFee((payment as Payment).getAmount());
            }
        });
        return totalProcessed;
    }
}

// CONCEPT: When you need type assertions, it's often a design smell
// Better approach: Either add getAmount() to the interface, or change parameter to Payment[]

// ===========================================================================
// CONCEPT 3: Protected Properties in Abstract Classes
// ===========================================================================

// CONCEPT: Protected in abstract classes - specifically for sharing with children
// Since abstract classes can ONLY be extended (never instantiated), protected makes perfect sense
abstract class Animal {
    constructor(protected name: string) { }  // Children can access this.name

    abstract makeSound(): string;

    // CONCEPT: Parent can use protected properties in its own methods
    sleep(): string {
        return `${this.name} is sleeping`;
    }
}

class Dog extends Animal {
    makeSound(): string {
        // CONCEPT: Child can access protected parent property
        return `${this.name} says Woof!`;  // Could use this.name here
    }
}

// ===========================================================================
// CONCEPT 4: Polymorphism with Arrays (Parent Type Holds Children)
// ===========================================================================

// CONCEPT: Array typed as parent class, but holds child instances
// This is the POWER of polymorphism - write generic code that works with any Vehicle
const vehicles: Vehicle[] = [
    new Car('Toyota'),
    new Motorcycle('Harley-Davidson'),
    new Car('Tesla'),
];

// CONCEPT: When you call start(), the correct child method is called automatically
// This is "runtime polymorphism" - the decision of which method to call happens at runtime
vehicles.forEach(vehicle => {
    console.log(vehicle.start());  // Calls Car.start() or Motorcycle.start() based on actual type
    console.log(vehicle.stop());   // Same here - polymorphic behavior
});

// REAL-WORLD USE: Process different payment types with same code
const payments: Payment[] = [
    new CreditCardPayment(100, 'Item', new Date(), '1234'),
    new PayPalPayment(50, 'Service', new Date(), 'user@email.com'),
    new CryptoPayment(200, 'Product', new Date(), '0xABC123'),
];

// CONCEPT: Same code processes all payment types - each behaves differently
payments.forEach(payment => {
    console.log(payment.getReceipt());  // Same method, different calculations inside!
    payment.processPayment(payment.getAmount());
});

// ===========================================================================
// CONCEPT 5: Multiple Interface Implementation (Composition)
// ===========================================================================

interface Flyable {
    fly(): string;
}

interface Swimmable {
    swim(): string;
}

// CONCEPT: A class can implement MULTIPLE interfaces
// This is "composition" - building complex behavior from simple pieces
// Better than inheritance because it's more flexible
class Duck implements Flyable, Swimmable {
    constructor(private name: string) { }

    // CONCEPT: Must implement ALL methods from ALL interfaces
    fly(): string {
        return `${this.name} is flying`;
    }

    swim(): string {
        return `${this.name} is swimming`;
    }
}

// CONCEPT: Duck can be used as Flyable OR Swimmable
function makeFly(flyable: Flyable) {
    console.log(flyable.fly());
}

function makeSwim(swimmable: Swimmable) {
    console.log(swimmable.swim());
}

const donald = new Duck('Donald');
makeFly(donald);   // ✅ Duck is Flyable
makeSwim(donald);  // ✅ Duck is also Swimmable

// ===========================================================================
// CONCEPT 6: Abstract vs Concrete Methods in Abstract Classes
// ===========================================================================

abstract class Shape {
    constructor(protected readonly color: string) { }

    // CONCEPT: Abstract method - NO implementation, children MUST provide
    // Use when: Every child needs different behavior
    abstract area(): number;
    abstract describe(): string;

    // CONCEPT: Concrete method - HAS implementation, children inherit
    // Use when: All children can share the same behavior
    getColor(): string {
        return this.color;
    }
}

class Circle extends Shape {
    constructor(color: string, private radius: number) {
        super(color);
    }

    // CONCEPT: MUST implement abstract methods (TypeScript enforces this)
    area(): number {
        return Math.PI * this.radius ** 2;
    }

    describe(): string {
        return `A ${this.color} circle with radius ${this.radius}`;
    }

    // CONCEPT: Inherits getColor() - don't need to implement it!
    // Can call this.getColor() and it just works
}

// ===========================================================================
// KEY TAKEAWAYS
// ===========================================================================

/**
 * 1. Abstract classes + Interfaces = Best of both worlds
 *    - Interface defines the contract
 *    - Abstract class provides shared implementation
 *    - Children provide specific behavior
 *
 * 2. Type assertions (as) = Telling TypeScript you know more than it does
 *    - Use sparingly - often indicates design smell
 *    - Better to fix types at the source (interface/class design)
 *
 * 3. Protected in abstract classes = Sharing data with children
 *    - Abstract classes are ONLY for extending, so protected makes sense
 *    - Use for data that children need but shouldn't be public
 *
 * 4. Polymorphism with arrays = Writing flexible, reusable code
 *    - Parent type in array can hold any child
 *    - Call same method name, get different behavior
 *    - Core principle of OOP design
 *
 * 5. Multiple interfaces = Composition over inheritance
 *    - Build complex behavior from simple contracts
 *    - More flexible than long inheritance chains
 *    - Interface Segregation Principle (you'll learn in Clean Code!)
 */

export { };

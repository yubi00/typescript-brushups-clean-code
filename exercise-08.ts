/**
 * EXERCISE 8: Abstract Classes & Interfaces
 *
 * Learn when and how to use abstraction in TypeScript:
 * - Abstract classes and abstract methods
 * - Interfaces as contracts (implements keyword)
 * - When to use abstract class vs interface
 * - Polymorphism with parent types
 * - Multiple interface implementation
 *
 * Run with: npx tsx exercise-08.ts
 */

// ============================================================================
// PART 1: Abstract Classes - Cannot Be Instantiated
// ============================================================================

/**
 * TODO: Create an abstract class Animal with:
 * - Property: name (decide access modifier and type)
 * - Constructor that takes name
 * - Abstract method: makeSound (no implementation, child classes must provide it)
 * - Concrete method: sleep that returns a message like "[name] is sleeping"
 *
 * Then create two concrete classes:
 * - Dog extends Animal - implements makeSound to return "Woof! Woof!"
 * - Cat extends Animal - implements makeSound to return "Meow!"
 *
 * REQUIREMENT: You should NOT be able to create a new Animal() directly
 */

// CONCEPT: abstract class - cannot be instantiated, only extended
// Use abstract when you have shared code but want to force children to implement certain methods

// Your abstract Animal class here
abstract class Animal {
    constructor(protected name: string) { }

    abstract makeSound(): string;

    sleep(): string {
        return `${this.name} is sleeping`;
    }
}

// Your Dog class here
class Dog extends Animal {
    makeSound(): string {
        return "Woof! Woof!";
    }
}

// Your Cat class here
class Cat extends Animal {
    makeSound(): string {
        return "Meow!";
    }
}


// Test Part 1
console.log('=== PART 1: Abstract Classes ===');
// Uncomment when ready:
// const dog = new Dog('Buddy');
// const cat = new Cat('Whiskers');
// console.log(dog.makeSound());
// console.log(dog.sleep());
// console.log(cat.makeSound());
// console.log(cat.sleep());
// Try to instantiate abstract class (should error):
// const animal = new Animal('Generic'); // Should cause TypeScript error

// ============================================================================
// PART 2: Abstract Methods - Enforcing Implementation
// ============================================================================

/**
 * TODO: Create an abstract class Shape with:
 * - Property: color (decide access, type, and if it should be readonly)
 * - Constructor that takes color
 * - Abstract method: area (returns a number, but no implementation in Shape)
 * - Abstract method: describe (returns a string description)
 * - Concrete method: getColor that returns the color
 *
 * Then create concrete classes:
 * - Circle extends Shape
 *   - Property: radius
 *   - Implement area: π * radius²  (use Math.PI)
 *   - Implement describe: "A [color] circle with radius [radius]"
 *
 * - Rectangle extends Shape
 *   - Properties: width and height
 *   - Implement area: width * height
 *   - Implement describe: "A [color] rectangle [width]x[height]"
 */

// CONCEPT: abstract methods - declare method signature, no implementation
// Forces all child classes to implement it their own way

// Your abstract Shape class here
abstract class Shape {
    constructor(protected readonly color: string) { }

    abstract area(): number;

    abstract describe(): string;

    getColor(): string {
        return this.color;
    }
}


// Your Circle class here
class Circle extends Shape {
    constructor(color: string, private radius: number) {
        super(color);
    }

    area(): number {
        return Math.PI * this.radius ** 2;
    }

    describe(): string {
        return `A ${this.color} circle with radius ${this.radius}`;
    }
}


// Your Rectangle class here
class Rectangle extends Shape {
    constructor(color: string, private width: number, private height: number) {
        super(color);
    }

    area(): number {
        return this.width * this.height;
    }

    describe(): string {
        return `A ${this.color} rectangle ${this.width}x${this.height}`;
    }
}

// Test Part 2
console.log('\n=== PART 2: Abstract Methods ===');
// Uncomment when ready:
// const circle = new Circle('red', 5);
// const rectangle = new Rectangle('blue', 10, 20);
// console.log(circle.describe());
// console.log(`Area: ${circle.area()}`);
// console.log(rectangle.describe());
// console.log(`Area: ${rectangle.area()}`);

// ============================================================================
// PART 3: Interfaces with Classes (implements keyword)
// ============================================================================

/**
 * TODO: Create an interface Printable with:
 * - Method: print that returns a string
 *
 * Then create an interface Saveable with:
 * - Method: save that returns a boolean
 *
 * Then create a class Document that implements BOTH interfaces:
 * - Properties: title and content (decide types and access)
 * - Constructor to initialize both
 * - Implement print: returns formatted string with title and content
 * - Implement save: returns true (simulate saving)
 */

// CONCEPT: interface with classes - defines a contract that classes must fulfill
// Use 'implements' keyword to make a class follow an interface
// Unlike abstract classes, interfaces have NO implementation

// Your Printable interface here
interface Printable {
    print(): string;
}


// Your Saveable interface here

interface Saveable {
    save(): boolean;
}

// Your Document class here
class Document implements Printable, Saveable {
    constructor(
        private title: string,
        private content: string
    ) { }

    print(): string {
        return `Document: ${this.title}\nContent: ${this.content}`;
    }

    save(): boolean {
        return true;
    }
}

// Test Part 3
console.log('\n=== PART 3: Interfaces with Classes ===');
// Uncomment when ready:
// const doc = new Document('My Document', 'This is the content');
// console.log(doc.print());
// console.log(`Saved: ${doc.save()}`);

// ============================================================================
// PART 4: Multiple Interfaces - Classes Can Implement Many
// ============================================================================

/**
 * TODO: Create interfaces:
 * - Flyable with method: fly (returns string)
 * - Swimmable with method: swim (returns string)
 *
 * Then create classes:
 * - Bird implements Flyable
 *   - Property: species
 *   - Implement fly: "[species] is flying through the sky"
 *
 * - Fish implements Swimmable
 *   - Property: species
 *   - Implement swim: "[species] is swimming in the water"
 *
 * - Duck implements BOTH Flyable AND Swimmable
 *   - Property: name
 *   - Implement fly: "[name] the duck is flying"
 *   - Implement swim: "[name] the duck is swimming"
 */

// CONCEPT: Multiple interfaces - a class can implement multiple interfaces
// Syntax: class MyClass implements Interface1, Interface2, Interface3

// Your interfaces here
interface Flyable {
    fly(): string;
}

interface Swimmable {
    swim(): string;
}


// Your Bird class here
class Bird implements Flyable {
    constructor(private species: string) { }

    fly(): string {
        return `${this.species} is flying through the sky`;
    }
}


// Your Fish class here
class Fish implements Swimmable {
    constructor(private species: string) { }

    swim(): string {
        return `${this.species} is swimming in the water`;
    }
}


// Your Duck class here (implements both!)
class Duck implements Flyable, Swimmable {
    constructor(private name: string) { }

    fly(): string {
        return `${this.name} the duck is flying`;
    }

    swim(): string {
        return `${this.name} the duck is swimming`;
    }
}


// Test Part 4
console.log('\n=== PART 4: Multiple Interfaces ===');
// Uncomment when ready:
// const eagle = new Bird('Eagle');
// const salmon = new Fish('Salmon');
// const donald = new Duck('Donald');
// console.log(eagle.fly());
// console.log(salmon.swim());
// console.log(donald.fly());
// console.log(donald.swim());

// ============================================================================
// PART 5: Polymorphism - Parent Type Holds Child Instances
// ============================================================================

/**
 * TODO: Create an abstract class Vehicle with:
 * - Property: brand
 * - Constructor that takes brand
 * - Abstract method: start (returns string)
 * - Abstract method: stop (returns string)
 *
 * Then create concrete classes:
 * - Car extends Vehicle - implement start and stop with car-specific messages
 * - Motorcycle extends Vehicle - implement start and stop with motorcycle messages
 *
 * GOAL: Create an array of type Vehicle[] that holds both Car and Motorcycle instances
 * Then loop through and call start() and stop() on each
 * This demonstrates polymorphism - different behavior from same interface
 */

// CONCEPT: Polymorphism - using a parent type to refer to child instances
// The correct method is called based on the actual object type at runtime

// Your abstract Vehicle class here
abstract class Vehicle {
    constructor(protected brand: string) { }

    abstract start(): string;

    abstract stop(): string;
}


// Your Car class here
class Car extends Vehicle {
    start(): string {
        return `${this.brand} car is starting with a roar!`;
    }

    stop(): string {
        return `${this.brand} car is stopping smoothly.`;
    }
}


// Your Motorcycle class here

class Motorcycle extends Vehicle {
    start(): string {
        return `${this.brand} motorcycle is starting with a growl!`;
    }

    stop(): string {
        return `${this.brand} motorcycle is stopping with a screech.`;
    }
}

// Test Part 5
console.log('\n=== PART 5: Polymorphism ===');
// Uncomment when ready:
// const vehicles: Vehicle[] = [
//   new Car('Toyota'),
//   new Motorcycle('Harley-Davidson'),
//   new Car('Tesla'),
// ];
//
// vehicles.forEach(vehicle => {
//   console.log(vehicle.start());
//   console.log(vehicle.stop());
//   console.log('---');
// });

// ============================================================================
// PART 6: Comprehensive Challenge - Payment System
// ============================================================================

/**
 * TODO: Build a payment processing system:
 *
 * 1. Create an interface PaymentMethod with:
 *    - Method: processPayment that takes an amount and returns a boolean
 *    - Method: getTransactionFee that takes an amount and returns the fee
 *
 * 2. Create an abstract class Payment that implements PaymentMethod:
 *    - Properties: amount, description, timestamp
 *    - Constructor to initialize all three
 *    - Abstract method: processPayment (children must implement)
 *    - Abstract method: getTransactionFee (children must implement)
 *    - Concrete method: getReceipt that returns a formatted receipt string
 *
 * 3. Create concrete payment classes:
 *    - CreditCardPayment extends Payment
 *      - Property: cardNumber (last 4 digits only, decide access)
 *      - Implement processPayment: validate amount > 0, return true
 *      - Implement getTransactionFee: 2.9% + $0.30
 *
 *    - PayPalPayment extends Payment
 *      - Property: email (decide access)
 *      - Implement processPayment: validate amount > 0, return true
 *      - Implement getTransactionFee: 2.5% of amount
 *
 *    - CryptoPayment extends Payment
 *      - Property: walletAddress (decide access)
 *      - Implement processPayment: validate amount >= 1 (minimum), return true/false
 *      - Implement getTransactionFee: flat $0.50
 *
 * REQUIREMENTS:
 * - Use appropriate access modifiers
 * - Decide which properties should be readonly
 * - The receipt should include: description, amount, fee, total, timestamp
 *
 * BONUS CHALLENGE:
 * - Add a method to calculate total (amount + fee)
 * - Create a PaymentProcessor class that takes an array of PaymentMethod
 *   and processes all payments, returning total amount processed
 */

// Your interfaces and classes here
interface PaymentMethod {
    processPayment(amount: number): boolean;
    getTransactionFee(amount: number): number;
}

abstract class Payment implements PaymentMethod {
    constructor(
        protected amount: number,
        protected description: string,
        protected timestamp: Date
    ) { }

    abstract processPayment(amount: number): boolean;

    abstract getTransactionFee(amount: number): number;

    getReceipt(): string {
        return `Receipt for ${this.description}: Amount $${this.amount}, Fee $${this.getTransactionFee(this.amount)}, Total $${this.amount + this.getTransactionFee(this.amount)}, Timestamp: ${this.timestamp}`;
    }

    getAmount(): number {
        return this.amount;
    }
}

class CreditCardPayment extends Payment {
    constructor(amount: number, description: string, timestamp: Date, private cardNumber: string) {
        super(amount, description, timestamp);
    }

    processPayment(amount: number): boolean {
        return amount > 0;
    }

    getTransactionFee(amount: number): number {
        return amount * 0.029 + 0.30;
    }
}

class PayPalPayment extends Payment {
    constructor(amount: number, description: string, timestamp: Date, private email: string) {
        super(amount, description, timestamp);
    }

    processPayment(amount: number): boolean {
        return amount > 0;
    }

    getTransactionFee(amount: number): number {
        return amount * 0.025;
    }
}

class CryptoPayment extends Payment {
    constructor(amount: number, description: string, timestamp: Date, private walletAddress: string) {
        super(amount, description, timestamp);
    }

    processPayment(amount: number): boolean {
        return amount >= 1;
    }

    getTransactionFee(amount: number): number {
        return 0.50;
    }
}


// Test Part 6
console.log('\n=== PART 6: Payment System ===');
// Uncomment when ready:
const payments: Payment[] = [
  new CreditCardPayment(100, 'Coffee Machine', new Date(), '4532'),
  new PayPalPayment(50, 'Book', new Date(), 'user@example.com'),
  new CryptoPayment(200, 'Laptop', new Date(), '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'),
];
//
payments.forEach(payment => {
  console.log(payment.getReceipt());
  const success = payment.processPayment(payment.getAmount());
  console.log(`Payment ${success ? 'successful' : 'failed'}`);
  console.log('---');
});

// BONUS: PaymentProcessor
// Uncomment when ready:

// CONCEPT: No type assertions needed when we use the right type!
// Changed from PaymentMethod[] to Payment[] - simpler and cleaner
class PaymentProcessor {
  processAll(payments: Payment[]): number {
    let totalProcessed = 0;
    payments.forEach(payment => {
      const amount = payment.getAmount();
      // CONCEPT: No more (payment as Payment) casts - clean code!
      if (payment.processPayment(amount)) {
        const fee = payment.getTransactionFee(amount);
        totalProcessed += amount + fee;
      }
    });
    return totalProcessed;
  }
}

const processor = new PaymentProcessor();
const total = processor.processAll(payments);
console.log(`Total amount processed: $${total.toFixed(2)}`);

export { };

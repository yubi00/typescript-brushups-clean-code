/**
 * EXERCISE 6: Classes - The Basics
 *
 * Learn the fundamentals of classes in TypeScript:
 * - Class syntax and constructors
 * - Properties and methods
 * - Access modifiers (public, private, protected)
 * - readonly modifier
 * - Static properties and methods
 *
 * Run with: npx tsx exercise-06.ts
 */

// ============================================================================
// PART 1: Basic Class Syntax
// ============================================================================

/**
 * TODO: Create a simple Person class with:
 * - Properties: name (string), age (number)
 * - A constructor that takes name and age
 * - A method greet() that returns a greeting string like "Hello, I'm Alice and I'm 30 years old"
 */

// Your Person class here
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): string {
        return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
    }
}


// Test Part 1
console.log('=== PART 1: Basic Class ===');
// Uncomment when ready:
// const person1 = new Person('Alice', 30);
// console.log(person1.greet());
// const person2 = new Person('Bob', 25);
// console.log(person2.greet());

// ============================================================================
// PART 2: Access Modifiers (public, private, protected)
// ============================================================================

/**
 * TODO: Create a BankAccount class with:
 * - Private property: balance (number)
 * - Public property: accountNumber (string)
 * - Protected property: accountHolder (string)
 * - Constructor that takes accountNumber, accountHolder, and initialBalance
 * - Public method: deposit(amount: number) - adds to balance
 * - Public method: withdraw(amount: number) - subtracts from balance, returns true if successful, false if insufficient funds
 * - Public method: getBalance() - returns the current balance
 *
 * Note: Private means only accessible inside the class
 *       Public means accessible anywhere (this is the default)
 *       Protected means accessible in the class and subclasses
 */

// Your BankAccount class here
class BankAccount {
    private balance: number;
    public accountNumber: string;
    protected accountHolder: string;
    
    constructor(accountNumber: string, accountHolder: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = initialBalance;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }

    withdraw(amount: number): boolean {
        if (this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }

    getBalance(): number {
        return this.balance;
    }
}


// Test Part 2
console.log('\n=== PART 2: Access Modifiers ===');
// Uncomment when ready:
// const account = new BankAccount('ACC-001', 'Alice Smith', 1000);
// console.log(`Account: ${account.accountNumber}`);
// console.log(`Initial balance: $${account.getBalance()}`);
// account.deposit(500);
// console.log(`After deposit: $${account.getBalance()}`);
// account.withdraw(200);
// console.log(`After withdrawal: $${account.getBalance()}`);
// console.log(`Withdraw $2000: ${account.withdraw(2000) ? 'Success' : 'Failed - insufficient funds'}`);
// Try accessing private property (should cause TypeScript error):
// console.log(account.balance); // Uncomment to see error

// ============================================================================
// PART 3: Readonly Properties
// ============================================================================

/**
 * TODO: Create a Book class with:
 * - Readonly property: isbn (string) - can only be set in constructor
 * - Regular property: title (string)
 * - Regular property: isAvailable (boolean)
 * - Constructor that takes isbn and title (isAvailable defaults to true)
 * - Method: checkout() - sets isAvailable to false
 * - Method: returnBook() - sets isAvailable to true
 */

// Your Book class here
class Book {
    readonly isbn: string;
    title: string;
    isAvailable: boolean;

    constructor(isbn: string, title: string) {
        this.isbn = isbn;
        this.title = title;
        this.isAvailable = true;
    }
    
    checkout(): void {
        this.isAvailable = false;
    }

    returnBook(): void {
        this.isAvailable = true;
    }
}


// Test Part 3
console.log('\n=== PART 3: Readonly Properties ===');
// Uncomment when ready:
// const book = new Book('978-0-123456-78-9', 'TypeScript Handbook');
// console.log(`Book: ${book.title} (ISBN: ${book.isbn})`);
// console.log(`Available: ${book.isAvailable}`);
// book.checkout();
// console.log(`After checkout - Available: ${book.isAvailable}`);
// book.returnBook();
// console.log(`After return - Available: ${book.isAvailable}`);
// Try modifying readonly property (should cause TypeScript error):
// book.isbn = '000-0-000000-00-0'; // Uncomment to see error

// ============================================================================
// PART 4: Parameter Properties (Shorthand)
// ============================================================================

/**
 * TODO: Create a Product class using parameter properties shorthand:
 * - Public property: name (string)
 * - Private property: price (number)
 * - Readonly property: id (number)
 * - Method: getPrice() - returns the price
 * - Method: applyDiscount(percentage: number) - reduces price by percentage
 * - Method: getInfo() - returns string like "Product #1: Laptop - $999.99"
 *
 * Hint: Use constructor parameter properties like:
 * constructor(public name: string, private price: number, readonly id: number) {}
 */

// Your Product class here
class Product {
    constructor(public name: string, private price: number, readonly id: number) {}

    getPrice(): number {
        return this.price;
    }

    applyDiscount(percentage: number): void {
        this.price = this.price * (1 - percentage / 100);
    }

    getInfo(): string {
        return `Product #${this.id}: ${this.name} - $${this.getPrice().toFixed(2)}`;
    }
}


// Test Part 4
console.log('\n=== PART 4: Parameter Properties ===');
// Uncomment when ready:
// const product = new Product('Laptop', 1200, 1);
// console.log(product.getInfo());
// product.applyDiscount(10); // 10% discount
// console.log(`After 10% discount: ${product.getInfo()}`);

// ============================================================================
// PART 5: Static Properties and Methods
// ============================================================================

/**
 * TODO: Create a Counter class with:
 * - Static property: totalCount (number) - keeps track of all counter instances created
 * - Static method: getTotalCount() - returns totalCount
 * - Instance property: count (number, private) - starts at 0
 * - Constructor that increments totalCount each time a Counter is created
 * - Method: increment() - adds 1 to count
 * - Method: decrement() - subtracts 1 from count
 * - Method: getCount() - returns current count
 * - Static method: reset() - sets totalCount back to 0
 */

// Your Counter class here
class Counter {
    private count: number = 0;
    private static totalCount: number = 0;

    constructor() {
        Counter.totalCount++;
    }

    increment(): void {
        this.count++;
    }

    decrement(): void {
        this.count--;
    }

    getCount(): number {
        return this.count;
    }

    static getTotalCount(): number {
        return Counter.totalCount;
    }

    static reset(): void {
        Counter.totalCount = 0;
    }
}


// Test Part 5
console.log('\n=== PART 5: Static Properties ===');
// Uncomment when ready:
// console.log(`Total counters created: ${Counter.getTotalCount()}`);
// const counter1 = new Counter();
// const counter2 = new Counter();
// const counter3 = new Counter();
// console.log(`Total counters created: ${Counter.getTotalCount()}`);
// counter1.increment();
// counter1.increment();
// counter2.increment();
// console.log(`Counter 1: ${counter1.getCount()}`);
// console.log(`Counter 2: ${counter2.getCount()}`);
// console.log(`Counter 3: ${counter3.getCount()}`);
// console.log(`Total instances ever created: ${Counter.getTotalCount()}`);

// ============================================================================
// PART 6: Combining Concepts - Build a User Management System
// ============================================================================

/**
 * TODO: Create a User class with:
 * - Static property: nextId (private) - starts at 1, used to auto-generate IDs
 * - Readonly property: id (number) - auto-generated from nextId in constructor
 * - Public property: username (string)
 * - Private property: password (string)
 * - Public property: email (string)
 * - Readonly property: createdAt (Date)
 * - Private property: loginAttempts (number) - starts at 0
 * - Static method: getNextId() - returns and increments nextId
 * - Constructor: takes username, password, email (auto-generates id and sets createdAt)
 * - Method: login(password: string) - returns true if password matches, false otherwise
 *   - If password is wrong, increment loginAttempts
 *   - If loginAttempts >= 3, console.log a warning
 * - Method: resetPassword(oldPassword: string, newPassword: string) - changes password if old matches
 * - Method: getAccountInfo() - returns object with id, username, email, createdAt (NOT password!)
 */

// Your User class here

// CONCEPT: Interface - defines the shape of an object
// Use interface for object shapes, type for unions/intersections/primitives
// Better than 'any' because it provides type safety and auto-completion
interface AccountInfo {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
}

class User {
    // CONCEPT: static keyword - nextId is SHARED across ALL User instances
    // This allows auto-incrementing IDs. Each new User gets the next ID.
    private static nextId: number = 1;

    // CONCEPT: readonly - can only be set in constructor, never changed after
    // Perfect for data that should never change (like IDs and creation timestamps)
    private readonly id: number;
    private readonly createdAt: Date;
    private loginAttempts: number = 0;

    // CONCEPT: Parameter properties - shorthand for declaring and assigning in one line
    // "public username" creates a public property AND assigns constructor parameter to it
    constructor(
        public username: string,
        private password: string,
        public email: string
    ) {
        this.id = User.getNextId();
        this.createdAt = new Date();
    }

    // CONCEPT: private static method - helper method only used inside the class
    // Returns current ID and increments for next user (postfix ++)
    private static getNextId(): number {
        return User.nextId++;
    }

    login(password: string): boolean {
        if (password === this.password) {
            this.loginAttempts = 0; // Reset login attempts on successful login
            return true;
        } else {
            this.loginAttempts++;
            if (this.loginAttempts >= 3) {
                console.log('Warning: Too many failed login attempts.');
            }
            return false;
        }
    }

    resetPassword(oldPassword: string, newPassword: string): boolean {
        if (oldPassword === this.password) {
            this.password = newPassword;
            return true;
        }
        return false;
    }

    // CONCEPT: Encapsulation - return only safe data, hide sensitive info (password)
    // Now uses AccountInfo type instead of 'any' for better type safety
    getAccountInfo(): AccountInfo {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            createdAt: this.createdAt
        };
    }

    getUserLoginAttempts(): number {
        return this.loginAttempts;
    }
}


// Test Part 6
console.log('\n=== PART 6: User Management System ===');
// Uncomment when ready:
const user1 = new User('alice_dev', 'secret123', 'alice@example.com');
const user2 = new User('bob_admin', 'password456', 'bob@example.com');
console.log('User 1:', user1.getAccountInfo());
console.log('User 2:', user2.getAccountInfo());
console.log('\nTesting login:');
console.log('Correct password:', user1.login('secret123'));
console.log('Wrong password attempt 1:', user1.login('wrong'));
console.log('Wrong password attempt 2:', user1.login('wrong'));
console.log('Wrong password attempt 3:', user1.login('wrong')); // Should show warning
console.log('correct password attempt 4:', user1.login('secret123')); // Should reset login attempts
console.log('Login attempts count: ', user1.getUserLoginAttempts()); // Should be 0 after successful login
console.log('\nResetting password:');
console.log('Reset with wrong old password:', user1.resetPassword('wrong', 'newpass'));
console.log('Reset with correct old password:', user1.resetPassword('secret123', 'newpass'));
console.log('Login with new password:', user1.login('newpass'));

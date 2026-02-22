/**
 * EXERCISE 7: Inheritance - Extending Classes
 *
 * Learn how to create class hierarchies in TypeScript:
 * - extends keyword - create child classes from parent classes
 * - super keyword - call parent constructor and methods
 * - Method overriding - replace parent behavior in child
 * - protected vs private in inheritance context
 * - Adding new functionality in child classes
 *
 * Run with: npx tsx exercise-07.ts
 */

// ============================================================================
// PART 1: Basic Inheritance with extends
// ============================================================================

/**
 * TODO: Create a parent class Vehicle with:
 * - Property: brand (string, public)
 * - Property: year (number, public)
 * - Constructor that takes brand and year
 * - Method: getInfo() - returns string like "2020 Toyota"
 *
 * Then create a child class Car that extends Vehicle with:
 * - Property: doors (number, public)
 * - Constructor that takes brand, year, and doors
 * - Use super() to call parent constructor
 * - Method: getFullInfo() - returns string like "2020 Toyota with 4 doors"
 */

// CONCEPT: extends - creates a child class that inherits from a parent class
// The child class gets all properties and methods from the parent

// Your Vehicle parent class here
class Vehicle {
    // CONCEPT: Parameter properties in constructor - shorthand for declaring properties
    constructor(public brand: string, public year: number) {}

    getInfo(): string {
        return `${this.year} ${this.brand}`;
    }
}

// CONCEPT: super() - calls the parent class constructor
// Must be called BEFORE accessing 'this' in child constructor

// Your Car child class here
class Car extends Vehicle {
    // CONCEPT: Child constructor - takes parent params + own params
    // doors is added using parameter property, brand/year passed to parent
    constructor(brand: string, year: number, public doors: number) {
        super(brand, year); // Call parent constructor to initialize brand and year
    }

    // CONCEPT: Using inherited methods - Car can call getInfo() from Vehicle
    getFullInfo(): string {
        return `${this.getInfo()} with ${this.doors} doors`;
    }
}

// Test Part 1
console.log('=== PART 1: Basic Inheritance ===');
// Uncomment when ready:
// const car = new Car('Toyota', 2020, 4);
// console.log(car.getInfo());        // Inherited from Vehicle
// console.log(car.getFullInfo());    // Defined in Car
// console.log(`Brand: ${car.brand}`); // Can access parent properties
// console.log(`Doors: ${car.doors}`); // Can access own properties

// ============================================================================
// PART 2: Method Overriding
// ============================================================================

/**
 * TODO: Create a parent class Animal with:
 * - Property: name (string, public)
 * - Constructor that takes name
 * - Method: makeSound() - returns "Some generic sound"
 * - Method: introduce() - returns "I am [name]"
 *
 * 
 * Then create these child classes:
 *
 * 1. Dog extends Animal:
 *    - Override makeSound() to return "Woof! Woof!"
 *    - Keep introduce() as inherited (don't override)
 *
 * 2. Cat extends Animal:
 *    - Override makeSound() to return "Meow!"
 *    - Keep introduce() as inherited
 */

// CONCEPT: Method overriding - child class provides its own implementation
// of a method that exists in the parent class

// Your Animal parent class here
class Animal {
    constructor(public name: string) {}

    makeSound(): string {
        return "Some generic sound";
    }

    introduce(): string {
        return `I am ${this.name}`;
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


// Test Part 2
console.log('\n=== PART 2: Method Overriding ===');
// Uncomment when ready:
// const dog = new Dog('Buddy');
// const cat = new Cat('Whiskers');
// console.log(dog.introduce());     // Uses inherited method
// console.log(dog.makeSound());     // Uses overridden method
// console.log(cat.introduce());     // Uses inherited method
// console.log(cat.makeSound());     // Uses overridden method

// ============================================================================
// PART 3: Protected Members in Inheritance
// ============================================================================

/**
 * TODO: Create a parent class BankAccount with:
 * - private property: balance (number) - starts at 0
 * - Public property: accountNumber (string)
 * - Constructor that takes accountNumber
 * - Public method: getBalance() - returns balance
 * - Protected method: addToBalance(amount: number) - adds to balance
 *
 * Then create a child class SavingsAccount extends BankAccount with:
 * - Private property: interestRate (number)
 * - Constructor that takes accountNumber and interestRate
 * - Method: deposit(amount: number) - uses addToBalance() from parent
 * - Method: applyInterest() - calculates interest and uses addToBalance()
 *   Formula: balance * interestRate / 100
 */

// CONCEPT: protected - accessible in the class AND child classes
// private - only accessible in the class itself (NOT in child classes)
// Best practice: Make properties private, make methods protected if children need them

// Your BankAccount parent class here
class BankAccount {
    // CONCEPT: private property - balance cannot be accessed directly by child classes
    // This is GOOD DESIGN - forces child classes to use addToBalance() method
    private balance: number = 0;

    constructor(public accountNumber: string) {}

    getBalance(): number {
        return this.balance;
    }

    // CONCEPT: protected method - child classes CAN call this, but external code cannot
    // Provides controlled access to modify balance
    protected addToBalance(amount: number): void {
        this.balance += amount;
    }
}


// Your SavingsAccount child class here
class SavingsAccount extends BankAccount {
    // CONCEPT: Mixing parameter property (interestRate) with super() call
    constructor(accountNumber: string, private interestRate: number) {
        super(accountNumber); // Call parent constructor to initialize accountNumber
    }

    // CONCEPT: Child class using protected parent method
    deposit(amount: number): void {
        this.addToBalance(amount); // Can access because addToBalance is protected
    }

    // CONCEPT: Child class using both protected method AND public method from parent
    applyInterest(): void {
        const interest = (this.getBalance() * this.interestRate) / 100;
        this.addToBalance(interest);
        // Note: Can't access this.balance directly (it's private!)
        // Must use getBalance() and addToBalance() methods
    }
}
// Test Part 3
console.log('\n=== PART 3: Protected Members ===');
// Uncomment when ready:
// const savings = new SavingsAccount('SAV-001', 5);
// console.log(`Initial balance: $${savings.getBalance()}`);
// savings.deposit(1000);
// console.log(`After deposit: $${savings.getBalance()}`);
// savings.applyInterest();
// console.log(`After interest: $${savings.getBalance()}`);
// Try accessing protected members (should cause TypeScript errors):
// console.log(savings.balance);        // Error: protected
// savings.addToBalance(100);           // Error: protected

// ============================================================================
// PART 4: Calling Parent Methods with super
// ============================================================================

/**
 * TODO: Create a parent class Employee with:
 * - Property: name (string, public)
 * - Property: baseSalary (number, protected)
 * - Constructor that takes name and baseSalary
 * - Method: getAnnualBonus() - returns baseSalary * 0.1 (10% bonus)
 * - Method: getInfo() - returns "Employee: [name], Salary: $[baseSalary]"
 *
 * Then create a child class Manager extends Employee with:
 * - Property: teamSize (number, public)
 * - Constructor that takes name, baseSalary, and teamSize
 * - Override getAnnualBonus() to return baseSalary * 0.2 (20% bonus)
 * - Override getInfo() to return parent's getInfo() PLUS ", Team size: [teamSize]"
 *   Hint: Use super.getInfo() to call the parent method
 */

// CONCEPT: super.methodName() - calls the parent class method
// Useful when you want to extend parent behavior, not completely replace it

// Your Employee parent class here
class Employee {
    // CONCEPT: protected baseSalary - child classes need access for bonus calculation
    // This is a good use of protected (child needs direct access for calculations)
    constructor(public name: string, protected baseSalary: number) {}

    getAnnualBonus(): number {
        return this.baseSalary * 0.1;
    }

    getInfo(): string {
        return `Employee: ${this.name}, Salary: $${this.baseSalary}`;
    }
}


// Your Manager child class here
class Manager extends Employee {
    constructor(name: string, baseSalary: number, public teamSize: number) {
        super(name, baseSalary);
    }

    // CONCEPT: Completely overriding a method - new implementation, ignores parent
    getAnnualBonus(): number {
        return this.baseSalary * 0.2;
    }

    // CONCEPT: Extending parent behavior with super.methodName()
    // Calls parent's getInfo(), then ADDS additional info
    // This is better than duplicating the parent's logic
    getInfo(): string {
        return `${super.getInfo()}, Team size: ${this.teamSize}`;
    }
}


// Test Part 4
console.log('\n=== PART 4: Calling Parent Methods ===');
// Uncomment when ready:
// const employee = new Employee('Alice', 50000);
// const manager = new Manager('Bob', 80000, 5);
// console.log(employee.getInfo());
// console.log(`Bonus: $${employee.getAnnualBonus()}`);
// console.log(manager.getInfo());  // Should include parent info + team size
// console.log(`Bonus: $${manager.getAnnualBonus()}`);

// ============================================================================
// PART 5: Multi-Level Inheritance
// ============================================================================

/**
 * TODO: Create a three-level inheritance hierarchy:
 *
 * 1. Shape (parent):
 *    - Property: color (string, public)
 *    - Constructor takes color
 *    - Method: describe() - returns "A [color] shape"
 *
 * 2. Rectangle extends Shape (middle):
 *    - Property: width (number, public)
 *    - Property: height (number, public)
 *    - Constructor takes color, width, height
 *    - Method: area() - returns width * height
 *    - Override describe() - returns "A [color] rectangle"
 *
 * 3. Square extends Rectangle (child):
 *    - Constructor takes color and size (only one dimension)
 *    - Calls parent constructor with size for BOTH width and height
 *    - Override describe() - returns "A [color] square"
 *    - Inherits area() from Rectangle (don't override)
 */

// CONCEPT: Multi-level inheritance - child extends a class that already extends another
// Square inherits from Rectangle, which inherits from Shape
// Square gets properties/methods from BOTH Shape and Rectangle

// Your Shape class here
class Shape {
    constructor(public color: string) {}

    describe(): string {
        return `A ${this.color} shape`;
    }
}


// Your Rectangle class here
class Rectangle extends Shape {
    // CONCEPT: Middle layer in multi-level inheritance
    // Rectangle extends Shape, and will be extended by Square
    constructor(color: string, public width: number, public height: number) {
        super(color); // Calls Shape constructor
    }

    // CONCEPT: Adding new functionality to child class
    area(): number {
        return this.width * this.height;
    }

    describe(): string {
        return `A ${this.color} rectangle`;
    }
}


// Your Square class here
class Square extends Rectangle {
    // CONCEPT: Multi-level inheritance - Square inherits from Rectangle, which inherits from Shape
    // Square has: color (from Shape), width/height (from Rectangle), area() (from Rectangle)
    constructor(color: string, size: number) {
        super(color, size, size); // Pass size for both width and height to Rectangle
    }

    // CONCEPT: Overriding in multi-level inheritance
    // Square overrides Rectangle's describe(), which already overrode Shape's describe()
    describe(): string {
        return `A ${this.color} square`;
    }

    // CONCEPT: Inheriting methods without overriding
    // Square doesn't override area() - it just uses Rectangle's implementation
    // This works because width === height for squares, so the formula is correct
}


// Test Part 5
console.log('\n=== PART 5: Multi-Level Inheritance ===');
// Uncomment when ready:
// const shape = new Shape('red');
// const rectangle = new Rectangle('blue', 10, 5);
// const square = new Square('green', 7);
// console.log(shape.describe());
// console.log(rectangle.describe());
// console.log(`Rectangle area: ${rectangle.area()}`);
// console.log(square.describe()); // Should use Square's describe()
// console.log(`Square area: ${square.area()}`);  // Inherited from Rectangle!

// ============================================================================
// PART 6: Combining Concepts - Build an E-commerce System
// ============================================================================

/**
 * TODO: Create a product hierarchy:
 *
 * 1. Product (parent class):
 *    - Property: id (number, readonly, public)
 *    - Property: name (string, public)
 *    - Property: basePrice (number, protected)
 *    - Static property: nextId (private) - starts at 1
 *    - Constructor takes name and basePrice (auto-generates id)
 *    - Method: getPrice() - returns basePrice
 *    - Method: getDescription() - returns "Product: [name] - $[price]"
 *
 * 2. DigitalProduct extends Product:
 *    - Property: fileSize (number, public) - in MB
 *    - Property: downloadLink (string, private)
 *    - Constructor takes name, basePrice, fileSize, downloadLink
 *    - Override getDescription() to include file size
 *    - Method: download() - returns "Downloading from: [downloadLink]"
 *
 * 3. PhysicalProduct extends Product:
 *    - Property: weight (number, public) - in kg
 *    - Property: stockCount (number, private)
 *    - Constructor takes name, basePrice, weight, stockCount
 *    - Override getPrice() to add shipping cost: basePrice + (weight * 5)
 *    - Override getDescription() to include weight and price with shipping
 *    - Method: purchase(quantity: number) - reduces stockCount if enough stock,
 *      returns true if successful, false if not enough stock
 *    - Method: getStock() - returns stockCount
 */

// Your Product parent class here
class Product {
    // CONCEPT: Static property shared across ALL instances (Product, DigitalProduct, PhysicalProduct)
    // Every time ANY product is created, this counter increments
    private static nextId: number = 1;

    // CONCEPT: readonly - id can't be changed after construction
    public readonly id: number;

    // CONCEPT: protected basePrice - child classes need access to override getPrice()
    constructor(public name: string, protected basePrice: number) {
        // CONCEPT: Auto-incrementing IDs using static property
        // Product.nextId++ returns current value, then increments
        this.id = Product.nextId++;
    }

    // CONCEPT: Method that can be overridden - PhysicalProduct will override this
    getPrice(): number {
        return this.basePrice;
    }

    // CONCEPT: Method that uses getPrice() - polymorphism in action!
    // When called on PhysicalProduct, this will use the overridden getPrice()
    getDescription(): string {
        return `Product: ${this.name} - $${this.getPrice()}`;
    }
}


// Your DigitalProduct class here
class DigitalProduct extends Product {
    // CONCEPT: Child with multiple properties - some public, some private
    // fileSize is public (users can see it), downloadLink is private (hidden)
    constructor(name: string, basePrice: number, public fileSize: number, private downloadLink: string) {
        super(name, basePrice);
    }

    // CONCEPT: Extending parent's description by calling super.getDescription()
    getDescription(): string {
        return `${super.getDescription()} - File size: ${this.fileSize}MB`;
    }

    // CONCEPT: Child-specific method - only DigitalProduct has download()
    download(): string {
        return `Downloading from: ${this.downloadLink}`;
    }
}


// Your PhysicalProduct class here
class PhysicalProduct extends Product {
    constructor(name: string, basePrice: number, public weight: number, private stockCount: number) {
        super(name, basePrice);
    }

    // CONCEPT: Overriding getPrice() to add custom logic (shipping cost)
    // This override affects getDescription() too! (polymorphism)
    getPrice(): number {
        return this.basePrice + (this.weight * 5); // Add shipping cost
    }

    // CONCEPT: When this calls super.getDescription(), that method calls this.getPrice()
    // This demonstrates POLYMORPHISM - getPrice() resolves to PhysicalProduct's version
    getDescription(): string {
        return `${super.getDescription()} - Weight: ${this.weight}kg (includes shipping)`;
    }

    // CONCEPT: Business logic in child class - managing stock
    purchase(quantity: number): boolean {
        if (quantity <= this.stockCount) {
            this.stockCount -= quantity;
            return true;
        }
        return false;
    }

    getStock(): number {
        return this.stockCount;
    }
}


// Test Part 6
console.log('\n=== PART 6: E-commerce System ===');
// Uncomment when ready:
const ebook = new DigitalProduct('TypeScript Handbook', 29.99, 5.2, 'https://example.com/ebook');
const laptop = new PhysicalProduct('Gaming Laptop', 1200, 2.5, 10);
console.log(ebook.getDescription());
console.log(ebook.download());
console.log(laptop.getDescription());
console.log(`Stock: ${laptop.getStock()}`);
console.log(`Purchase 3 laptops: ${laptop.purchase(3)}`);
console.log(`Stock after purchase: ${laptop.getStock()}`);
console.log(`Purchase 10 more laptops: ${laptop.purchase(10)}`);  // Should fail


export {};

/**
 * EXERCISE 13: SOLID Principles (Practical Refactoring)
 *
 * This is the MOST important exercise for your refactoring assessment.
 * Each part gives you BAD code that violates a SOLID principle.
 * Your job: refactor it into GOOD code that follows the principle.
 *
 * The SOLID principles are:
 * S - Single Responsibility Principle (one reason to change)
 * O - Open/Closed Principle (open for extension, closed for modification)
 * L - Liskov Substitution Principle (subtypes must be substitutable)
 * I - Interface Segregation Principle (don't force unused dependencies)
 * D - Dependency Inversion Principle (depend on abstractions, not concretions)
 *
 * Run with: npx tsx exercise-13.ts
 */

// ============================================================================
// PART 1: Single Responsibility Principle (SRP)
// ============================================================================

/**
 * PRINCIPLE: A class should have only ONE reason to change.
 * If a class does multiple unrelated things, split it up.
 *
 * PROBLEM: This UserManager class handles THREE different responsibilities:
 * 1. User data management (CRUD)
 * 2. Email notifications
 * 3. Password validation
 *
 * If we change how emails are sent, we modify UserManager.
 * If we change password rules, we modify UserManager.
 * If we change how users are stored, we modify UserManager.
 * That's THREE reasons to change = SRP violation.
 *
 * TODO: Refactor into focused classes:
 * - UserService (manages user data only)
 * - EmailService (handles sending emails only)
 * - PasswordValidator (handles password rules only)
 *
 * Then compose them: UserService uses EmailService and PasswordValidator.
 *
 * IMPORTANT: Keep the same test output working!
 */

// --- BAD CODE (refactor this) ---

class UserManagerBAD {
    private users: { id: number; name: string; email: string; password: string }[] = [];
    private nextId = 1;

    createUser(name: string, email: string, password: string): string {
        // Password validation (responsibility #3)
        if (password.length < 8) {
            return `Error: Password must be at least 8 characters`;
        }
        if (!/[A-Z]/.test(password)) {
            return `Error: Password must contain an uppercase letter`;
        }
        if (!/[0-9]/.test(password)) {
            return `Error: Password must contain a number`;
        }

        // User creation (responsibility #1)
        const user = { id: this.nextId++, name, email, password };
        this.users.push(user);

        // Email notification (responsibility #2)
        console.log(`    Sending welcome email to ${email}...`);
        console.log(`    Subject: Welcome ${name}!`);
        console.log(`    Body: Your account has been created successfully.`);

        return `User ${name} created with ID ${user.id}`;
    }

    resetPassword(userId: number, newPassword: string): string {
        const user = this.users.find(u => u.id === userId);
        if (!user) return `Error: User not found`;

        // Password validation again (duplicated! responsibility #3)
        if (newPassword.length < 8) {
            return `Error: Password must be at least 8 characters`;
        }
        if (!/[A-Z]/.test(newPassword)) {
            return `Error: Password must contain an uppercase letter`;
        }
        if (!/[0-9]/.test(newPassword)) {
            return `Error: Password must contain a number`;
        }

        user.password = newPassword;

        // Email notification again (responsibility #2)
        console.log(`    Sending password reset email to ${user.email}...`);
        console.log(`    Subject: Password Changed`);
        console.log(`    Body: Your password has been updated.`);

        return `Password updated for ${user.name}`;
    }
}

// --- YOUR REFACTORED CODE HERE ---
// Create: PasswordValidator, EmailService, UserService
// Hint: UserService constructor should accept EmailService and PasswordValidator

// SRP in action: each class has exactly ONE reason to change.
// PasswordValidator changes only if password rules change.
// EmailService changes only if email logic changes.
// UserService changes only if user management logic changes.

// Validation pattern: return string | null (null = valid, string = error message).
// This is cleaner than throwing exceptions for expected validation failures.
class PasswordValidator {
    validate(password: string): string | null {
        if (password.length < 8) {
            return `Error: Password must be at least 8 characters`;
        }
        if (!/[A-Z]/.test(password)) {
            return `Error: Password must contain an uppercase letter`;
        }
        if (!/[0-9]/.test(password)) {
            return `Error: Password must contain a number`;
        }
        return null; // valid
    }
}

class EmailService {
    sendEmail(to: string, subject: string, body: string): void {
        console.log(`    Sending email to ${to}...`);
        console.log(`    Subject: ${subject}`);
        console.log(`    Body: ${body}`);
    }
}

// Composition pattern: UserService receives its dependencies via constructor.
// It doesn't CREATE them (that would be tight coupling) — it RECEIVES them.
// This makes each piece independently testable and swappable.
class UserService {
    private users: { id: number; name: string; email: string; password: string }[] = [];
    private nextId = 1;

    constructor(private emailService: EmailService, private passwordValidator: PasswordValidator) {}

    createUser(name: string, email: string, password: string): string {
        const validationError = this.passwordValidator.validate(password);
        if (validationError) {
            return validationError;
        }

        const user = { id: this.nextId++, name, email, password };
        this.users.push(user);

        this.emailService.sendEmail(email, `Welcome ${name}!`, `Your account has been created successfully.`);

        return `User ${name} created with ID ${user.id}`;
    }

    resetPassword(userId: number, newPassword: string): string {
        const user = this.users.find(u => u.id === userId);
        if (!user) return `Error: User not found`;

        const validationError = this.passwordValidator.validate(newPassword);
        if (validationError) {
            return validationError;
        }

        user.password = newPassword;

        this.emailService.sendEmail(user.email, `Password Changed`, `Your password has been updated.`);

        return `Password updated for ${user.name}`;
    }
}



// Test Part 1
console.log('=== PART 1: Single Responsibility Principle ===');
const emailService = new EmailService();
const passwordValidator = new PasswordValidator();
const userService = new UserService(emailService, passwordValidator);
console.log(userService.createUser('Alice', 'alice@example.com', 'short'));
console.log(userService.createUser('Alice', 'alice@example.com', 'nouppercasenum1'));
console.log(userService.createUser('Alice', 'alice@example.com', 'GoodPass1'));
console.log(userService.resetPassword(1, 'bad'));
console.log(userService.resetPassword(1, 'NewPass123'));


// ============================================================================
// PART 2: Open/Closed Principle (OCP)
// ============================================================================

/**
 * PRINCIPLE: Software entities should be open for extension but closed
 * for modification. You should be able to add new behavior WITHOUT
 * changing existing code.
 *
 * PROBLEM: This AreaCalculator uses if/else instanceof checks.
 * Every time we add a new shape, we must MODIFY the calculateArea method.
 * That's a violation of OCP - the class isn't "closed for modification."
 *
 * TODO: Refactor so each shape knows how to calculate its own area.
 * Use an interface/abstract class with an area() method.
 * Then AreaCalculator just calls shape.area() - no instanceof needed.
 *
 * Adding a new shape (e.g., Pentagon) should require:
 * ✅ Creating a new class (extension)
 * ❌ Modifying AreaCalculator (modification)
 */

// --- BAD CODE (refactor this) ---

class CircleBAD {
    constructor(public radius: number) {}
}

class RectangleBAD {
    constructor(public width: number, public height: number) {}
}

class TriangleBAD {
    constructor(public base: number, public height: number) {}
}

class AreaCalculatorBAD {
    calculate(shape: CircleBAD | RectangleBAD | TriangleBAD): number {
        if (shape instanceof CircleBAD) {
            return Math.PI * shape.radius ** 2;
        } else if (shape instanceof RectangleBAD) {
            return shape.width * shape.height;
        } else if (shape instanceof TriangleBAD) {
            return (shape.base * shape.height) / 2;
        }
        throw new Error('Unknown shape');
    }
}

// --- YOUR REFACTORED CODE HERE ---
// Create: Shape interface with area() method
// Create: Circle, Rectangle, Triangle classes that implement Shape
// The calculator should just call shape.area() - no instanceof!

// OCP key insight: use abstract class (or interface) so NEW shapes just extend it.
// abstract = cannot instantiate directly, forces children to implement area() and describe().
// Adding Pentagon required ZERO changes to Shape, Circle, Rectangle, or Triangle.
// That's OCP: open for extension (new class), closed for modification (no existing code touched).
abstract class Shape {
    abstract area(): number;
    abstract describe(): string;
}

class Circle extends Shape {
    constructor(public radius: number) {
        super();
    }

    area(): number {
        return Math.PI * this.radius ** 2;
    }

    describe(): string {
        return `Circle with radius ${this.radius}`;
    }
}

class Rectangle extends Shape {
    constructor(public width: number, public height: number) {
        super();
    }

    area(): number {
        return this.width * this.height;
    }

    describe(): string {
        return `Rectangle ${this.width}x${this.height}`;
    }
}

class Triangle extends Shape {
    constructor(public base: number, public height: number) {
        super();
    }

    area(): number {
        return (this.base * this.height) / 2;
    }

    describe(): string {
        return `Triangle with base ${this.base} and height ${this.height}`;
    }
}

class Pentagon extends Shape {
    constructor(public side: number) {
        super();
    }

    area(): number {
        const apothem = this.side / (2 * Math.tan(Math.PI / 5));
        return (5 * this.side * apothem) / 2;
    }

    describe(): string {
        return `Pentagon with side ${this.side}`;
    }
}



// Test Part 2
console.log('\n=== PART 2: Open/Closed Principle ===');
// Polymorphism: Shape[] array holds any child type. Runtime resolves the correct area().
const shapes: Shape[] = [
    new Circle(5),
    new Rectangle(10, 20),
    new Triangle(6, 8),
    new Pentagon(7),  // Added without modifying any existing code — OCP proven!
];
shapes.forEach(shape => {
    console.log(`${shape.describe()} → Area: ${shape.area().toFixed(2)}`);
});


// ============================================================================
// PART 3: Liskov Substitution Principle (LSP)
// ============================================================================

/**
 * PRINCIPLE: If S is a subtype of T, you should be able to use S anywhere
 * you use T without breaking the program. Children must honor the parent's
 * contract (expectations).
 *
 * PROBLEM: This is the classic Rectangle/Square violation.
 * Square extends Rectangle but overrides setWidth/setHeight to force
 * width === height. This breaks code that expects Rectangle behavior:
 * setting width and height independently.
 *
 * In renderShapes(), setting width=4 then height=5 on a Rectangle gives area=20.
 * But on a Square, setHeight(5) also changes width to 5, giving area=25.
 * The Square violates the Rectangle contract!
 *
 * TODO: Fix the hierarchy. Options:
 * - Make both extend an abstract Shape (they're peers, not parent-child)
 * - Each has its own getArea() that makes sense for its geometry
 * - renderShapes should work correctly with any Shape
 */

// --- BAD CODE (this breaks LSP) ---

class RectangleLSP {
    constructor(protected _width: number, protected _height: number) {}

    setWidth(width: number) {
        this._width = width;
    }

    setHeight(height: number) {
        this._height = height;
    }

    getArea(): number {
        return this._width * this._height;
    }

    describe(): string {
        return `Rectangle ${this._width}x${this._height}`;
    }
}

class SquareLSP extends RectangleLSP {
    constructor(size: number) {
        super(size, size);
    }

    // VIOLATION: overriding to force square constraint breaks Rectangle behavior
    setWidth(width: number) {
        this._width = width;
        this._height = width; // surprise! changes height too
    }

    setHeight(height: number) {
        this._width = height; // surprise! changes width too
        this._height = height;
    }

    describe(): string {
        return `Square ${this._width}x${this._height}`;
    }
}

function renderShapesBAD(shapes: RectangleLSP[]) {
    shapes.forEach(shape => {
        shape.setWidth(4);
        shape.setHeight(5);
        // Expected: all shapes have area 20 (4 * 5)
        console.log(`  ${shape.describe()} → Area: ${shape.getArea()} (expected 20)`);
    });
}

// --- YOUR REFACTORED CODE HERE ---
// Fix the hierarchy so Square and Rectangle are peers, not parent-child.
// Each should have immutable dimensions and its own area calculation.
// Make renderShapes work correctly with all shapes.

// LSP fix: Rectangle and Square are now PEERS (siblings), not parent-child.
// Both extend the shared Shape base — no mutable setters that could violate contracts.
// Immutable dimensions = no way to break expectations. Each shape's area() is honest.
// Rule of thumb: if a child overrides parent behavior in a surprising way, the hierarchy is wrong.
class FixedRectangle extends Shape {
    constructor(public width: number, public height: number) {
        super();
    }

    area(): number {
        return this.width * this.height;
    }

    describe(): string {
        return `Rectangle ${this.width}x${this.height}`;
    }
}

class FixedSquare extends Shape {
    constructor(public size: number) {
        super();
    }

    area(): number {
        return this.size * this.size;
    }

    describe(): string {
        return `Square ${this.size}x${this.size}`;
    }
}

function renderShapesFIXED(shapes: Shape[]) {
    shapes.forEach(shape => {
        console.log(`  ${shape.describe()} → Area: ${shape.area()}`);
    });
}   



// Test Part 3
console.log('\n=== PART 3: Liskov Substitution Principle ===');
console.log('BAD (broken LSP):');
renderShapesBAD([new RectangleLSP(1, 1), new SquareLSP(1)]);
console.log('GOOD (fixed LSP):');
const fixedShapes: Shape[] = [
    new FixedRectangle(4, 5),
    new FixedSquare(5),
];
fixedShapes.forEach(shape => {
    console.log(`  ${shape.describe()} → Area: ${shape.area()}`);
});


// ============================================================================
// PART 4: Interface Segregation Principle (ISP)
// ============================================================================

/**
 * PRINCIPLE: Clients should not be forced to depend on interfaces they
 * don't use. Don't make one fat interface - split into smaller, focused ones.
 *
 * PROBLEM: The Machine interface forces ALL implementations to have
 * print(), scan(), fax(), and staple(). But:
 * - A BasicPrinter can only print
 * - A HomeOffice can print and scan, but NOT fax or staple
 * - Only an IndustrialMachine can do everything
 *
 * The BasicPrinter is forced to throw errors for scan/fax/staple.
 * That's a code smell and ISP violation.
 *
 * TODO: Split the fat Machine interface into focused interfaces:
 * - Printer (print)
 * - Scanner (scan)
 * - Faxer (fax)
 * - Stapler (staple)
 *
 * Then each class implements ONLY what it can do:
 * - BasicPrinter implements Printer
 * - HomeOffice implements Printer, Scanner
 * - IndustrialMachine implements Printer, Scanner, Faxer, Stapler
 */

// --- BAD CODE (refactor this) ---

interface MachineBAD {
    print(doc: string): string;
    scan(doc: string): string;
    fax(doc: string): string;
    staple(doc: string): string;
}

class BasicPrinterBAD implements MachineBAD {
    print(doc: string): string {
        return `Printing: ${doc}`;
    }
    scan(doc: string): string {
        throw new Error('Scan not supported!');  // forced to implement!
    }
    fax(doc: string): string {
        throw new Error('Fax not supported!');   // forced to implement!
    }
    staple(doc: string): string {
        throw new Error('Staple not supported!'); // forced to implement!
    }
}

// --- YOUR REFACTORED CODE HERE ---
// Create: Printer, Scanner, Faxer, Stapler interfaces
// Create: BasicPrinter (Printer only), HomeOffice (Printer + Scanner),
//         IndustrialMachine (all four)

// ISP: split one fat interface into focused "capability" interfaces.
// Each interface represents one ability. Classes declare only what they support.
// `implements Printer, Scanner` — TypeScript supports implementing multiple interfaces.
// Benefit: calling basic.scan() won't even compile — caught at build time, not runtime!
interface Printer {
    print(doc: string): string;
}

interface Scanner {
    scan(doc: string): string;
}

interface Faxer {
    fax(doc: string): string;
}

interface Stapler {
    staple(doc: string): string;
}

class BasicPrinter implements Printer {
    print(doc: string): string {
        return `Printing: ${doc}`;
    }
}

class HomeOffice implements Printer, Scanner {
    print(doc: string): string {
        return `Printing: ${doc}`;
    }
    scan(doc: string): string {
        return `Scanning: ${doc}`;
    }
}

class IndustrialMachine implements Printer, Scanner, Faxer, Stapler {
    print(doc: string): string {
        return `Printing: ${doc}`;
    }
    scan(doc: string): string {
        return `Scanning: ${doc}`;
    }
    fax(doc: string): string {
        return `Faxing: ${doc}`;
    }
    staple(doc: string): string {
        return `Stapling: ${doc}`;
    }
}


// Test Part 4
console.log('\n=== PART 4: Interface Segregation Principle ===');
const basic = new BasicPrinter();
const home = new HomeOffice();
const industrial = new IndustrialMachine();

console.log(basic.print('Report.pdf'));
// basic.scan('doc') → would be a compile error! Not in Printer interface

console.log(home.print('Photo.jpg'));
console.log(home.scan('Document.pdf'));
// home.fax('doc') → would be a compile error!

console.log(industrial.print('Contract.pdf'));
console.log(industrial.scan('Receipt.jpg'));
console.log(industrial.fax('Invoice.pdf'));
console.log(industrial.staple('Packet.pdf'));


// ============================================================================
// PART 5: Dependency Inversion Principle (DIP)
// ============================================================================

/**
 * PRINCIPLE: High-level modules should not depend on low-level modules.
 * Both should depend on abstractions (interfaces).
 *
 * PROBLEM: NotificationManager directly creates and depends on specific
 * implementations (EmailSender, SMSSender). It's tightly coupled.
 * - Want to add push notifications? → Must MODIFY NotificationManager
 * - Want to test without sending real emails? → Impossible
 * - Want to swap email provider? → Must change internal code
 *
 * TODO: Refactor using dependency injection:
 * 1. Create a NotificationChannel interface with send(to, message) method
 * 2. Create EmailChannel, SMSChannel, PushChannel implementing it
 * 3. NotificationManager receives channels via constructor (injected!)
 * 4. NotificationManager.notifyAll() loops through injected channels
 *
 * Now adding a new channel = new class. No modification to NotificationManager!
 */

// --- BAD CODE (refactor this) ---

class EmailSenderBAD {
    send(to: string, message: string): string {
        return `EMAIL to ${to}: ${message}`;
    }
}

class SMSSenderBAD {
    send(to: string, message: string): string {
        return `SMS to ${to}: ${message}`;
    }
}

class NotificationManagerBAD {
    // PROBLEM: Hardcoded dependencies - tightly coupled!
    private emailSender = new EmailSenderBAD();
    private smsSender = new SMSSenderBAD();

    notify(to: string, message: string): string[] {
        const results: string[] = [];
        results.push(this.emailSender.send(to, message));
        results.push(this.smsSender.send(to, message));
        // Want to add push notifications? Must modify THIS class!
        return results;
    }
}

// --- YOUR REFACTORED CODE HERE ---
// Create: NotificationChannel interface
// Create: EmailChannel, SMSChannel, PushChannel classes
// Create: NotificationManager that accepts NotificationChannel[] in constructor

// DIP: depend on abstractions (interfaces), not concretions (specific classes).
// Constructor injection: dependencies are PASSED IN, not created internally.
// NotificationManager doesn't know or care about EmailChannel, SMSChannel, etc.
// It only knows NotificationChannel — the abstraction. That's the "inversion."
// Benefits: easy to test (inject mocks), easy to extend (new channel = new class).
interface NotificationChannel {
    send(to: string, message: string): string;
}

class EmailChannel implements NotificationChannel {
    send(to: string, message: string): string {
        return `EMAIL to ${to}: ${message}`;
    }
}

class SMSChannel implements NotificationChannel {
    send(to: string, message: string): string {
        return `SMS to ${to}: ${message}`;
    }
}

class PushChannel implements NotificationChannel {
    send(to: string, message: string): string {
        return `PUSH to ${to}: ${message}`;
    }
}

class NotificationManager {
    constructor(private channels: NotificationChannel[]) {}

    notifyAll(to: string, message: string): string[] {
        const results: string[] = [];
        this.channels.forEach(channel => {
            results.push(channel.send(to, message));
        });
        return results;
    }
}



// Test Part 5
console.log('\n=== PART 5: Dependency Inversion Principle ===');
const channels: NotificationChannel[] = [
    new EmailChannel(),
    new SMSChannel(),
    new PushChannel(),
];
const manager = new NotificationManager(channels);
const results = manager.notifyAll('alice@example.com', 'Your order shipped!');
results.forEach(r => console.log(`  ${r}`));
// Adding a new channel? Just create a class. NotificationManager unchanged!


// ============================================================================
// BONUS: Combine All Five - Mini Refactoring Challenge
// ============================================================================

/**
 * CHALLENGE: This OrderProcessor violates MULTIPLE SOLID principles.
 * Can you identify which ones and fix them?
 *
 * Violations:
 * - SRP: Does order processing, payment, AND email
 * - OCP: if/else chain for payment methods
 * - DIP: Hardcoded console.log for notifications
 *
 * TODO: Refactor to follow SOLID:
 * - Extract PaymentProcessor interface (OCP + DIP)
 * - Extract OrderNotifier interface (SRP + DIP)
 * - OrderService takes dependencies via constructor (DIP)
 *
 * This is EXACTLY the kind of thing you'll see in a refactoring assessment.
 */

// --- BAD CODE (refactor this) ---

class OrderProcessorBAD {
    processOrder(orderId: string, amount: number, paymentMethod: string, customerEmail: string): string {
        // Payment processing (not my responsibility!)
        let paymentResult: string;
        if (paymentMethod === 'card') {
            paymentResult = `Charged $${amount} to credit card`;
        } else if (paymentMethod === 'paypal') {
            paymentResult = `Charged $${amount} via PayPal`;
        } else if (paymentMethod === 'crypto') {
            paymentResult = `Charged $${amount} in crypto`;
        } else {
            return `Error: Unknown payment method ${paymentMethod}`;
        }

        // Notification (not my responsibility!)
        console.log(`    Email to ${customerEmail}: Order ${orderId} confirmed. ${paymentResult}`);

        return `Order ${orderId}: ${paymentResult}`;
    }
}

// --- YOUR REFACTORED CODE HERE ---
// Create: PaymentProcessor interface with process(amount) method
// Create: CardPayment, PayPalPayment, CryptoPayment
// Create: OrderNotifier interface with notify(email, orderId, paymentResult) method
// Create: EmailNotifier implementing OrderNotifier
// Create: OrderService that takes PaymentProcessor and OrderNotifier via constructor

// Combined SOLID: SRP (separate payment/notification/orchestration),
// OCP (new payment method = new class, no switch), DIP (interfaces injected).
// This is the real-world pattern you'll see in refactoring assessments.
interface PaymentProcessor {
    process(amount: number): string;
}

class CardPayment implements PaymentProcessor {
    process(amount: number): string {
        return `Charged $${amount} to credit card`;
    }
}

class PayPalPayment implements PaymentProcessor {
    process(amount: number): string {
        return `Charged $${amount} via PayPal`;
    }
}

class CryptoPayment implements PaymentProcessor {
    process(amount: number): string {
        return `Charged $${amount} in crypto`;
    }
}

interface OrderNotifier {
    notify(email: string, orderId: string, paymentResult: string): void;
}

class EmailNotifier implements OrderNotifier {
    notify(email: string, orderId: string, paymentResult: string): void {
        console.log(`    Email to ${email}: Order ${orderId} confirmed. ${paymentResult}`);
    }
}

class OrderService {
    constructor(private paymentProcessor: PaymentProcessor, private notifier: OrderNotifier) {}

    processOrder(orderId: string, amount: number, customerEmail: string): string {
        const paymentResult = this.paymentProcessor.process(amount);
        this.notifier.notify(customerEmail, orderId, paymentResult);
        return `Order ${orderId}: ${paymentResult}`;
    }
}


// Test BONUS
console.log('\n=== BONUS: Combined SOLID Refactoring ===');
// Uncomment when ready:
const cardProcessor = new CardPayment();
const emailNotifier = new EmailNotifier();
const orderService = new OrderService(cardProcessor, emailNotifier);
console.log(orderService.processOrder('ORD-001', 99.99, 'alice@example.com'));

// Swap payment method without touching OrderService:
const paypalService = new OrderService(new PayPalPayment(), emailNotifier);
console.log(paypalService.processOrder('ORD-002', 49.99, 'bob@example.com'));

export {};

/**
 * EXERCISE 9: Advanced OOP Patterns
 *
 * Patterns that show up constantly in real codebases and refactoring:
 * - Getters and setters (controlled property access)
 * - Method overloading (same function, different signatures)
 * - Private constructors (singleton pattern)
 * - Composition vs Inheritance
 *
 * Run with: npx tsx exercise-09.ts
 */

// ============================================================================
// PART 1: Getters & Setters
// ============================================================================

/**
 * TODO: Create a class Temperature with:
 * - Private property: _celsius (number)
 * - Constructor that takes celsius value
 * - Getter: celsius - returns _celsius
 * - Setter: celsius - validates value (must be >= -273.15, throw Error if not)
 * - Getter: fahrenheit - converts and returns _celsius in fahrenheit
 *   Formula: (celsius * 9/5) + 32
 * - Setter: fahrenheit - accepts fahrenheit, converts to celsius and stores it
 *   Formula: (fahrenheit - 32) * 5/9
 * - Getter: kelvin - converts and returns celsius in kelvin
 *   Formula: celsius + 273.15
 *
 * GOAL: Users can get/set in any unit, internally always stored as celsius
 */

// ============================================================================
// WHY GETTERS & SETTERS EXIST - THE PROBLEM THEY SOLVE
// ============================================================================
//
// WITHOUT getters/setters: properties are wide open, anyone can write anything:
//
//   class BankAccount { public balance: number = 0; }
//   const account = new BankAccount();
//   account.balance = -99999;   // ✅ TypeScript is fine with this. You're broke.
//   account.balance = NaN;      // ✅ TypeScript is fine. Your bank is broken.
//   No protection. The class can't stop bad data from getting in.
//
// YOU COULD use private + regular methods:
//   getBalance() { return this._balance; }    // must call as getBalance()
//   setBalance(v: number) { ... }             // must call as setBalance(100)
//   → This works but it's clunky for every caller.
//
// WITH getters/setters: same syntax as a plain property, but logic runs behind scenes:
//
//   get balance() { return this._balance; }
//   set balance(value: number) {
//       if (value < 0) throw new Error('Cannot be negative');
//       this._balance = value;
//   }
//
//   account.balance = 100;          ← calls the setter, triggers validation
//   console.log(account.balance);   ← calls the getter, looks like property read
//   account.balance = -99999;       ← setter THROWS Error! Protected!
//
// WHEN TO USE GETTERS/SETTERS:
//   1. Validation on write (reject invalid values before they get stored)
//   2. Computed values: get fullName() { return `${this.first} ${this.last}`; }
//   3. Unit conversion: store celsius internally, expose fahrenheit via getter/setter
//   4. Side effects: trigger events, logging, or recalculation when a value changes
//
// WHEN NOT TO USE:
//   Simple data objects with no logic (plain { id: 1, name: 'Alice' } style objects)
//
// ============================================================================

// CONCEPT: Syntax summary:
// get propertyName() { return this._value; }      ← called on READ  (no parens!)
// set propertyName(value: Type) { ... }           ← called on WRITE (no parens!)
// Convention: internal private field uses underscore prefix: _celsius, _balance

// Your Temperature class here
class Temperature {
    private _celsius: number;
    constructor(celsius: number) {
        // BUG FIX: Originally was `this._celsius = celsius` which BYPASSES the setter!
        // new Temperature(-300) would silently work - no validation!
        // RULE: Always route through the setter in constructors when validation exists
        this._celsius = 0; // Initialize first (TS requires definite assignment before setter)
        this.celsius = celsius; // Now validates through the setter
    }

    get celsius(): number {
        return this._celsius;
    }

    set celsius(value: number) {
        if (value < -273.15) {
            throw new Error('Temperature cannot be below absolute zero (-273.15°C)');
        }
        this._celsius = value;
    }

    get fahrenheit(): number {
        return (this._celsius * 9/5) + 32;
    }

    set fahrenheit(value: number) {
        this.celsius = (value - 32) * 5/9; // Use celsius setter for validation
    }

    get kelvin(): number {
        return this._celsius + 273.15;
    }
}


// Test Part 1
console.log('=== PART 1: Getters & Setters ===');
// Uncomment when ready:
// const temp = new Temperature(100);
// console.log(`Celsius: ${temp.celsius}`);
// console.log(`Fahrenheit: ${temp.fahrenheit}`);
// console.log(`Kelvin: ${temp.kelvin}`);
// temp.fahrenheit = 32;
// console.log(`After setting 32°F:`);
// console.log(`Celsius: ${temp.celsius}`);
// try {
//     temp.celsius = -300; // Should throw!
// } catch (e: any) {
//     console.log(`Error caught: ${e.message}`);
// }

// ============================================================================
// PART 2: Getters & Setters for Encapsulation (Refactoring Use Case)
// ============================================================================

/**
 * TODO: Refactor this class to use proper encapsulation with getters/setters.
 *
 * The existing BankAccount class has PUBLIC balance - this is a problem!
 * Anyone can set balance = -999999 directly.
 *
 * Refactor it so:
 * - balance is private (_balance)
 * - getter: balance returns _balance
 * - setter: balance validates (throw Error if value < 0)
 * - Method: deposit(amount: number) - adds to balance, validates amount > 0
 * - Method: withdraw(amount: number) - subtracts from balance, validates:
 *   - amount > 0
 *   - amount <= balance (can't overdraw)
 * - Getter: formattedBalance - returns string like "$1,234.56"
 */

// BAD VERSION (before refactoring) - balance is exposed!
// class BankAccount {
//     public balance: number = 0;  // ← Anyone can do account.balance = -99999!
//     constructor(initialBalance: number) {
//         this.balance = initialBalance;
//     }
// }

// GOOD VERSION (your task) - encapsulate with getter/setter:

// Your refactored BankAccount class here
class BankAccount {
    private _balance: number = 0;

    constructor(initialBalance: number) {
        this.balance = initialBalance; // Use setter for validation
    }

    get balance(): number {
        return this._balance;
    }

    set balance(value: number) {
        if (value < 0) {
            throw new Error('Balance cannot be negative');
        }
        this._balance = value;
    }

    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error('Deposit amount must be positive');
        }
        this.balance += amount; // Use setter for validation
    }

    withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error('Withdraw amount must be positive');
        }
        if (amount > this.balance) {
            throw new Error('Insufficient funds');
        }
        this.balance -= amount; // Use setter for validation
    }

    get formattedBalance(): string {
        return `$${this._balance.toFixed(2)}`;
    }
}


// Test Part 2
console.log('\n=== PART 2: Encapsulation with Getters/Setters ===');
// Uncomment when ready:
// const account = new BankAccount(1000);
// console.log(`Balance: ${account.formattedBalance}`);
// account.deposit(500);
// console.log(`After deposit $500: ${account.formattedBalance}`);
// account.withdraw(200);
// console.log(`After withdraw $200: ${account.formattedBalance}`);
// try {
//     console.log('Attempting to withdraw $5000...');
//     account.withdraw(5000); // Should fail - not enough funds
// } catch (e: any) {
//     console.log(`Error: ${e.message}`);
// }
// try {
//     console.log('Attempting to set balance to a negative value directly...');
//     account.balance = -100; // Should fail - can't set negative balance
// } catch (e: any) {
//     console.log(`Error: ${e.message}`);
// }

// ============================================================================
// PART 3: Method Overloading
// ============================================================================

/**
 * TODO: Create a Logger class with overloaded log method:
 *
 * Overload 1: log(message: string) - logs with default 'info' level
 * Overload 2: log(message: string, level: 'info' | 'warn' | 'error') - logs with specified level
 * Overload 3: log(message: string, level: 'info' | 'warn' | 'error', timestamp: Date) - logs with level and timestamp
 *
 * Implementation: All overloads call the same internal logic
 * Format: "[LEVEL] [timestamp?] message"
 *
 * Also create a static method getInstance() - but that's for Part 4!
 */

// CONCEPT: Method Overloading - multiple signatures for the same method
// TypeScript uses overload signatures (no body) + one implementation signature (with body)
// WHY: Flexibility - callers can use the function in different ways
// The implementation must handle ALL overload cases

// Your Logger class here
class Logger {
    log(message: string): void;
    log(message: string, level: 'info' | 'warn' | 'error'): void;
    log(message: string, level: 'info' | 'warn' | 'error', timestamp: Date): void;

    // CONCEPT: Implementation signature - must handle ALL overload cases
    // Uses default parameter (level = 'info') and optional parameter (timestamp?)
    // so it satisfies overload 1 (no level), overload 2 (with level), and overload 3 (with both)
    log(message: string, level: 'info' | 'warn' | 'error' = 'info', timestamp?: Date): void {
        const timeStr = timestamp ? `[${timestamp.toISOString()}]` : '';
        console.log(`[${level.toUpperCase()}] ${timeStr} ${message}`);
    }
}


// Test Part 3
console.log('\n=== PART 3: Method Overloading ===');
// Uncomment when ready:
// const logger = new Logger();
// logger.log('Server started');                          // Uses overload 1
// logger.log('Disk space low', 'warn');                 // Uses overload 2
// logger.log('Payment failed', 'error', new Date());   // Uses overload 3

// ============================================================================
// PART 4: Singleton Pattern (Private Constructor)
// ============================================================================

/**
 * TODO: Update the Logger from Part 3 to be a Singleton:
 * - Make the constructor PRIVATE
 * - Add static property: private static instance: Logger
 * - Add static method: getInstance() - returns the single instance
 *   (creates it on first call, returns existing on subsequent calls)
 *
 * Then create a second class: AppConfig (also Singleton) with:
 * - Private properties: _apiUrl, _debugMode, _maxRetries
 * - Private constructor with default values
 * - Static getInstance() method
 * - Getters for each property
 * - Setters for each property (with validation)
 * - Method: reset() - resets to defaults
 */

// CONCEPT: Singleton Pattern - ensures only ONE instance of a class exists
// HOW: Private constructor + static instance + static getInstance()
// WHY: Shared state (config, logger, database connection) - only one needed
// REAL USE: Database pools, config managers, loggers, caches

// Your Singleton Logger (updated) here
class SingletonLogger {
    private static instance: SingletonLogger;

    private constructor() {
        // Private constructor prevents instantiation from outside
    }

    public static getInstance(): SingletonLogger {
        if (!SingletonLogger.instance) {
            SingletonLogger.instance = new SingletonLogger();
        }
        return SingletonLogger.instance;
    }

    log(message: string, level: 'info' | 'warn' | 'error' = 'info', timestamp?: Date): void {
        const timeStr = timestamp ? `[${timestamp.toISOString()}]` : '';
        console.log(`[${level.toUpperCase()}] ${timeStr} ${message}`);
    }
}


// Your AppConfig Singleton here
class AppConfig {
    private static instance: AppConfig;

    private _apiUrl: string;
    private _debugMode: boolean;
    private _maxRetries: number;

    private constructor() {
        this._apiUrl = 'https://api.default.com';
        this._debugMode = false;
        this._maxRetries = 3;
    }

    public static getInstance(): AppConfig {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig();
        }
        return AppConfig.instance;
    }

    get apiUrl(): string { return this._apiUrl; }
    set apiUrl(value: string) { this._apiUrl = value; }

    get debugMode(): boolean { return this._debugMode; }
    set debugMode(value: boolean) { this._debugMode = value; }

    get maxRetries(): number { return this._maxRetries; }
    set maxRetries(value: number) { this._maxRetries = value; }

    reset(): void {
        this._apiUrl = 'https://api.default.com';
        this._debugMode = false;
        this._maxRetries = 3;
    }
}


// Test Part 4
console.log('\n=== PART 4: Singleton Pattern ===');
// Uncomment when ready:
// const logger1 = SingletonLogger.getInstance();
// const logger2 = SingletonLogger.getInstance();
// console.log(`Same instance? ${logger1 === logger2}`); // Should be true!

// const config = AppConfig.getInstance();
// console.log(`API URL: ${config.apiUrl}`);
// config.apiUrl = 'https://api.example.com';
// console.log(`Updated API URL: ${config.apiUrl}`);

// const config2 = AppConfig.getInstance();
// console.log(`Same config? ${config === config2}`); // Should be true!
// console.log(`Config2 URL: ${config2.apiUrl}`); // Should show updated URL!

// ============================================================================
// PART 5: Composition vs Inheritance
// ============================================================================

/**
 * This part shows WHEN to use composition instead of inheritance.
 *
 * SCENARIO: Building a notification system.
 *
 * BAD APPROACH (Deep inheritance - don't do this):
 * Notification → EmailNotification → HtmlEmailNotification
 * Notification → SMSNotification → PremiumSMSNotification
 * This creates a rigid hierarchy that's hard to change.
 *
 * GOOD APPROACH (Composition - do this!):
 * NotificationService uses separate Formatter and Sender classes
 * Mix and match: any formatter with any sender!
 *
 * TODO:
 * 1. Create interface MessageFormatter with:
 *    - Method: format(message: string, recipient: string): string
 *
 * 2. Create interface MessageSender with:
 *    - Method: send(formattedMessage: string, to: string): boolean
 *
 * 3. Create classes that implement MessageFormatter:
 *    - PlainTextFormatter: format returns "To: [recipient]\n[message]"
 *    - HtmlFormatter: format returns "<div><h2>To: [recipient]</h2><p>[message]</p></div>"
 *
 * 4. Create classes that implement MessageSender:
 *    - EmailSender: send logs "Sending email to [to]..." returns true
 *    - SmsSender: send logs "Sending SMS to [to]..." returns true
 *    - PushSender: send logs "Sending push to [to]..." returns true
 *
 * 5. Create class NotificationService that:
 *    - Takes formatter: MessageFormatter and sender: MessageSender in constructor
 *    - Method: notify(message: string, recipient: string): boolean
 *      Uses formatter to format, then sender to send
 *
 * POWER: You can mix any formatter with any sender!
 * (HtmlFormatter + EmailSender), (PlainTextFormatter + SmsSender), etc.
 */

// CONCEPT: Composition over Inheritance
// Instead of: class HtmlEmailNotification extends EmailNotification
// Use: new NotificationService(new HtmlFormatter(), new EmailSender())
// WHY: Flexible, testable, no deep hierarchies, swap parts at runtime

// Your interfaces here
interface MessageFormatter {
    format(message: string, recipient: string): string;
}

interface MessageSender {
    send(formattedMessage: string, to: string): boolean;
}

// Your formatter classes here
class PlainTextFormatter implements MessageFormatter {
    format(message: string, recipient: string): string {
        return `To: ${recipient}\n${message}`;
    }
}

class HtmlFormatter implements MessageFormatter {
    format(message: string, recipient: string): string {
        return `<div><h2>To: ${recipient}</h2><p>${message}</p></div>`;
    }
}

// Your sender classes here
class EmailSender implements MessageSender {
    send(formattedMessage: string, to: string): boolean {
        console.log(`Sending email to ${to}...`);
        return true;
    }
}

class SmsSender implements MessageSender {
    send(formattedMessage: string, to: string): boolean {
        console.log(`Sending SMS to ${to}...`);
        return true;
    }
}

class PushSender implements MessageSender {
    send(formattedMessage: string, to: string): boolean {
        console.log(`Sending push to ${to}...`);
        return true;
    }
}

// Your NotificationService class here
class NotificationService {
    constructor(
        private formatter: MessageFormatter,
        private sender: MessageSender
    ) {}

    notify(message: string, recipient: string): boolean {
        const formatted = this.formatter.format(message, recipient);
        return this.sender.send(formatted, recipient);
    }
}


// Test Part 5
console.log('\n=== PART 5: Composition vs Inheritance ===');
// Uncomment when ready:
// const emailService = new NotificationService(new PlainTextFormatter(), new EmailSender());
// const smsService = new NotificationService(new PlainTextFormatter(), new SmsSender());
// const fancyEmailService = new NotificationService(new HtmlFormatter(), new EmailSender());

// emailService.notify('Your order is ready!', 'alice@example.com');
// smsService.notify('Your order is ready!', '+1234567890');
// fancyEmailService.notify('Your order is ready!', 'bob@example.com');

// ============================================================================
// PART 6: Comprehensive Challenge - Config Manager
// ============================================================================

/**
 * TODO: Build a ConfigManager using everything you've learned:
 *
 * Requirements:
 * - Singleton pattern (only one ConfigManager)
 * - Store config as private object
 * - Getter: get(key: string) - returns value for key (or undefined)
 * - Setter: set(key: string, value: string | number | boolean) - sets a value
 * - Method: getAll() - returns copy of all config (not the original!)
 * - Method: has(key: string) - returns true if key exists
 * - Method: delete(key: string) - removes a key
 * - Method: load(config: Record<string, string | number | boolean>) - loads multiple values at once
 * - Getter: size - returns number of config entries
 *
 * BONUS: Add an onChange callback:
 * - Method: onKeyChange(key: string, callback: (newValue: any) => void) - subscribe to changes
 * - When a key is set, call any registered callbacks for that key
 */

// CONCEPT: This class combines MULTIPLE patterns from this exercise:
// 1. Singleton (private constructor + static getInstance)
// 2. Encapsulation (private config, controlled access via methods)
// 3. Observer pattern via BONUS (listeners notify subscribers when values change)
//
// NOTE: get() and set() here are REGULAR METHODS, not getter/setter syntax.
// Why? Because getter/setter syntax (get x() / set x()) doesn't accept key parameters.
// For key-value stores you need methods: get(key) and set(key, value)
// But `size` IS a getter (no parameters needed) - see bottom of class.

// Your ConfigManager here
class ConfigManager {
    private static instance: ConfigManager;
    private config: Record<string, string | number | boolean> = {};

    // CONCEPT: Observer Pattern (BONUS) - store callbacks per key
    // Record<string, callbacks[]> = { 'apiUrl': [fn1, fn2], 'timeout': [fn3] }
    // When a key changes, all its registered callbacks fire
    private listeners: Record<string, ((newValue: any) => void)[]> = {};

    private constructor() {}

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    get(key: string): string | number | boolean | undefined {
        return this.config[key];
    }

    set(key: string, value: string | number | boolean): void {
        this.config[key] = value;
        // CONCEPT: Observer pattern - notify all listeners registered for this key
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(value));
        }
    }

    // CONCEPT: Return a COPY with spread, not the original object!
    // If you returned this.config directly, external code could mutate it:
    //   const all = manager.getAll();
    //   all.secret = 'hacked';  ← Would modify the REAL config! Bad!
    // Spreading { ...this.config } creates a shallow copy - safe to modify externally
    getAll(): Record<string, string | number | boolean> {
        return { ...this.config };
    }

    // CONCEPT: `key in obj` checks if a property exists on an object
    // Different from obj[key] !== undefined (which fails for explicitly-set undefined values)
    has(key: string): boolean {
        return key in this.config;
    }

    delete(key: string): void {
        delete this.config[key];
    }

    // CONCEPT: Smart reuse - load() calls this.set() for each entry
    // This means load() automatically triggers onChange listeners for each key!
    // DRY principle: don't duplicate the notification logic
    load(config: Record<string, string | number | boolean>): void {
        for (const key in config) {
            this.set(key, config[key]);
        }
    }

    // CONCEPT: Observer pattern - subscribe to changes on a specific key
    // Lazy initialization: only create the array when first listener registers
    // Real-world: React state listeners, EventEmitter, Redux store.subscribe()
    onKeyChange(key: string, callback: (newValue: any) => void): void {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    }

    // CONCEPT: This IS a getter (no parameters) - accessed as config.size, not config.size()
    // Computed property: calculates on-the-fly from current state
    get size(): number {
        return Object.keys(this.config).length;
    }
}


// Test Part 6
console.log('\n=== PART 6: Config Manager ===');
// Uncomment when ready:
const config = ConfigManager.getInstance();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);
config.set('debug', true);
console.log('API URL:', config.get('apiUrl'));
console.log('Has timeout?', config.has('timeout'));
console.log('Config size:', config.size);
console.log('All config:', config.getAll());
config.delete('debug');
console.log('After delete:', config.getAll());
config.load({ retries: 3, logLevel: 'info', cache: true });
console.log('After load:', config.getAll());

// BONUS: Test onChange listener
console.log('\n--- BONUS: onChange Listener ---');
config.onKeyChange('apiUrl', (newValue) => {
    console.log(`[LISTENER] apiUrl changed to: ${newValue}`);
});
config.set('apiUrl', 'https://api.v2.example.com'); // Should trigger listener!
config.set('timeout', 3000);                         // No listener for timeout - silent

// Test that load() also triggers listeners (because load calls set internally!)
config.onKeyChange('retries', (newValue) => {
    console.log(`[LISTENER] retries changed to: ${newValue}`);
});
config.load({ retries: 5, cache: false }); // Should trigger retries listener!

export {};

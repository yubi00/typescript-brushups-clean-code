/**
 * EXERCISE 18: OOP Refactoring
 *
 * SCENARIO: A notification system for a SaaS app.
 * The code uses classes, but they're written badly — one god class doing everything,
 * no encapsulation, public mutable state everywhere, and zero use of interfaces.
 *
 * CODE SMELLS TO FIND AND FIX:
 * 1. God class — one class handles users, templates, sending, AND logging
 * 2. Public mutable state — callers can freely corrupt internal data
 * 3. No interfaces — nothing defines the contract, nothing is swappable
 * 4. Constructor does too much — fetches data, sets up connections, logs
 * 5. Methods are too long — each does several unrelated things
 * 6. Hardcoded channel logic — adding a new channel (e.g. Slack) means editing this class
 *
 * GOALS FOR THE REFACTORED VERSION:
 * 1. Split into focused classes: one per responsibility (SRP)
 * 2. Use private/readonly to protect internal state
 * 3. Define interfaces so channels are swappable (OCP + DIP)
 * 4. Constructor only assigns — no logic, no side effects
 * 5. Each method does one thing
 * 6. Adding a new channel = new class, not editing existing code
 *
 * TIPS:
 * - Start by identifying the different "jobs" the god class does
 * - Define a NotificationChannel interface first — then implement it per channel
 * - Use constructor injection to pass channels in (don't new them inside the class)
 * - private readonly for anything that shouldn't change after construction
 *
 * Run with: npx tsx exercise-18.ts
 */

// ============================================================================
// THE MESSY CODE — Refactor everything below this line
// ============================================================================

// SMELL 2: all fields are public — anyone can write notifier.users = [] and break everything
// SMELL 1: this one class handles users, templates, sending email, sending SMS, AND logging
class NotificationManager {
    public users: { id: number; name: string; email: string; phone: string; preferences: string[] }[] = [];
    public log: string[] = [];
    public emailsSent: number = 0;
    public smsSent: number = 0;
    public apiKey: string;     // public — anyone can read or overwrite the API key!
    public smsKey: string;

    // SMELL 4: constructor does too much — loads users AND logs startup AND validates keys
    constructor(emailApiKey: string, smsApiKey: string) {
        if (!emailApiKey || !smsApiKey) {
            throw new Error('API keys required');
        }
        this.apiKey = emailApiKey;
        this.smsKey = smsApiKey;
        // simulating loading users from a database on startup
        this.users = [
            { id: 1, name: 'Alice', email: 'alice@example.com', phone: '+1111', preferences: ['email'] },
            { id: 2, name: 'Bob', email: 'bob@example.com', phone: '+2222', preferences: ['sms'] },
            { id: 3, name: 'Carol', email: 'carol@example.com', phone: '+3333', preferences: ['email', 'sms'] },
        ];
        this.log.push(`[${new Date().toISOString()}] NotificationManager initialized`); // ← side effect in constructor
        console.log('NotificationManager ready. Users loaded:', this.users.length);      // ← logging in constructor
    }

    // SMELL 5: method does too much — formats template, decides channel, sends, AND logs
    // SMELL 6: hardcoded if/else for channels — adding Slack means editing this method
    sendNotification(userId: number, templateName: string, data: Record<string, string>): void {
        // find user
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            this.log.push(`User ${userId} not found`);
            console.log(`ERROR: User ${userId} not found`);
            return;
        }

        // build message from template (all templates hardcoded inside this method)
        let message = '';
        if (templateName === 'welcome') {
            message = `Hi ${user.name}, welcome to our platform! Your account is ready.`;
        } else if (templateName === 'reset') {
            message = `Hi ${user.name}, your password reset code is: ${data.code}`;
        } else if (templateName === 'invoice') {
            message = `Hi ${user.name}, your invoice #${data.invoiceId} for $${data.amount} is ready.`;
        } else {
            this.log.push(`Unknown template: ${templateName}`);
            console.log(`ERROR: Unknown template: ${templateName}`);
            return;
        }

        // send via each preferred channel
        for (const channel of user.preferences) {
            if (channel === 'email') {
                // simulate sending email
                console.log(`  [EMAIL] To: ${user.email} | ${message}`);
                this.emailsSent++;
                this.log.push(`[email] sent to ${user.email}`);
            } else if (channel === 'sms') {
                // simulate sending SMS
                console.log(`  [SMS] To: ${user.phone} | ${message}`);
                this.smsSent++;
                this.log.push(`[sms] sent to ${user.phone}`);
            }
            // ← what if we need to add Slack, push notifications, webhooks?
            // We'd have to keep adding else-ifs here — violates OCP
        }
    }

    // SMELL 1: unrelated stats reporting mixed into the same class
    printStats(): void {
        console.log(`\nStats: ${this.emailsSent} emails, ${this.smsSent} SMS sent`);
        console.log(`Log entries: ${this.log.length}`);
    }
}

// ============================================================================
// MESSY VERSION — Demo
// ============================================================================

console.log('=== MESSY VERSION ===\n');

const notifier = new NotificationManager('email-key-123', 'sms-key-456');

// Smell: caller can corrupt internal state directly
notifier.emailsSent = 999; // ← nothing stops this
notifier.apiKey = 'hacked'; // ← API key exposed and writable

notifier.sendNotification(1, 'welcome', {});
notifier.sendNotification(2, 'reset', { code: 'XY99Z' });
notifier.sendNotification(3, 'invoice', { invoiceId: 'INV-001', amount: '49.99' });
notifier.sendNotification(99, 'welcome', {}); // unknown user
notifier.sendNotification(1, 'unknown', {});  // unknown template

notifier.printStats();


// ============================================================================
// YOUR REFACTORED CODE HERE
// ============================================================================

/**
 * SUGGESTED APPROACH:
 *
 * Step 1 — Define types:
 *   interface User { readonly id: number; readonly name: string; ... preferences: string[] }
 *
 * Step 2 — Define the NotificationChannel interface (OCP + DIP):
 *   interface NotificationChannel {
 *     readonly name: string;
 *     send(user: User, message: string): void;
 *   }
 *
 * Step 3 — Implement one class per channel:
 *   class EmailChannel implements NotificationChannel { ... }
 *   class SmsChannel implements NotificationChannel { ... }
 *
 * Step 4 — Create a TemplateEngine class (SRP: only builds messages):
 *   class TemplateEngine {
 *     render(templateName: string, user: User, data: Record<string, string>): string | null
 *   }
 *
 * Step 5 — Create a UserRepository class (SRP: only manages users):
 *   class UserRepository {
 *     findById(id: number): User | undefined
 *   }
 *
 * Step 6 — Create a lean NotificationService (SRP: only orchestrates):
 *   class NotificationService {
 *     constructor(
 *       private readonly users: UserRepository,
 *       private readonly templates: TemplateEngine,
 *       private readonly channels: NotificationChannel[]
 *     ) {}
 *     send(userId: number, templateName: string, data: Record<string, string>): void
 *   }
 *
 * The result: adding Slack = new SlackChannel class, zero edits to existing code.
 */

// Write your refactored code here:


// ============================================================================
// REFACTORED VERSION — Demo (fill in after refactoring)
// ============================================================================

interface User {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    preferences: readonly string[]; //can reassign the array, but not modify its contents (splice, push, etc. are not allowed)
}

interface NotificationChannel {
    readonly name: string;
    send(user: User, message: string): void;
}

class EmailChannel implements NotificationChannel {
    readonly name = 'email';
    constructor(private readonly apiKey: string) { }
    send(user: User, message: string): void {
        console.log(`  [EMAIL] To: ${user.email} | ${message}`);
    }
}

class SmsChannel implements NotificationChannel {
    readonly name = 'sms';
    constructor(private readonly smsKey: string) { }
    send(user: User, message: string): void {
        console.log(`  [SMS] To: ${user.phone} | ${message}`);
    }
}

class TemplateEngine {
    render(templateName: string, user: User, data: Record<string, string>): string | null {
        if (templateName === 'welcome') {
            return `Hi ${user.name}, welcome to our platform! Your account is ready.`;
        } else if (templateName === 'reset') {
            return `Hi ${user.name}, your password reset code is: ${data.code}`;
        } else if (templateName === 'invoice') {
            return `Hi ${user.name}, your invoice #${data.invoiceId} for $${data.amount} is ready.`;
        }
        return null; // unknown template
    }
}

class UserRepository {
    // `readonly` locks the field reference — can't do this.users = []
    // but array contents (elements) can still be replaced via this.users[i] = ...
    private readonly users: User[] = [
        { id: 1, name: 'Alice', email: 'alice@example.com', phone: '123-456-7890', preferences: ['email'] },
        { id: 2, name: 'Bob', email: 'bob@example.com', phone: '098-765-4321', preferences: ['sms'] },
        { id: 3, name: 'Charlie', email: 'charlie@example.com', phone: '555-555-5555', preferences: ['email', 'sms'] },
    ];

    findById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }

    // Returns a new User with updated preferences — never mutates the existing object
    updatePreferences(userId: number, newPreferences: string[]): User | undefined {
        const index = this.users.findIndex(u => u.id === userId);
        if (index === -1) return undefined;

        const updated = { ...this.users[index], preferences: newPreferences };
        this.users[index] = updated; // replace the element in the internal array
        return updated;
    }
}

class NotificationService {
    constructor(
        private readonly users: UserRepository,
        private readonly templates: TemplateEngine,
        private readonly channels: NotificationChannel[]
    ) { }

    send(userId: number, templateName: string, data: Record<string, string>): void {
        const user = this.users.findById(userId);
        if (!user) {
            console.log(`ERROR: User ${userId} not found`);
            return;
        }

        const message = this.templates.render(templateName, user, data);
        if (!message) {
            console.log(`ERROR: Unknown template: ${templateName}`);
            return;
        }

        for (const channelName of user.preferences) {
            const channel = this.channels.find(c => c.name === channelName);
            if (channel) {
                channel.send(user, message);
            } else {
                console.log(`ERROR: No channel found for preference: ${channelName}`);
            }
        }
    }
}

console.log('\n\n=== REFACTORED VERSION ===\n');

const emailChannel = new EmailChannel('email-key-123');
const smsChannel = new SmsChannel('sms-key-456');
const userRepo = new UserRepository();
const templates = new TemplateEngine();
const service = new NotificationService(userRepo, templates, [emailChannel, smsChannel]);

service.send(1, 'welcome', {});
service.send(2, 'reset', { code: 'XY99Z' });
service.send(3, 'invoice', { invoiceId: 'INV-001', amount: '49.99' });
service.send(99, 'welcome', {});  // unknown user
service.send(1, 'unknown', {});   // unknown template

export { };

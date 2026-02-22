/**
 * EXERCISE 11: Advanced Utility Types & Type Manipulation
 *
 * Learn TypeScript's built-in utility types and how to manipulate types:
 * - Pick<T, K> - Select specific properties from a type
 * - Omit<T, K> - Exclude specific properties from a type
 * - Exclude<T, U> - Exclude types from a union
 * - Extract<T, U> - Extract types from a union
 * - ReturnType<T> - Get the return type of a function
 * - Parameters<T> - Get function parameters as a tuple type
 * - Awaited<T> - Unwrap Promise types
 * - NonNullable<T> - Remove null and undefined from a type
 * - Creating custom utility types
 *
 * Run with: npx tsx exercise-11.ts
 */

// ============================================================================
// PART 1: Pick<T, K> - Select Specific Properties
// ============================================================================

/**
 * TODO: You have a User type with many properties.
 * Create the following types using Pick<T, K>:
 *
 * 1. UserPreview - only id, username, and avatar
 * 2. UserCredentials - only username and password
 * 3. UserProfile - only username, email, bio, and avatar
 *
 * Then create functions:
 * - getUserPreview(user: User): UserPreview - returns preview
 * - validateCredentials(creds: UserCredentials): boolean - returns true if password length >= 8
 * - getProfile(user: User): UserProfile - returns profile
 *
 * REQUIREMENT: Use Pick<> for all type definitions. Don't manually redefine the types!
 */

// CONCEPT: Pick<T, K> - Creates a new type by picking specific properties from T
// Syntax: Pick<SourceType, 'property1' | 'property2' | ...>
// Use when: You need only a subset of properties from a larger type

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    bio: string;
    avatar: string;
    createdAt: Date;
    role: 'admin' | 'user' | 'guest';
}

// Your Pick<> type definitions here
type UserPreview = Pick<User, 'id' | 'username' | 'avatar'>;
type UserCredentials = Pick<User, 'username' | 'password'>;
type UserProfile = Pick<User, 'username' | 'email' | 'bio' | 'avatar'>;


// Your functions here
function getUserPreview(user: User): UserPreview {
    return {
        id: user.id,
        username: user.username,
        avatar: user.avatar
    };
}

function validateCredentials(creds: UserCredentials): boolean {
    return creds.password.length >= 8;
}

function getProfile(user: User): UserProfile {
    return {
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
    };
}

// Test Part 1
console.log('=== PART 1: Pick<T, K> ===');
// Uncomment when ready:
// const fullUser: User = {
//     id: 1,
//     username: 'alice',
//     email: 'alice@example.com',
//     password: 'secret123',
//     bio: 'TypeScript enthusiast',
//     avatar: 'https://example.com/avatar.jpg',
//     createdAt: new Date(),
//     role: 'admin'
// };
//
// const preview = getUserPreview(fullUser);
// console.log('Preview:', preview);
//
// const creds: UserCredentials = { username: 'alice', password: 'secret123' };
// console.log('Valid credentials:', validateCredentials(creds));
//
// const profile = getProfile(fullUser);
// console.log('Profile:', profile);

// ============================================================================
// PART 2: Omit<T, K> - Exclude Specific Properties
// ============================================================================

/**
 * TODO: You have a Product type.
 * Create the following types using Omit<T, K>:
 *
 * 1. ProductInput - Product without id and createdAt (user doesn't provide these)
 * 2. PublicProduct - Product without cost and internalNotes (hide from customers)
 * 3. ProductSummary - Product without description and internalNotes
 *
 * Then create functions:
 * - createProduct(input: ProductInput): Product - adds id and createdAt
 * - toPublicProduct(product: Product): PublicProduct - strips internal data
 * - getProductSummary(product: Product): ProductSummary - returns summary
 *
 * REQUIREMENT: Use Omit<> for type definitions. Don't manually redefine!
 */

// CONCEPT: Omit<T, K> - Creates a new type by excluding specific properties from T
// Syntax: Omit<SourceType, 'property1' | 'property2' | ...>
// Use when: It's easier to specify what to REMOVE than what to KEEP
// NOTE: Omit is the opposite of Pick!

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    cost: number;
    internalNotes: string;
    createdAt: Date;
}

// Your Omit<> type definitions here
type ProductInput = Omit<Product, 'id' | 'createdAt'>;
type PublicProduct = Omit<Product, 'cost' | 'internalNotes'>;
type ProductSummary = Omit<Product, 'description' | 'internalNotes'>;


// Your functions here

function createProduct(input: ProductInput): Product {
    return {
        ...input,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date()
    };
}

function toPublicProduct(product: Product): PublicProduct {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        createdAt: product.createdAt
    };
}

function getProductSummary(product: Product): ProductSummary {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        createdAt: product.createdAt,
        cost: product.cost
    };
}

// Test Part 2
console.log('\n=== PART 2: Omit<T, K> ===');
// Uncomment when ready:
// const input: ProductInput = {
//     name: 'Laptop',
//     description: 'High-performance laptop',
//     price: 1200,
//     cost: 800,
//     internalNotes: 'High margin item'
// };

// const product = createProduct(input);
// console.log('Created product:', product);

// const publicProduct = toPublicProduct(product);
// console.log('Public product:', publicProduct);

// const summary = getProductSummary(product);
// console.log('Summary:', summary);

// ============================================================================
// PART 3: Exclude<T, U> & Extract<T, U> - Union Type Manipulation
// ============================================================================

/**
 * TODO: You have a union type representing various events.
 *
 * 1. Create UserEvent type using Exclude<> to remove system events from Event
 * 2. Create SystemEvent type using Extract<> to get only system events from Event
 * 3. Create a function handleUserEvent(event: UserEvent): string
 *    - Should handle 'login', 'logout', 'profile_update'
 *    - Return a message for each event type
 * 4. Create a function handleSystemEvent(event: SystemEvent): string
 *    - Should handle 'server_start', 'server_stop', 'error'
 *    - Return a message for each event type
 *
 * REQUIREMENT: Use Exclude<> and Extract<> to create the event types
 */

// CONCEPT: Exclude<T, U> - Removes types from a union that are assignable to U
// Syntax: Exclude<UnionType, TypeToRemove>
// Use when: You want to filter OUT certain types from a union

// CONCEPT: Extract<T, U> - Keeps only types from a union that are assignable to U
// Syntax: Extract<UnionType, TypeToKeep>
// Use when: You want to filter IN only certain types from a union
// NOTE: Extract is the opposite of Exclude!

type Event = 'login' | 'logout' | 'profile_update' | 'server_start' | 'server_stop' | 'error';

// Your Exclude<> and Extract<> type definitions here
type UserEvent = Exclude<Event, 'server_start' | 'server_stop' | 'error'>;
type SystemEvent = Extract<Event, 'server_start' | 'server_stop' | 'error'>;


// Your functions here

function handleUserEvent(event: UserEvent): string {
    switch (event) {
        case 'login': return 'User logged in';
        case 'logout': return 'User logged out';
        case 'profile_update': return 'User profile updated';
        default: throw new Error(`Unknown user event: ${event}`);
    }
}

function handleSystemEvent(event: SystemEvent): string {
    switch (event) {
        case 'server_start': return 'Server started';
        case 'server_stop': return 'Server stopped';
        case 'error': return 'System error occurred';
        default: throw new Error(`Unknown system event: ${event}`);
    }
}

// Test Part 3
console.log('\n=== PART 3: Exclude & Extract ===');
// Uncomment when ready:
// const userEvents: UserEvent[] = ['login', 'logout', 'profile_update'];
// userEvents.forEach(event => {
//     console.log(handleUserEvent(event));
// });

// const systemEvents: SystemEvent[] = ['server_start', 'server_stop', 'error'];
// systemEvents.forEach(event => {
//     console.log(handleSystemEvent(event));
// });

// ============================================================================
// PART 4: ReturnType<T> & Parameters<T> - Function Type Extraction
// ============================================================================

/**
 * TODO: You have some existing functions.
 *
 * 1. Use ReturnType<> to create a type for the return value of fetchUser
 * 2. Use ReturnType<> to create a type for the return value of calculateDiscount
 * 3. Use Parameters<> to create a type for the parameters of processPayment
 * 4. Create a function storeUser(user: ???) that accepts the return type of fetchUser
 * 5. Create a function applyDiscount(discount: ???) that accepts the return type of calculateDiscount
 * 6. Create a function retryPayment(...args: ???) that accepts the same parameters as processPayment
 *
 * REQUIREMENT: Use ReturnType<> and Parameters<> to extract types from existing functions
 */

// CONCEPT: ReturnType<T> - Extracts the return type of a function type
// Syntax: ReturnType<typeof functionName>
// Use when: You want to use a function's return type without manually defining it
// WHY USEFUL: If the function changes, the type updates automatically!

// CONCEPT: Parameters<T> - Extracts the parameter types of a function as a tuple
// Syntax: Parameters<typeof functionName>
// Use when: You want to accept the same parameters as another function
// WHY USEFUL: Great for wrapper functions, retries, logging, etc.

// Given functions (DO NOT MODIFY)
function fetchUser(id: number) {
    return {
        id,
        name: 'Alice',
        email: 'alice@example.com',
        isActive: true
    };
}

function calculateDiscount(price: number, percentage: number) {
    return {
        originalPrice: price,
        discountPercentage: percentage,
        discountAmount: price * (percentage / 100),
        finalPrice: price - (price * (percentage / 100))
    };
}

function processPayment(amount: number, currency: string, method: 'card' | 'paypal') {
    console.log(`Processing ${currency}${amount} via ${method}`);
    return { success: true, transactionId: 'TXN-123' };
}

// Your ReturnType<> and Parameters<> type definitions here
type FetchUserReturn = ReturnType<typeof fetchUser>;
type CalculateDiscountReturn = ReturnType<typeof calculateDiscount>;
type ProcessPaymentParams = Parameters<typeof processPayment>;


// Your functions here
function storeUser(user: FetchUserReturn) {
    console.log('Storing user:', user);
}

function applyDiscount(discount: CalculateDiscountReturn) {
    console.log('Applying discount:', discount);
}

function retryPayment(...args: ProcessPaymentParams) {
    console.log('Retrying payment with args:', args);
}

// Test Part 4
console.log('\n=== PART 4: ReturnType & Parameters ===');
// Uncomment when ready:
// const fetchedUser = fetchUser(1);
// storeUser(fetchedUser);

// const discount = calculateDiscount(100, 10);
// applyDiscount(discount);

// retryPayment(50, '$', 'card');

// ============================================================================
// PART 5: Awaited<T> & NonNullable<T> - Unwrapping & Filtering Types
// ============================================================================

/**
 * TODO: Work with async functions and nullable types.
 *
 * 1. Use Awaited<> to get the resolved type of fetchDataAsync
 * 2. Use Awaited<> to get the resolved type of loadUserAsync
 * 3. Use NonNullable<> to create a type that removes null/undefined from MaybeUser
 * 4. Create processData(data: ???) that accepts the awaited type of fetchDataAsync
 * 5. Create showUser(user: ???) that accepts the awaited type of loadUserAsync
 * 6. Create ensureUser(user: MaybeUser): ??? that returns NonNullable version
 *    - Should throw error if user is null/undefined
 *
 * REQUIREMENT: Use Awaited<> and NonNullable<> to extract/filter types
 */

// CONCEPT: Awaited<T> - Unwraps the type that a Promise resolves to
// Syntax: Awaited<PromiseType>
// Use when: You need the resolved type of a Promise without using .then()
// WHY USEFUL: Type-safe async code without duplication

// CONCEPT: NonNullable<T> - Removes null and undefined from a type
// Syntax: NonNullable<TypeThatMightBeNullable>
// Use when: You've validated that a value is not null/undefined
// WHY USEFUL: Makes functions type-safe after null checks

// Given async functions (DO NOT MODIFY)
async function fetchDataAsync() {
    return {
        items: [1, 2, 3, 4, 5],
        total: 5,
        page: 1
    };
}

async function loadUserAsync(id: number) {
    return {
        id,
        username: 'bob',
        email: 'bob@example.com'
    };
}

// Given type
type MaybeUser = { id: number; name: string } | null | undefined;

// Your Awaited<> and NonNullable<> type definitions here
type FetchDataResult = Awaited<ReturnType<typeof fetchDataAsync>>;
type LoadUserResult = Awaited<ReturnType<typeof loadUserAsync>>;
type NonNullableUser = NonNullable<MaybeUser>;

// Your functions here
function processData(data: FetchDataResult) {
    console.log('Processing data:', data);
}

function showUser(user: LoadUserResult) {
    console.log('User info:', user);
}

function ensureUser(user: MaybeUser): NonNullableUser {
    if (user == null) {
        throw new Error('User is null or undefined');
    }
    return user;
}


// Test Part 5
console.log('\n=== PART 5: Awaited & NonNullable ===');
// Uncomment when ready:
// fetchDataAsync().then(data => {
//     processData(data);
// });

// loadUserAsync(1).then(user => {
//     showUser(user);
// });

// const maybeUser: MaybeUser = { id: 1, name: 'Charlie' };
// try {
//     const user = ensureUser(maybeUser);
//     console.log('Ensured user:', user);
// } catch (e) {
//     console.error(e);
// }

// ============================================================================
// PART 6: Custom Utility Types - Build Your Own!
// ============================================================================

/**
 * TODO: Create your own utility types using the concepts you've learned.
 *
 * 1. Create Mutable<T> - removes readonly from all properties
 *    Hint: Use mapped types with -readonly modifier
 *
 * 2. Create PartialBy<T, K> - makes only specific properties optional
 *    Hint: Combine Omit, Pick, and Partial
 *
 * 3. Create RequiredBy<T, K> - makes only specific properties required
 *    Hint: Similar to PartialBy but with Required
 *
 * Then use them:
 * - Create a Config type with some readonly properties
 * - Use Mutable<Config> to make it editable
 * - Create UpdateUserInput using PartialBy to make email and bio optional
 * - Create CreateProductInput using RequiredBy to make certain fields required
 *
 * CHALLENGE: Test your utility types work correctly!
 */

// CONCEPT: Custom Utility Types - You can create your own type helpers!
// Use when: Built-in utility types don't do exactly what you need
// HOW: Combine mapped types, conditional types, and built-in utilities
// This is POWERFUL - you can create domain-specific type helpers!

// Your custom utility types here
type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;


// Your usage examples here
interface Config {
    readonly apiUrl: string;
    readonly timeout: number;
    retries: number;
}

type MutableConfig = Mutable<Config>;

type UpdateUserInput = PartialBy<User, 'email' | 'bio'>;
type CreateProductInput = RequiredBy<Product, 'name' | 'price'>;


// Test Part 6
console.log('\n=== PART 6: Custom Utility Types ===');
// Uncomment when ready:
// Add your own tests here!
// const config: Config = {
//     apiUrl: 'https://api.example.com',
//     timeout: 5000,
//     retries: 3
// };

// const mutableConfig: MutableConfig = {
//     ...config,
//     timeout: 10000, // Now we can change timeout
//     retries: 5
// };

// console.log('Mutable config:', mutableConfig);

// const updateUser: UpdateUserInput = {
//     username: 'new_username',
//     id: 1,
//     password: 'new_password',
//     avatar: 'https://example.com/new_avatar.jpg',
//     createdAt: new Date(),
//     role: 'user'
//     // email and bio are optional
// };

// const newProduct: CreateProductInput = {
//     name: 'New Product',
//     price: 49.99,
//     description: 'A great product',
//     cost: 30,
//     internalNotes: 'High priority item',
//     createdAt: new Date(),
//     id: 'PROD-123'
// };

// console.log('Update user input:', updateUser);
// console.log('Create product input:', newProduct);

// ============================================================================
// PART 7: Comprehensive Challenge - API Response Transformer
// ============================================================================

/**
 * TODO: Build a type-safe API response transformer system.
 *
 * You have a raw API response type with many fields.
 * Create utility types and functions to transform it:
 *
 * 1. Create APIResponseData using Pick<> to get data, status, message
 * 2. Create APIError using Pick<> and Omit<> to get error-related fields
 * 3. Create SafeAPIResponse using NonNullable<> to ensure data exists
 * 4. Create TransformFn<T> type using ReturnType<> and generics
 * 5. Create transformResponse<T>(response: APIResponse, transformer: (data: ???) => T): T | null
 *    - Should return null if status is not 'success'
 *    - Should transform the data using the transformer function
 *    - Should be fully type-safe!
 *
 * BONUS: Add error handling and use Extract<>/Exclude<> for status filtering
 */

// The API response type (DO NOT MODIFY)
interface APIResponse {
    data: any;
    status: 'success' | 'error' | 'loading';
    message: string;
    error: string | null;
    errorCode: number | null;
    timestamp: number;
    requestId: string;
}

// Your utility types here
type APIResponseData = Pick<APIResponse, 'data' | 'status' | 'message'>;
type APIError = Omit<APIResponse, 'data' | 'timestamp' | 'requestId'>;
type SafeAPIResponse = NonNullable<Pick<APIResponse, 'data'>>;


// Your transformer function here
type TransformFn<T> = (data: SafeAPIResponse['data']) => T;

function transformResponse<T>(response: APIResponse, transformer: TransformFn<T>): T | null {
    if (response.status !== 'success' || response.data == null) {
        console.error('API Error:', response.error, 'Code:', response.errorCode);
        return null;
    }
    return transformer(response.data);
}


// Test Part 7
console.log('\n=== PART 7: API Response Transformer ===');
// Uncomment when ready:
const successResponse: APIResponse = {
    data: { id: 1, name: 'Product', price: 99.99 },
    status: 'success',
    message: 'Data fetched successfully',
    error: null,
    errorCode: null,
    timestamp: Date.now(),
    requestId: 'REQ-123'
};

const errorResponse: APIResponse = {
    data: null,
    status: 'error',
    message: 'Failed to fetch data',
    error: 'Not found',
    errorCode: 404,
    timestamp: Date.now(),
    requestId: 'REQ-124'
};

interface TransformedProduct {
    productId: number;
    productName: string;
    cost: number;
}

const result = transformResponse(successResponse, (data) => ({
    productId: data.id,
    productName: data.name,
    cost: data.price
}));

console.log('Transformed:', result);

const errorResult = transformResponse(errorResponse, (data) => data);
console.log('Error result:', errorResult);


// ============================================================================
// BONUS: Status Filtering with Extract/Exclude + Better Error Handling
// ============================================================================

/**
 * CONCEPT: Extract<> and Exclude<> for filtering union types
 *
 * Extract<T, U> - keeps only types from T that match U
 * Exclude<T, U> - removes types from T that match U
 *
 * Use case: Create specific types based on status values
 */

// CONCEPT: Extract specific status values from the union
type SuccessStatus = Extract<APIResponse['status'], 'success'>;  // Result: 'success'
type ErrorStatus = Extract<APIResponse['status'], 'error'>;      // Result: 'error'
type LoadingStatus = Extract<APIResponse['status'], 'loading'>;  // Result: 'loading'

// CONCEPT: Exclude status values to get "everything except"
type NonSuccessStatus = Exclude<APIResponse['status'], 'success'>;  // Result: 'error' | 'loading'
type NonErrorStatus = Exclude<APIResponse['status'], 'error'>;      // Result: 'success' | 'loading'

// CONCEPT: Create specific response types based on status
// Using intersection (&) to narrow the status field
type SuccessResponse = APIResponse & { status: SuccessStatus };
type ErrorResponse = APIResponse & { status: ErrorStatus };
type LoadingResponse = APIResponse & { status: LoadingStatus };

/**
 * CONCEPT: Type guard functions - narrow types at runtime
 *
 * Syntax: function isX(value: Parent): value is Child
 *
 * The "is" keyword tells TypeScript that if this function returns true,
 * the parameter is the more specific type (Child).
 */

// Type guard for success responses
function isSuccessResponse(response: APIResponse): response is SuccessResponse {
    return response.status === 'success';
}

// Type guard for error responses
function isErrorResponse(response: APIResponse): response is ErrorResponse {
    return response.status === 'error';
}

// Type guard for loading responses
function isLoadingResponse(response: APIResponse): response is LoadingResponse {
    return response.status === 'loading';
}

/**
 * CONCEPT: Improved transformer with better error handling
 *
 * Benefits:
 * - Uses type guards for type-safe status checking
 * - Optional custom error handler
 * - Handles all three status types explicitly
 * - TypeScript knows the exact type in each branch!
 */
function transformResponseBonus<T>(
    response: APIResponse,
    transformer: TransformFn<T>,
    errorHandler?: (error: ErrorResponse) => void  // Optional custom error handler
): T | null {
    // CONCEPT: Type guard narrows the type inside this block
    // TypeScript knows response is ErrorResponse here!
    if (isErrorResponse(response)) {
        if (errorHandler) {
            errorHandler(response);  // response is ErrorResponse, guaranteed to have error info
        } else {
            console.error(`API Error [${response.errorCode}]: ${response.error}`);
            console.error(`Message: ${response.message}`);
        }
        return null;
    }

    // CONCEPT: Handle loading state separately
    if (isLoadingResponse(response)) {
        console.warn('Response is still loading, cannot transform yet');
        return null;
    }

    // CONCEPT: At this point, TypeScript knows response is SuccessResponse!
    // But we still need to check if data exists (could be null)
    if (!isSuccessResponse(response)) {
        console.error('Unexpected response status');
        return null;
    }

    if (response.data == null) {
        console.error('Success response but data is null');
        return null;
    }

    return transformer(response.data);
}

/**
 * CONCEPT: Helper function to handle responses based on status
 *
 * This demonstrates the power of Extract/Exclude with type guards:
 * - Each case gets the right type automatically
 * - Exhaustive checking ensures all statuses are handled
 */
function handleResponse<T>(
    response: APIResponse,
    handlers: {
        onSuccess: (data: any) => T;
        onError: (error: ErrorResponse) => T;
        onLoading: (loadingResponse: LoadingResponse) => T;
    }
): T {
    if (isSuccessResponse(response)) {
        return handlers.onSuccess(response.data);  // response is SuccessResponse
    }

    if (isErrorResponse(response)) {
        return handlers.onError(response);  // response is ErrorResponse
    }

    if (isLoadingResponse(response)) {
        return handlers.onLoading(response);  // response is LoadingResponse
    }

    // CONCEPT: Exhaustive check - should never reach here
    // Note: TypeScript can't prove the guards are exhaustive in this context
    // In production, this would catch any new status values we add to the union
    throw new Error(`Unhandled status: ${response.status}`);
}


// ============================================================================
// BONUS Tests
// ============================================================================

console.log('\n=== BONUS: Status Filtering & Better Error Handling ===');

// Test with custom error handler
const customErrorHandler = (error: ErrorResponse) => {
    console.log(`💥 Custom Error Handler:`);
    console.log(`   Error: ${error.error}`);
    console.log(`   Code: ${error.errorCode}`);
    console.log(`   RequestID: ${error.requestId}`);
};

const bonusResult = transformResponseBonus(
    successResponse,
    (data) => ({
        productId: data.id,
        productName: data.name,
        cost: data.price
    })
);
console.log('✅ Bonus transformed (success):', bonusResult);

const bonusErrorResult = transformResponseBonus(
    errorResponse,
    (data) => data,
    customErrorHandler
);
console.log('❌ Bonus result (error):', bonusErrorResult);

// Test loading response
const loadingResponse: APIResponse = {
    data: null,
    status: 'loading',
    message: 'Loading...',
    error: null,
    errorCode: null,
    timestamp: Date.now(),
    requestId: 'REQ-125'
};

const loadingResult = transformResponseBonus(loadingResponse, (data) => data);
console.log('⏳ Bonus result (loading):', loadingResult);

// Test the handleResponse function
console.log('\n--- Testing handleResponse ---');

const handleResult = handleResponse(successResponse, {
    onSuccess: (data) => `Got data: ${data.name}`,
    onError: (err) => `Error occurred: ${err.error}`,
    onLoading: (loading) => `Still loading...`
});
console.log('Handle success:', handleResult);

const handleErrorResult = handleResponse(errorResponse, {
    onSuccess: (data) => `Got data: ${data}`,
    onError: (err) => `Error ${err.errorCode}: ${err.error}`,
    onLoading: (loading) => `Still loading...`
});
console.log('Handle error:', handleErrorResult);

const handleLoadingResult = handleResponse(loadingResponse, {
    onSuccess: (data) => `Got data: ${data}`,
    onError: (err) => `Error occurred: ${err.error}`,
    onLoading: (loading) => `Loading (RequestID: ${loading.requestId})`
});
console.log('Handle loading:', handleLoadingResult);

export {};

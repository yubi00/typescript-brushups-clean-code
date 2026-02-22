# Exercise 11 BONUS - Status Filtering with Extract/Exclude

## 🎯 What You Built

The bonus challenge asked you to:
1. **Use Extract<>/Exclude<> for status filtering** - create specific types for different API statuses
2. **Add better error handling** - use type guards to handle success/error/loading states

---

## 🆕 New Concepts in the Bonus

### 1. **Extract<> to Pick Specific Union Members**

```typescript
type SuccessStatus = Extract<APIResponse['status'], 'success'>;  // Result: 'success'
type ErrorStatus = Extract<APIResponse['status'], 'error'>;      // Result: 'error'
type LoadingStatus = Extract<APIResponse['status'], 'loading'>;  // Result: 'loading'
```

**CONCEPT: Extract for Filtering Unions**
- Start with a union: `'success' | 'error' | 'loading'`
- Extract ONLY the values you want: `'success'`
- Result is a narrower type

**Why this is useful:**
- Creates single literal types from unions
- Used to create more specific types
- Ensures type safety when you know the exact status

---

### 2. **Exclude<> to Remove Union Members**

```typescript
type NonSuccessStatus = Exclude<APIResponse['status'], 'success'>;
// Result: 'error' | 'loading'

type NonErrorStatus = Exclude<APIResponse['status'], 'error'>;
// Result: 'success' | 'loading'
```

**CONCEPT: Exclude for Removing from Unions**
- Start with a union: `'success' | 'error' | 'loading'`
- Remove values you don't want: remove `'success'`
- Result: `'error' | 'loading'`

**Mental model:**
- Extract = "keep only these"
- Exclude = "remove these"

**Real-world use:**
- Handling "all non-success states"
- Error or loading scenarios
- Conditional type logic

---

### 3. **Intersection to Narrow Response Types**

```typescript
type SuccessResponse = APIResponse & { status: SuccessStatus };
type ErrorResponse = APIResponse & { status: ErrorStatus };
type LoadingResponse = APIResponse & { status: LoadingStatus };
```

**CONCEPT: Type Intersection for Narrowing**
- `APIResponse` has `status: 'success' | 'error' | 'loading'`
- `{ status: SuccessStatus }` has `status: 'success'`
- `APIResponse & { status: SuccessStatus }` combines them
- Result: APIResponse but status can ONLY be 'success'

**Why this works:**
- Intersection takes the MORE SPECIFIC type
- `'success' | 'error' | 'loading'` intersected with `'success'` = `'success'`
- Creates specific response variants

**Alternative approach (type narrowing without intersection):**
```typescript
// This also works but intersection is cleaner
type SuccessResponse = APIResponse extends infer R
    ? R extends { status: 'success' } ? R : never
    : never;
```

**Real-world use:**
- API response type variants
- State machine states
- Form validation states

---

### 4. **Type Guard Functions with `is` Predicate**

```typescript
function isSuccessResponse(response: APIResponse): response is SuccessResponse {
    return response.status === 'success';
}
```

**CONCEPT: Type Predicates for Runtime Type Narrowing**
- Syntax: `function isX(value: Parent): value is Child`
- The `is` keyword is a **type predicate**
- Tells TypeScript: "If this returns true, value is the Child type"

**How it works:**
```typescript
const response: APIResponse = getResponse();

if (isSuccessResponse(response)) {
    // Inside here, TypeScript KNOWS response is SuccessResponse
    // response.status is narrowed to 'success'
    console.log(response.data);  // Type-safe!
}
```

**Without `is` predicate:**
```typescript
function isSuccessResponseBad(response: APIResponse): boolean {
    return response.status === 'success';
}

if (isSuccessResponseBad(response)) {
    // TypeScript still thinks response is APIResponse
    // No type narrowing happens!
}
```

**Real-world use:**
- Validating API responses
- Discriminating union types
- Type-safe error handling

---

### 5. **Optional Function Parameters**

```typescript
function transformResponseBonus<T>(
    response: APIResponse,
    transformer: TransformFn<T>,
    errorHandler?: (error: ErrorResponse) => void  // ← Optional!
): T | null
```

**CONCEPT: Optional Parameters with `?`**
- `errorHandler?` means "this parameter is optional"
- Can call with or without it:
  ```typescript
  transformResponseBonus(response, transformer);  // ✅ OK
  transformResponseBonus(response, transformer, customHandler);  // ✅ Also OK
  ```

**Using optional parameters:**
```typescript
if (errorHandler) {
    errorHandler(response);  // Only call if provided
} else {
    console.error('Default error handling');
}
```

**Real-world use:**
- Customizable behavior
- Default vs custom handlers
- Flexible APIs

---

### 6. **Exhaustiveness Checking Pattern**

```typescript
function handleResponse<T>(
    response: APIResponse,
    handlers: {
        onSuccess: (data: any) => T;
        onError: (error: ErrorResponse) => T;
        onLoading: (loadingResponse: LoadingResponse) => T;
    }
): T {
    if (isSuccessResponse(response)) {
        return handlers.onSuccess(response.data);
    }

    if (isErrorResponse(response)) {
        return handlers.onError(response);
    }

    if (isLoadingResponse(response)) {
        return handlers.onLoading(response);
    }

    // If we reach here, we forgot to handle a status!
    throw new Error(`Unhandled status: ${response.status}`);
}
```

**CONCEPT: Exhaustive Handling with Type Guards**
- Check all possible cases with type guards
- Each branch gets the narrowed type
- Final throw ensures we haven't missed anything

**Why this pattern is powerful:**
- Compile-time safety (TypeScript knows the types in each branch)
- Runtime safety (throws if we missed a case)
- Forces you to handle all scenarios

**Alternative with switch + never:**
```typescript
function handle(status: 'success' | 'error' | 'loading') {
    switch (status) {
        case 'success':
            return 'OK';
        case 'error':
            return 'ERR';
        case 'loading':
            return 'LOAD';
        default:
            // If we add a new status to the union and forget to handle it,
            // TypeScript will error here because status won't be 'never'
            const exhaustive: never = status;
            throw new Error(`Unhandled: ${exhaustive}`);
    }
}
```

**Real-world use:**
- State machines
- Event handlers
- API response processing

---

### 7. **Handler Objects Pattern**

```typescript
const handleResult = handleResponse(successResponse, {
    onSuccess: (data) => `Got data: ${data.name}`,
    onError: (err) => `Error occurred: ${err.error}`,
    onLoading: (loading) => `Still loading...`
});
```

**CONCEPT: Object of Handlers Instead of Callbacks**
- Instead of separate parameters: `onSuccess, onError, onLoading`
- Group them in an object: `{ onSuccess, onError, onLoading }`

**Benefits:**
- More readable (clear what each handler does)
- Easy to add new handlers
- Can make some handlers optional:
  ```typescript
  handlers: {
      onSuccess: (data: any) => T;
      onError?: (error: ErrorResponse) => T;  // Optional!
      onLoading?: (loading: LoadingResponse) => T;  // Optional!
  }
  ```

**Real-world use:**
- React hooks (useEffect with cleanup)
- Event emitters
- State management callbacks
- Promise-like APIs

---

## 🎯 Key Differences: Extract vs Exclude

| Aspect | Extract | Exclude |
|--------|---------|---------|
| **Purpose** | Keep only matching types | Remove matching types |
| **Example** | `Extract<'a'\|'b'\|'c', 'a'\|'b'>` → `'a'\|'b'` | `Exclude<'a'\|'b'\|'c', 'a'\|'b'>` → `'c'` |
| **Mental Model** | "Include these" | "Remove these" |
| **Use Case** | Get specific status | Get all except status |

---

## 🎯 Key Differences: Type Guard vs Regular Function

| Aspect | Type Guard (`is` predicate) | Regular Boolean Function |
|--------|---------------------------|------------------------|
| **Return Type** | `value is Type` | `boolean` |
| **Type Narrowing** | ✅ Yes - TypeScript narrows the type | ❌ No - type stays the same |
| **Example** | `if (isError(x)) { /* x is Error */ }` | `if (isError(x)) { /* x is still unknown */ }` |
| **Use Case** | When you need TypeScript to understand the type | Simple boolean checks |

---

## 🚀 What You Learned in the Bonus

✅ **Extract<T, U>** - filtering unions to keep specific values
✅ **Exclude<T, U>** - filtering unions to remove specific values
✅ **Type intersections** - narrowing types with `&`
✅ **Type guards** - runtime type narrowing with `is` predicates
✅ **Optional parameters** - flexible function signatures with `?`
✅ **Exhaustiveness checking** - ensuring all cases are handled
✅ **Handler objects pattern** - organizing callbacks in objects
✅ **Status-based response types** - creating variants from base types

---

## 💡 Production Pattern You Built

### Pattern: Type-Safe API Response Handler

```typescript
// 1. Define status-specific types
type SuccessStatus = Extract<ResponseStatus, 'success'>;
type ErrorStatus = Extract<ResponseStatus, 'error'>;

type SuccessResponse = Response & { status: SuccessStatus };
type ErrorResponse = Response & { status: ErrorStatus };

// 2. Create type guards
function isSuccess(res: Response): res is SuccessResponse {
    return res.status === 'success';
}

function isError(res: Response): res is ErrorResponse {
    return res.status === 'error';
}

// 3. Use in handler with exhaustive checks
function handleAPIResponse<T>(
    response: Response,
    handlers: {
        onSuccess: (data: any) => T;
        onError: (error: ErrorResponse) => T;
    }
): T {
    if (isSuccess(response)) {
        return handlers.onSuccess(response.data);  // Type-safe!
    }

    if (isError(response)) {
        return handlers.onError(response);  // Type-safe!
    }

    throw new Error(`Unhandled status: ${response.status}`);
}
```

**This pattern is used in:**
- React Query (query status handling)
- Redux Toolkit (async thunk states)
- Axios interceptors
- GraphQL clients
- REST API clients

---

## 🎓 From Junior to Senior

**Junior approach:**
```typescript
function transform(response: any) {
    if (response.status === 'success') {
        return response.data;
    }
    console.log('error');
    return null;
}
```

**Senior approach (what you just built):**
```typescript
function transform<T>(
    response: APIResponse,
    transformer: TransformFn<T>,
    errorHandler?: (error: ErrorResponse) => void
): T | null {
    if (isErrorResponse(response)) {
        errorHandler?.(response);  // Type-safe error handling
        return null;
    }

    if (isSuccessResponse(response)) {
        return response.data ? transformer(response.data) : null;
    }

    return null;  // Loading state
}
```

**What makes it senior:**
- ✅ Type-safe at every step
- ✅ Handles all cases explicitly
- ✅ Flexible (custom error handler)
- ✅ Uses advanced TypeScript features correctly
- ✅ Self-documenting (types tell the story)

---

**Amazing work!** You've now mastered advanced utility types AND type-safe error handling patterns. This bonus section covered concepts that many TypeScript developers don't fully understand. You're ready for Exercise 12! 🔥

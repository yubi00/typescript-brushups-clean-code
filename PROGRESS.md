# TypeScript & Refactoring Learning Progress

## 🎯 Goal
Prepare for technical assessment focused on TypeScript refactoring

---

## Phase 1: TypeScript Fundamentals (Days 1-2)
**Status: ✅ COMPLETED**

- [x] **Exercise 1:** Basic Types & Function Signatures ✅
  - Basic primitive types (string, number, boolean)
  - Creating interfaces for object shapes
  - Function parameter types and return types
  - File: `exercise-01.ts`

- [x] **Exercise 2:** Arrays, Tuples, Union Types & Literal Types ✅
  - Array types (number[], Array<number>)
  - Union types (string | number)
  - Tuple types [string, number, boolean]
  - Literal types ("pending" | "approved" | "rejected")
  - Nullable types (Type | null)
  - File: `exercise-02.ts`

- [x] **Exercise 3:** Optional Properties, Readonly & Type Aliases ✅
  - Type aliases (type ID = number | string)
  - Optional properties (property?: type)
  - Readonly properties
  - Index signatures ([key: string]: type)
  - Utility types: Partial<T>, Record<K, V>
  - File: `exercise-03.ts`

- [x] **Exercise 4:** Generics ✅
  - Generic functions <T>
  - Generic interfaces
  - Generic constraints (extends)
  - Multiple type parameters
  - Generic classes
  - File: `exercise-04.ts`

- [x] **Exercise 5:** Phase 1 Recap - CLI Task Manager ✅
  - Combined all Phase 1 concepts into a real-world application
  - Task management system with CRUD operations
  - Type-safe filtering and grouping functions
  - Generic utility functions (filterArray, groupBy, findById)
  - Understanding Partial, Pick, Omit, Required utility types
  - File: `exercise-05-recap.ts`

---

## Phase 2: Object-Oriented Programming in TypeScript (Days 3-4)
**Status: ✅ COMPLETED** (Exercise 10 skipped)

- [x] **Exercise 6:** Classes - The Basics ✅
  - Class syntax and constructors
  - Properties and methods
  - Access modifiers (public, private, protected)
  - readonly modifier
  - Static properties and methods
  - Parameter properties shorthand
  - Encapsulation (hiding sensitive data)
  - File: `exercise-06.ts`

- [x] **Exercise 7:** Inheritance & Extending Classes ✅
  - Extending classes (extends keyword)
  - Method overriding
  - Super keyword (constructor and methods)
  - Protected members in inheritance
  - Multi-level inheritance
  - File: `exercise-07.ts`

- [x] **Exercise 8:** Abstract Classes & Interfaces ✅
  - Abstract classes and abstract methods
  - When to use abstract vs concrete classes
  - Interfaces as contracts (implements keyword)
  - Implementing multiple interfaces
  - Interface vs Type Alias for object shapes
  - Abstract class implementing interface (combo pattern)
  - Type assertions with `as` keyword
  - Polymorphism with arrays
  - File: `exercise-08.ts`

- [x] **Exercise 9:** Advanced OOP Patterns ✅
  - Getters and setters (validation, computed values, unit conversion)
  - Encapsulation refactoring (public → private + getter/setter)
  - Method overloading (multiple signatures, one implementation)
  - Singleton pattern (private constructor + static getInstance)
  - Composition vs Inheritance (NotificationService with pluggable parts)
  - Observer pattern (onChange callbacks for ConfigManager)
  - Comprehensive ConfigManager (singleton + key-value store + listeners)
  - File: `exercise-09.ts`

- [ ] **Exercise 10:** OOP Recap - Build a System (SKIPPED - Moving directly to Intermediate TS)
  - Combine all OOP concepts
  - Real-world application with class hierarchy
  - File: `exercise-10-oop-recap.ts`

---

## Phase 3: Intermediate TypeScript (Days 5-6)
**Status: ✅ COMPLETED**

- [x] **Exercise 11:** Advanced Utility Types & Type Manipulation ✅ (+ BONUS)
  - Pick, Omit, Exclude, Extract
  - ReturnType, Parameters
  - Awaited, NonNullable
  - Custom utility types (Mutable, PartialBy, RequiredBy)
  - Mapped types with modifiers
  - Type intersections
  - Generic constraints with keyof
  - typeof for value-to-type conversion
  - **BONUS:** Extract/Exclude for status filtering
  - **BONUS:** Type guards with `is` predicates
  - **BONUS:** Type intersections for narrowing response types
  - **BONUS:** Handler objects pattern
  - File: `exercise-11.ts`

- [x] **Exercise 12:** Type Guards & Narrowing (Focused) ✅
  - typeof type guards (narrowing primitives)
  - instanceof type guards (narrowing class hierarchies)
  - Discriminated unions (THE refactoring pattern)
  - Exhaustiveness checking with `never` (compile-time safety net)
  - Comprehensive challenge: refactor messy optionals → discriminated union
  - File: `exercise-12.ts`

- [ ] **Exercise 13:** Mapped Types & Conditional Types (SKIPPED - already covered mapped types in Ex 11)

- [ ] **Exercise 14:** Function Overloads & Advanced Patterns (SKIPPED - already covered overloads in Ex 9)

---

## Phase 4: Advanced TypeScript (Days 7-8)
**Status: ⏭️ SKIPPED** (Not needed for refactoring assessment - going straight to Clean Code after Intermediate TS)

- [ ] **Exercise 15:** Advanced Mapped & Conditional Types
  - Complex mapped types
  - Recursive conditional types
  - Type-level programming patterns

- [ ] **Exercise 16:** Brand Types & Type Safety
  - Nominal typing patterns
  - Brand/opaque types
  - Type predicates for validation

- [ ] **Exercise 17:** Module Patterns & Declaration Merging
  - Module augmentation
  - Declaration merging
  - Namespace patterns

---

## Phase 5: Clean Code & Refactoring (Days 9-12)
**Status: 🔥 IN PROGRESS**

- [x] **Exercise 13:** SOLID Principles (Practical Refactoring) ✅
  - SRP: Refactor god class → focused classes (PasswordValidator, EmailService, UserService)
  - OCP: Refactor instanceof chains → polymorphism (abstract Shape + Pentagon extension)
  - LSP: Fix broken inheritance hierarchy (peers, not parent-child + immutability)
  - ISP: Refactor fat interface → small focused interfaces (Printer, Scanner, Faxer, Stapler)
  - DIP: Refactor hardcoded dependencies → injection (NotificationChannel interface)
  - BONUS: Combined SOLID refactoring (PaymentProcessor + OrderNotifier + OrderService)
  - File: `exercise-13.ts`

- [x] **Exercise 14:** Clean Functions & Refactoring Patterns ✅
  - Extract Method: Break down long functions into focused helpers
  - Naming & Magic Numbers: Named constants (UPPER_SNAKE_CASE) + meaningful names
  - Guard Clauses: Early returns to flatten nested conditionals
  - Encapsulate Conditionals: Extract complex booleans into named functions
  - Remove Duplicate Code: Shared calculateStats helper (DRY)
  - Parameter Objects: Options interface with destructured defaults
  - BONUS: Replace Conditionals with Polymorphism (ShippingMethod interface)
  - File: `exercise-14.ts`

- [ ] **Exercise 15:** Comprehensive Refactoring Challenge (Mock Assessment) 🔥 NEXT
  - Realistic "messy" order processing system
  - Combines ALL code smells: god function, magic numbers, poor naming, nested ifs, duplicates
  - Refactor applying all learned principles
  - File: `exercise-15.ts`

---

## Phase 7: Mock Interview Scenarios (Days 14-16)
**Status: 🔒 LOCKED**

- [ ] **Scenario 1:** API Client Refactoring (30 min)
- [ ] **Scenario 2:** React Component Cleanup (30 min)
- [ ] **Scenario 3:** Business Logic Extraction (45 min)
- [ ] **Scenario 4:** Error Handling Improvements (30 min)
- [ ] **Scenario 5:** Legacy Code Modernization (45 min)

---

## Phase 8: React + TypeScript Project (Future)
**Status: 🔒 LOCKED**

- [ ] Revise modern React best practices (functional components, hooks)
- [ ] React hooks deep dive (useState, useEffect, useContext, custom hooks)
- [ ] Set up project: Vite + React + TypeScript
- [ ] Build: Australian Citizenship Test Quiz App
  - User provides quiz data
  - Apply all TS + Clean Code skills learned
  - Real-world project combining everything

---

## 📊 Overall Progress

**Completed:** 13 / 15 exercises (87%) ✅
**Current Phase:** Phase 5 (Clean Code & Refactoring) - Exercise 15 (Mock Assessment) 🔥
**Days Elapsed:** 8-9
**Note:** Phases 1-3 FULLY COMPLETED! Skipping Phase 4 (Advanced TS). SOLID + Clean Functions mastered! One exercise left: the comprehensive mock assessment!

---

## 🎓 Skills Acquired So Far

### Phase 1: TypeScript Fundamentals
✅ Basic TypeScript type annotations
✅ Interfaces and type aliases
✅ Union and literal types
✅ Tuples and arrays
✅ Optional and readonly properties
✅ Utility types (Partial, Pick, Omit, Required, Record)
✅ Generics (functions, interfaces, constraints, classes)
✅ keyof operator and indexed access types
✅ Generic constraints with extends
✅ Building type-safe CRUD applications
✅ Understanding how Partial makes all properties optional
✅ Combining utility types (Partial<Omit<T, K>>)

### Phase 2: OOP Fundamentals (COMPLETED ✅)
✅ Class syntax and constructors
✅ Access modifiers (public, private, protected)
✅ readonly modifier in classes
✅ Static properties and methods (shared across instances)
✅ Parameter properties shorthand
✅ Encapsulation and data hiding
✅ Interface vs type for object shapes
✅ Inheritance with extends keyword
✅ Method overriding (complete replacement vs extension with super)
✅ Multi-level inheritance (grandparent → parent → child)
✅ Protected members in inheritance context
✅ Abstract classes (cannot instantiate, only extend)
✅ Abstract methods (force children to implement)
✅ Interfaces as contracts (implements keyword)
✅ Multiple interface implementation (composition)
✅ Abstract class implementing interface (combo pattern)
✅ Polymorphism (parent type holds children, runtime method resolution)
✅ Type assertions with `as` keyword
✅ Getters & setters (validation, computed values, unit conversion)
✅ Constructor validation (route through setter, don't bypass!)
✅ Method overloading (overload signatures + implementation signature)
✅ Singleton pattern (private constructor + static getInstance)
✅ Composition over inheritance (pluggable interfaces, no class explosion)
✅ Observer pattern (onChange callbacks, listener registration)
✅ Key-value store pattern (Record<string, T>, get/set/has/delete/load)
✅ Defensive copies (spread operator to prevent external mutation)

### Phase 3: Intermediate TypeScript (COMPLETED ✅)
✅ Pick<T, K> - selecting specific properties
✅ Omit<T, K> - excluding specific properties
✅ Exclude<T, U> - removing from unions
✅ Extract<T, U> - filtering unions
✅ ReturnType<T> - extracting function return types
✅ Parameters<T> - extracting function parameters as tuple
✅ Awaited<T> - unwrapping Promise types
✅ NonNullable<T> - removing null/undefined
✅ Mapped types with modifiers (-readonly, -?)
✅ Type intersections (&) for combining types
✅ Generic constraints with keyof
✅ typeof for value-to-type conversion
✅ Type narrowing with control flow analysis
✅ Custom utility types (Mutable, PartialBy, RequiredBy)
✅ Spread operator with type safety
✅ Rest parameters with tuple types
✅ Generic transformer functions
✅ Type guards with `is` predicates (runtime type narrowing)
✅ Extract/Exclude for status-based type filtering
✅ Type intersections for narrowing response types
✅ Handler objects pattern for flexible callbacks
✅ Optional function parameters
✅ typeof type guards (narrowing primitives)
✅ instanceof type guards (narrowing class hierarchies)
✅ Discriminated unions (shared literal discriminant property)
✅ Exhaustiveness checking with `never` (compile-time safety net)
✅ Refactoring pattern: messy optionals → clean discriminated union

### Phase 5: Clean Code & Refactoring
✅ SRP: Splitting god classes into focused classes (one reason to change)
✅ OCP: Abstract classes/interfaces for extension without modification
✅ LSP: Fixing broken hierarchies (peers, not parent-child; immutability)
✅ ISP: Splitting fat interfaces into focused capability interfaces
✅ DIP: Constructor injection, depending on abstractions not concretions
✅ Composition pattern: high-level class receives helpers via constructor
✅ Validation return pattern: string | null (null = valid)
✅ Multiple interface implementation (implements A, B, C)
✅ Combined SOLID: SRP + OCP + DIP applied together in one refactoring
✅ Extract Method: breaking long functions into focused helpers
✅ Named constants: UPPER_SNAKE_CASE for magic numbers
✅ Guard clauses: early returns to flatten nested conditionals
✅ Encapsulate conditionals: complex booleans → named functions/variables
✅ DRY: extracting shared logic into reusable helpers
✅ Parameter object pattern: options interface with destructured defaults
✅ Replace conditionals with polymorphism: switch → class hierarchy
✅ catch clause typing: only `any` or `unknown` allowed, narrow with instanceof

---

## 📝 Notes

- Learning by doing (examples-first approach)
- Using modern ES modules (ESNext)
- Running exercises with `tsx` for fast iteration
- Focus on production-level code patterns
- Critical thinking about type choices (e.g., ID type discussion)

---

**Last Updated:** Exercise 14 COMPLETED (all 5 parts + BONUS)! ✅ Clean Functions & Refactoring Patterns mastered. Progress: 87% (13/15). Next up: Exercise 15: Comprehensive Refactoring Challenge (Mock Assessment)! 🔥

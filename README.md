# TypeScript Refactoring Practice

A structured set of exercises for learning TypeScript and clean code refactoring patterns, built while preparing for a technical assessment.

## Purpose

This repo exists to build fluency in:
- TypeScript fundamentals (types, generics, utility types, OOP)
- Identifying and fixing common code smells
- Applying clean code principles: SOLID, guard clauses, pure functions, immutability, error handling

Each exercise has a **messy version** (working but problematic code) and a **refactored version** written below it, so you can see exactly what changed and why.

## How to Run

```bash
# Using npm scripts (recommended)
npm run ex1
npm run ex19
# ... ex1 through ex19

# Or directly with tsx
npx tsx exercise-01.ts
```

## Exercises

| File | Topic |
|---|---|
| exercise-01.ts | Basic Types & Function Signatures |
| exercise-02.ts | Arrays, Unions, Tuples, Literals |
| exercise-03.ts | Optional, Readonly, Type Aliases, Utility Types |
| exercise-04.ts | Generics |
| exercise-05-recap.ts | Phase 1 Recap — CLI Task Manager |
| exercise-06.ts | Classes Basics |
| exercise-07.ts | Inheritance & Extending Classes |
| exercise-08.ts | Abstract Classes & Interfaces |
| exercise-09.ts | Advanced OOP (getters/setters, singleton, composition, observer) |
| exercise-11.ts | Advanced Utility Types |
| exercise-12.ts | Type Guards & Narrowing (discriminated unions, exhaustiveness) |
| exercise-13.ts | SOLID Principles |
| exercise-14.ts | Clean Functions & Refactoring Patterns |
| exercise-15.ts | Comprehensive Refactoring Challenge — Food Delivery System |
| exercise-16.ts | Error Handling Patterns — Result<T, E> type |
| exercise-17.ts | Immutability & Side Effects — pure functions, readonly, as const |
| exercise-18.ts | OOP Refactoring — god class, SRP, interfaces, private/readonly, DIP |
| exercise-19.ts | Final Mock Assessment — Subscription Billing System (combines all) |

## Reference

- `CLEAN_CODE_TS.md` — comprehensive clean code guide used throughout the exercises, based on [clean-code-typescript](https://github.com/labs42io/clean-code-typescript)

- `PROGRESS.md` — detailed progress tracking and skills acquired

## Setup

```bash
npm install
```

Requires Node.js. Uses `tsx` for running TypeScript directly without a build step.

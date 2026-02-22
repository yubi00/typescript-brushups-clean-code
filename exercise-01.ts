// EXERCISE 1: Basic Types & Function Signatures
// Status: ✅ COMPLETED
//
// Learning objectives:
// - Basic primitive types (string, number, boolean)
// - Creating interfaces for object shapes
// - Function parameter types
// - Function return types
// - Type annotations for variables

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    isActive: boolean;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 28,
  isActive: true
};

function getUserById(id: number): User {
  // Pretend this fetches from DB
  return {
    id: id,
    name: "Bob",
    email: "bob@example.com",
    age: 30,
    isActive: false
  };
}

function calculateDiscount(price: number, discountPercent: number): number {
  return price - (price * discountPercent / 100);
}

function formatUserInfo(user: User): string {
  return `${user.name} (${user.email})`;
}

// Test your code
console.log(getUserById(1));
console.log(calculateDiscount(100, 10));
console.log(formatUserInfo(user));

export {};

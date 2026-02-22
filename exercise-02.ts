// EXERCISE 2: Arrays, Tuples, Union Types & Literal Types
// Status: ✅ COMPLETED
//
// Learning objectives:
// - Array types (number[], Array<number>)
// - Union types (string | number)
// - Tuple types [string, number, boolean]
// - Literal types ("pending" | "approved" | "rejected")
// - Nullable types (Type | null)
// - Creating interfaces for complex objects

// TODO: Type this array of numbers
const scores: number[] = [95, 87, 92, 100, 88];

// TODO: Type this array of user IDs (can be number or string)
const userIds: (number | string)[] = [1, "abc123", 42, "xyz789"];

// TODO: This should be a tuple [name, age, isAdmin]
const adminUser: [string, number, boolean] = ["John", 35, true];

interface Order {
  orderId: number;
  status: "pending" | "approved" | "rejected";
}
// TODO: Add types - status can only be "pending", "approved", or "rejected"
function updateOrderStatus(orderId: number, status: "pending" | "approved" | "rejected"): Order {
  console.log(`Order ${orderId} is now ${status}`);
  return { orderId, status };
}

// TODO: Add types - this function can return a User object OR null
function findUserByEmail(email: string): { id: number; name: string; email: string } | null {
  if (email === "admin@example.com") {
    return { id: 1, name: "Admin", email: email };
  }
  return null;
}

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}
// TODO: Add types to this product catalog
const products: Product[] = [
  { id: 1, name: "Laptop", price: 999.99, inStock: true },
  { id: 2, name: "Mouse", price: 29.99, inStock: false },
  { id: 3, name: "Keyboard", price: 79.99, inStock: true }
];

// TODO: Add types - accepts array of numbers, returns their sum
function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Test your code
console.log(scores);
console.log(userIds);
console.log(adminUser);
console.log(updateOrderStatus(123, "approved"));
console.log(findUserByEmail("admin@example.com"));
console.log(findUserByEmail("notfound@example.com"));
console.log(products);
console.log(sum([1, 2, 3, 4, 5]));

export {};

// EXERCISE 4: Generics - Reusable Type-Safe Code
// Status: ✅ COMPLETED
//
// Learning objectives:
// - Generic functions <T>
// - Generic interfaces
// - Generic constraints (extends)
// - Multiple type parameters
// - Real-world generic patterns (API responses, data structures)

// TODO: Make this function generic so it works with any type
// Currently only works with numbers, but should work with strings, objects, etc.
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

// TODO: Create a generic interface for API responses
// Should work for any data type: User, Product, Order, etc.
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// TODO: Make this function generic - should work with any object type
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// TODO: Create a generic interface for a key-value pair
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

// TODO: Add generics - should only accept objects that have an 'id' property
function findById<T extends { id: number }>(items: T[], id: T['id']): T | undefined {
  return items.find(item => item.id === id);
}

// TODO: Create a generic type for a function that transforms one type to another
type Mapper<T, U> = (item: T) => U;

// Example usage - transforms number to string
const numberToString = (n: number): string => n.toString();

// TODO: Create a generic Promise wrapper
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as T;
}

// TODO: Make this generic Stack class work with any type
class Stack<T> {
  private items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Test your code
const numbers = [1, 2, 3, 4, 5];
const strings = ["a", "b", "c"];
console.log("First number:", getFirstElement(numbers));
console.log("First string:", getFirstElement(strings));

const user = { id: 1, name: "Alice", age: 30 };
console.log("User name:", getProperty(user, "name"));
console.log("User age:", getProperty(user, "age"));

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];
console.log("Found user:", findById(users, 2));

console.log("Number to string:", numberToString(42));

const numberStack = new Stack();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);
console.log("Stack peek:", numberStack.peek());
console.log("Stack pop:", numberStack.pop());
console.log("Stack peek after pop:", numberStack.peek());

const stringStack = new Stack();
stringStack.push("hello");
stringStack.push("world");
console.log("String stack peek:", stringStack.peek());

export {};

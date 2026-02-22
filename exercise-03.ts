// EXERCISE 3: Optional Properties, Readonly, Type Aliases & Index Signatures
// Status: ✅ COMPLETED
//
// Learning objectives:
// - Type aliases (type ID = number | string)
// - Optional properties (property?: type)
// - Readonly properties (readonly keyword)
// - Index signatures ([key: string]: type)
// - Partial<T> utility type (makes all properties optional)
// - Readonly<T> utility type (makes all properties readonly)

// TODO: Create a type alias for ID (can be number or string)
type ID = number | string;

// TODO: Create an interface where middleName and phoneNumber are OPTIONAL
// interface Person {
//   id: ???
//   firstName: ???
//   middleName: ??? // optional
//   lastName: ???
//   phoneNumber: ??? // optional
// }

interface Person {
  id: ID;
  firstName: string;
  middleName?: string; // optional
  lastName: string;
  phoneNumber?: string; // optional
}

// TODO: Add types using your Person interface
function createPerson(firstName: string, lastName: string, middleName?: string): Person {
  return {
    id: Math.random(),
    firstName,
    lastName,
    middleName,
    phoneNumber: undefined
  };
}

// TODO: Create a readonly Config interface - properties should NOT be modifiable after creation
// interface Config {
//   apiUrl: ???
//   timeout: ???
//   retries: ???
// }

interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retries: number;
}

const appConfig: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};

// TODO: Add types - this should prevent modifications
function updateConfig(config: Config): Config {
  // This should cause a TypeScript error (uncomment to test):
  // config.apiUrl = "https://hacker.com";
  return config;
}

// TODO: Create a type for a dictionary/map with string keys and number values
// Example: { "apple": 5, "banana": 3, "orange": 7 }
// type Inventory = ???

type Inventory = Record<string, number>;

const storeInventory: Inventory = {
  laptop: 10,
  mouse: 50,
  keyboard: 30
};

// TODO: Add types - accepts an Inventory, returns total count
function getTotalItems(inventory: Inventory): number {
  return Object.values(inventory).reduce((sum, count) => sum + count, 0);
}

// TODO: Add types using Partial utility type (all properties become optional)
function updatePerson(person: Person, updates: Partial<Person>): Person {
  return { ...person, ...updates };
}

// Test your code
const person1 = createPerson("John", "Doe", "Michael");
const person2 = createPerson("Jane", "Smith", undefined);

console.log(person1);
console.log(person2);
console.log(appConfig);
console.log(updateConfig(appConfig));
console.log(storeInventory);
console.log(getTotalItems(storeInventory));
console.log(updatePerson(person1, { firstName: "Johnny" }));
console.log(updatePerson(person2, { phoneNumber: "555-1234" }));

export {};

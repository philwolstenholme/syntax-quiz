// Level 1 - Easy: Basic syntax concepts that beginners should know
export const level1Questions = [
  {
    code: `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`,
    highlight: { start: 15, end: 19 },
    question: "What is the highlighted part called?",
    correct: "parameter",
    options: ["parameter", "argument", "property", "variable"]
  },
  {
    code: `function greet(name: string) {
  return \`Hello, \${name}!\`;
}
greet('Alice');`,
    highlight: { start: 66, end: 73 },
    question: "What is the highlighted part called?",
    correct: "argument",
    options: ["argument", "parameter", "property", "value"]
  },
  {
    code: `function calculate(a: number, b: number) {
  return a + b;
}`,
    highlight: { start: 43, end: 60 },
    question: "What is the highlighted part called?",
    correct: "function body",
    options: ["function body", "code block", "statement", "expression"]
  },
  {
    code: `const numbers = [1, 2, 3, 4, 5];`,
    highlight: { start: 16, end: 31 },
    question: "What are these symbols called?",
    correct: "square brackets",
    options: ["square brackets", "curly braces", "parentheses", "angle brackets"]
  },
  {
    code: `const person = { name: 'Alice', age: 30 };`,
    highlight: { start: 15, end: 41 },
    question: "What are these symbols called?",
    correct: "curly braces",
    options: ["curly braces", "square brackets", "parentheses", "angle brackets"]
  },
  {
    code: `function add(a: number, b: number): number {
  return a + b;
}`,
    highlight: { start: 12, end: 34 },
    question: "What are these symbols called?",
    correct: "parentheses",
    options: ["parentheses", "curly braces", "square brackets", "angle brackets"]
  },
  {
    code: `interface User {
  name: string;
  age: number;
}`,
    highlight: { start: 19, end: 32 },
    question: "What is the highlighted part called?",
    correct: "property",
    options: ["property", "field", "attribute", "member"]
  },
  {
    code: `const fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]);`,
    highlight: { start: 64, end: 67 },
    question: "What is the highlighted part called?",
    correct: "index",
    options: ["index", "key", "position", "offset"]
  },
  {
    code: `const add = (a, b) => a + b;`,
    highlight: { start: 12, end: 27 },
    question: "What is this syntax called?",
    correct: "arrow function",
    options: ["arrow function", "lambda", "anonymous function", "inline function"]
  },
  {
    code: `async function fetchData() {
  const data = await api.get('/users');
  return data;
}`,
    highlight: { start: 44, end: 49 },
    question: "What is this keyword called?",
    correct: "await",
    options: ["await", "async", "promise", "defer"]
  },
  {
    code: `const point = { x: 10, y: 20 };`,
    highlight: { start: 14, end: 30 },
    question: "What is this syntax called?",
    correct: "object literal",
    options: ["object literal", "object notation", "hash", "dictionary"]
  },
  {
    code: `const doubled = numbers.map(n => n * 2);`,
    highlight: { start: 28, end: 38 },
    question: "What is the function passed to map called?",
    correct: "callback",
    options: ["callback", "lambda", "handler", "delegate"]
  }
];

// Level 2 - Medium: Intermediate TypeScript/JavaScript concepts
export const level2Questions = [
  {
    code: `const numbers: Array<number> = [1, 2, 3];`,
    highlight: { start: 15, end: 28 },
    question: "What is the highlighted part called?",
    correct: "generic",
    options: ["generic", "type parameter", "template", "type annotation"]
  },
  {
    code: `type Status = 'active' | 'inactive' | 'pending';`,
    highlight: { start: 14, end: 47 },
    question: "What is the highlighted part called?",
    correct: "union type",
    options: ["union type", "intersection type", "literal type", "enum"]
  },
  {
    code: `function getName(): string {
  return 'Alice';
}`,
    highlight: { start: 18, end: 26 },
    question: "What is the highlighted part called?",
    correct: "return type",
    options: ["return type", "type annotation", "type hint", "output type"]
  },
  {
    code: `const user = { name: 'Alice', age: 30, city: 'NYC' };
const { name, age } = user;`,
    highlight: { start: 60, end: 73 },
    question: "What is this syntax called?",
    correct: "destructuring",
    options: ["destructuring", "unpacking", "pattern matching", "extraction"]
  },
  {
    code: `const oldArr = [1, 2, 3];
const newArr = [...oldArr, 4, 5];`,
    highlight: { start: 41, end: 44 },
    question: "What is this operator called?",
    correct: "spread operator",
    options: ["spread operator", "rest operator", "destructuring", "expansion"]
  },
  {
    code: `const isActive = true;
const message = isActive ? 'yes' : 'no';`,
    highlight: { start: 39, end: 62 },
    question: "What is this operator called?",
    correct: "ternary operator",
    options: ["ternary operator", "conditional operator", "inline if", "expression"]
  },
  {
    code: `const user = { profile: { name: 'Alice' } };
const name = user?.profile?.name;`,
    highlight: { start: 62, end: 64 },
    question: "What is this operator called?",
    correct: "optional chaining",
    options: ["optional chaining", "safe navigation", "null check", "elvis operator"]
  },
  {
    code: `function getValue(input?: string) {
  return input ?? 'default';
}`,
    highlight: { start: 51, end: 53 },
    question: "What is this operator called?",
    correct: "nullish coalescing",
    options: ["nullish coalescing", "default operator", "fallback operator", "or operator"]
  },
  {
    code: `class Dog extends Animal {
  bark() {
    console.log('Woof!');
  }
}`,
    highlight: { start: 10, end: 24 },
    question: "What does this represent?",
    correct: "inheritance",
    options: ["inheritance", "extension", "composition", "implementation"]
  },
  {
    code: `interface Point {
  readonly x: number;
  readonly y: number;
}`,
    highlight: { start: 20, end: 28 },
    question: "What is the highlighted part called?",
    correct: "readonly",
    options: ["readonly", "immutable", "const", "final"]
  },
  {
    code: `type ID = string | number;`,
    highlight: { start: 0, end: 25 },
    question: "What is this declaration called?",
    correct: "type alias",
    options: ["type alias", "type definition", "typedef", "interface"]
  },
  {
    code: `function log(message: string): void {
  console.log(message);
}`,
    highlight: { start: 31, end: 35 },
    question: "What does this type represent?",
    correct: "void",
    options: ["void", "null", "undefined", "empty"]
  },
  {
    code: `type Coordinates = [number, number];`,
    highlight: { start: 19, end: 35 },
    question: "What is this type called?",
    correct: "tuple",
    options: ["tuple", "array", "pair", "vector"]
  },
  {
    code: `enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}`,
    highlight: { start: 0, end: 11 },
    question: "What is this declaration called?",
    correct: "enum",
    options: ["enum", "enumeration", "constant", "type"]
  }
];

// Level 3 - Hard: Advanced TypeScript concepts
export const level3Questions = [
  {
    code: `const value: unknown = getValue();
const str = value as string;`,
    highlight: { start: 47, end: 62 },
    question: "What is this syntax called?",
    correct: "type assertion",
    options: ["type assertion", "type cast", "type conversion", "type coercion"]
  },
  {
    code: `type Keys = keyof User;`,
    highlight: { start: 12, end: 17 },
    question: "What is this operator called?",
    correct: "keyof",
    options: ["keyof", "typeof", "instanceof", "keys"]
  },
  {
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}`,
    highlight: { start: 35, end: 50 },
    question: "What is this syntax called?",
    correct: "type guard",
    options: ["type guard", "type predicate", "type check", "type assertion"]
  },
  {
    code: `class User {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }
}`,
    highlight: { start: 15, end: 22 },
    question: "What is this keyword called?",
    correct: "access modifier",
    options: ["access modifier", "visibility", "scope", "qualifier"]
  },
  {
    code: `abstract class Shape {
  abstract area(): number;
}`,
    highlight: { start: 0, end: 21 },
    question: "What is this type of class called?",
    correct: "abstract class",
    options: ["abstract class", "base class", "interface", "virtual class"]
  },
  {
    code: `interface StringMap {
  [key: string]: any;
}`,
    highlight: { start: 23, end: 41 },
    question: "What is this syntax called?",
    correct: "index signature",
    options: ["index signature", "indexer", "dynamic property", "computed property"]
  },
  {
    code: `type IsString<T> = T extends string ? T : never;`,
    highlight: { start: 19, end: 48 },
    question: "What is this type called?",
    correct: "conditional type",
    options: ["conditional type", "ternary type", "generic constraint", "mapped type"]
  },
  {
    code: `const colors = ['red', 'green', 'blue'] as const;`,
    highlight: { start: 40, end: 48 },
    question: "What is this assertion called?",
    correct: "as const",
    options: ["as const", "readonly", "immutable", "const assertion"]
  },
  {
    code: `export default class App {
  render() {
    return <div>Hello</div>;
  }
}`,
    highlight: { start: 0, end: 14 },
    question: "What is this type of export called?",
    correct: "default export",
    options: ["default export", "primary export", "main export", "single export"]
  },
  {
    code: `export const API_URL = 'https://api.example.com';
export function fetchData() { }`,
    highlight: { start: 0, end: 6 },
    question: "What is this type of export called?",
    correct: "named export",
    options: ["named export", "explicit export", "public export", "module export"]
  }
];

// Combined questions for backwards compatibility
export const questions = [...level1Questions, ...level2Questions, ...level3Questions];

// Level metadata
export const levels = [
  {
    id: 1,
    name: "Level 1",
    subtitle: "Easy",
    description: "Basic syntax fundamentals",
    questions: level1Questions,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 2,
    name: "Level 2",
    subtitle: "Medium",
    description: "Intermediate concepts",
    questions: level2Questions,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 3,
    name: "Level 3",
    subtitle: "Hard",
    description: "Advanced TypeScript",
    questions: level3Questions,
    color: "from-red-500 to-pink-500"
  }
];

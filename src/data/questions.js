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
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: { start: 17, end: 34 },
    question: "What is this string syntax called?",
    correct: "template literal",
    options: ["template literal", "string literal", "format string", "interpolated string"]
  },
  {
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: { start: 25, end: 33 },
    question: "What is the highlighted syntax called?",
    correct: "string interpolation",
    options: ["string interpolation", "variable injection", "placeholder", "expression slot"]
  },
  {
    code: `import { useState } from 'react';`,
    highlight: { start: 9, end: 17 },
    question: "What is being imported here?",
    correct: "named import",
    options: ["named import", "default import", "namespace import", "side effect import"]
  },
  {
    code: `const doubled = numbers
  .filter(n => n > 0)
  .map(n => n * 2);`,
    highlight: { start: 26, end: 64 },
    question: "What is this programming pattern called?",
    correct: "method chaining",
    options: ["method chaining", "pipeline", "fluent interface", "cascade"]
  },
  {
    code: `function greet(name = 'World') {
  return \`Hello, \${name}!\`;
}`,
    highlight: { start: 15, end: 29 },
    question: "What is this parameter syntax called?",
    correct: "default parameter",
    options: ["default parameter", "optional parameter", "fallback parameter", "preset parameter"]
  },
  {
    code: `function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}`,
    highlight: { start: 13, end: 23 },
    question: "What is this parameter syntax called?",
    correct: "rest parameter",
    options: ["rest parameter", "spread parameter", "variadic parameter", "collect parameter"]
  },
  {
    code: `const element = <h1>Hello World</h1>;`,
    highlight: { start: 16, end: 36 },
    question: "What is this syntax called?",
    correct: "JSX",
    options: ["JSX", "HTML", "XML", "template"]
  },
  {
    code: `const colors = ['red', 'green', 'blue'];
const last = colors.pop();`,
    highlight: { start: 54, end: 66 },
    question: "What does this method do?",
    correct: "removes the last element",
    options: ["removes the last element", "adds an element", "returns the length", "finds an element"]
  },
  {
    code: `const numbers = [1, 2, 3];
numbers.push(4);`,
    highlight: { start: 27, end: 42 },
    question: "What does this method do?",
    correct: "adds to the end",
    options: ["adds to the end", "adds to the start", "removes from end", "removes from start"]
  },
  {
    code: `const text = 'hello world';
const upper = text.toUpperCase();`,
    highlight: { start: 42, end: 60 },
    question: "What type of method is this?",
    correct: "string method",
    options: ["string method", "array method", "object method", "number method"]
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
    highlight: { start: 41, end: 60 },
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
    highlight: { start: 19, end: 31 },
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
    code: `type ID = string | number;`,
    highlight: { start: 0, end: 25 },
    question: "What is this declaration called?",
    correct: "type alias",
    options: ["type alias", "type definition", "typedef", "interface"]
  },
  {
    code: `type Coordinates = [number, number];`,
    highlight: { start: 19, end: 35 },
    question: "What is this type called?",
    correct: "tuple",
    options: ["tuple", "array", "pair", "vector"]
  },
  {
    code: `function outer() {
  const x = 10;
  return function inner() {
    return x;
  };
}`,
    highlight: { start: 0, end: 75 },
    question: "What JavaScript concept is demonstrated here?",
    correct: "closure",
    options: ["closure", "scope", "hoisting", "recursion"]
  },
  {
    code: `console.log(x);
var x = 5;`,
    highlight: { start: 0, end: 26 },
    question: "What JavaScript behavior causes x to be undefined here?",
    correct: "hoisting",
    options: ["hoisting", "closure", "scoping", "coercion"]
  },
  {
    code: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done'), 1000);
});`,
    highlight: { start: 16, end: 93 },
    question: "What is this object called?",
    correct: "Promise",
    options: ["Promise", "Future", "Deferred", "Observable"]
  },
  {
    code: `const double = (x) => x * 2;
const numbers = [1, 2, 3].map(double);`,
    highlight: { start: 0, end: 27 },
    question: "What type of function is this?",
    correct: "pure function",
    options: ["pure function", "impure function", "side effect", "closure"]
  },
  {
    code: `const nums = [1, 2, 3].map(n => n * 2);`,
    highlight: { start: 13, end: 38 },
    question: "What does map() return?",
    correct: "new array",
    options: ["new array", "modified array", "undefined", "boolean"]
  },
  {
    code: `const found = [1, 2, 3, 4].find(n => n > 2);`,
    highlight: { start: 14, end: 43 },
    question: "What does find() return?",
    correct: "first matching element",
    options: ["first matching element", "all matches", "boolean", "index"]
  },
  {
    code: `const hasEven = [1, 2, 3].some(n => n % 2 === 0);`,
    highlight: { start: 16, end: 48 },
    question: "What does some() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"]
  },
  {
    code: `const allPositive = [1, 2, 3].every(n => n > 0);`,
    highlight: { start: 20, end: 47 },
    question: "What does every() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"]
  },
  {
    code: `const sum = [1, 2, 3].reduce((acc, n) => acc + n, 0);`,
    highlight: { start: 12, end: 52 },
    question: "What array method accumulates values?",
    correct: "reduce",
    options: ["reduce", "accumulate", "fold", "aggregate"]
  },
  {
    code: `const [count, setCount] = useState(0);`,
    highlight: { start: 0, end: 37 },
    question: "What React feature is being used here?",
    correct: "hook",
    options: ["hook", "component", "prop", "context"]
  },
  {
    code: `useEffect(() => {
  document.title = 'Hello';
}, []);`,
    highlight: { start: 0, end: 50 },
    question: "What is this React hook used for?",
    correct: "side effects",
    options: ["side effects", "state management", "memoization", "context"]
  },
  {
    code: `useEffect(() => {
  fetchData();
}, [userId]);`,
    highlight: { start: 33, end: 41 },
    question: "What is this array called in useEffect?",
    correct: "dependency array",
    options: ["dependency array", "watch list", "trigger array", "effect list"]
  },
  {
    code: `function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}`,
    highlight: { start: 16, end: 38 },
    question: "What is this pattern called in React?",
    correct: "props destructuring",
    options: ["props destructuring", "parameter spread", "object unpacking", "property access"]
  },
  {
    code: `<button onClick={() => setCount(count + 1)}>
  Click me
</button>`,
    highlight: { start: 8, end: 43 },
    question: "What is this attribute called in React?",
    correct: "event handler",
    options: ["event handler", "callback prop", "action", "listener"]
  },
  {
    code: `{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}`,
    highlight: { start: 27, end: 41 },
    question: "What is this attribute used for in React?",
    correct: "list reconciliation",
    options: ["list reconciliation", "identification", "indexing", "sorting"]
  },
  {
    code: `type AdminUser = User & Admin;`,
    highlight: { start: 22, end: 23 },
    question: "What operator creates an intersection type?",
    correct: "ampersand",
    options: ["ampersand", "pipe", "plus", "asterisk"]
  },
  {
    code: `type StringOrNumber = string | number;`,
    highlight: { start: 29, end: 30 },
    question: "What operator creates a union type?",
    correct: "pipe",
    options: ["pipe", "ampersand", "or", "plus"]
  }
];

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
    highlight: { start: 24, end: 42 },
    question: "What is this syntax called?",
    correct: "index signature",
    options: ["index signature", "indexer", "dynamic property", "computed property"]
  },
  {
    code: `type IsString<T> = T extends string ? T : never;`,
    highlight: { start: 19, end: 47 },
    question: "What is this type called?",
    correct: "conditional type",
    options: ["conditional type", "ternary type", "generic constraint", "mapped type"]
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
  },
  {
    code: `type Partial<T> = {
  [P in keyof T]?: T[P];
};`,
    highlight: { start: 22, end: 43 },
    question: "What is this type called?",
    correct: "mapped type",
    options: ["mapped type", "conditional type", "indexed type", "generic type"]
  },
  {
    code: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;`,
    highlight: { start: 51, end: 58 },
    question: "What keyword extracts a type from a pattern?",
    correct: "infer",
    options: ["infer", "extract", "typeof", "keyof"]
  },
  {
    code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };`,
    highlight: { start: 19, end: 23 },
    question: "What property enables discriminated unions?",
    correct: "discriminant",
    options: ["discriminant", "tag", "identifier", "selector"]
  },
  {
    code: `function process<T extends { id: number }>(item: T) {
  return item.id;
}`,
    highlight: { start: 19, end: 41 },
    question: "What is this syntax called?",
    correct: "generic constraint",
    options: ["generic constraint", "type bound", "type limit", "interface requirement"]
  },
  {
    code: `type NonNullable<T> = T extends null | undefined ? never : T;`,
    highlight: { start: 49, end: 54 },
    question: "What type represents an impossible value?",
    correct: "never",
    options: ["never", "void", "null", "undefined"]
  },
  {
    code: `type EventNames = \`on\${Capitalize<string>}\`;`,
    highlight: { start: 18, end: 43 },
    question: "What is this type syntax called?",
    correct: "template literal type",
    options: ["template literal type", "string pattern type", "format type", "interpolated type"]
  },
  {
    code: `type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};`,
    highlight: { start: 0, end: 72 },
    question: "What kind of type is this?",
    correct: "recursive type",
    options: ["recursive type", "nested type", "deep type", "self-referential type"]
  },
  {
    code: `const theme = useContext(ThemeContext);`,
    highlight: { start: 14, end: 38 },
    question: "What React hook accesses context?",
    correct: "useContext",
    options: ["useContext", "useProvider", "useConsumer", "useTheme"]
  },
  {
    code: `const memoized = useMemo(() => compute(a, b), [a, b]);`,
    highlight: { start: 17, end: 53 },
    question: "What React hook memoizes computed values?",
    correct: "useMemo",
    options: ["useMemo", "useCallback", "useRef", "useEffect"]
  },
  {
    code: `const handler = useCallback(() => {
  onClick(id);
}, [onClick, id]);`,
    highlight: { start: 16, end: 66 },
    question: "What React hook memoizes functions?",
    correct: "useCallback",
    options: ["useCallback", "useMemo", "useHandler", "useFunction"]
  },
  {
    code: `const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();`,
    highlight: { start: 17, end: 47 },
    question: "What React hook creates a mutable reference?",
    correct: "useRef",
    options: ["useRef", "usePointer", "useHandle", "useMutable"]
  },
  {
    code: `type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};`,
    highlight: { start: 0, end: 55 },
    question: "What utility type selects specific properties?",
    correct: "Pick",
    options: ["Pick", "Select", "Extract", "Choose"]
  },
  {
    code: `type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;`,
    highlight: { start: 0, end: 64 },
    question: "What utility type removes specific properties?",
    correct: "Omit",
    options: ["Omit", "Exclude", "Remove", "Without"]
  },
  {
    code: `function useCustomHook(initialValue: number) {
  const [value, setValue] = useState(initialValue);
  return { value, increment: () => setValue(v => v + 1) };
}`,
    highlight: { start: 0, end: 154 },
    question: "What React pattern is this?",
    correct: "custom hook",
    options: ["custom hook", "higher-order component", "render prop", "compound component"]
  },
  {
    code: `type Awaited<T> = T extends Promise<infer U> ? U : T;`,
    highlight: { start: 0, end: 52 },
    question: "What utility type unwraps Promises?",
    correct: "Awaited",
    options: ["Awaited", "Unwrap", "Resolve", "PromiseResult"]
  }
];

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

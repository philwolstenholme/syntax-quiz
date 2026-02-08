export interface Highlight {
  start: number;
  end: number;
}

export interface Question {
  code: string;
  highlight: Highlight;
  question: string;
  correct: string;
  options: string[];
  hint: string;
}

export interface Level {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  questions: Question[];
  color: string;
}

export const level1Questions: Question[] = [
  {
    code: `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`,
    highlight: { start: 15, end: 19 },
    question: "What is the highlighted part called?",
    correct: "parameter",
    options: ["parameter", "argument", "property", "variable"],
    hint: "This appears in the function declaration, not at the call site."
  },
  {
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: { start: 17, end: 34 },
    question: "What is this string syntax called?",
    correct: "template literal",
    options: ["template literal", "string literal", "format string", "interpolated string"],
    hint: "It uses backticks instead of quotes."
  },
  {
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: { start: 25, end: 33 },
    question: "What is the highlighted syntax called?",
    correct: "string interpolation",
    options: ["string interpolation", "variable injection", "placeholder", "expression slot"],
    hint: "This ${} syntax embeds an expression inside a string."
  },
  {
    code: `import { useState } from 'react';`,
    highlight: { start: 9, end: 17 },
    question: "What type of import is this?",
    correct: "named import",
    options: ["named import", "default import", "namespace import", "side effect import"],
    hint: "The curly braces indicate a specific export is being selected by name."
  },
  {
    code: `const doubled = numbers
  .filter(n => n > 0)
  .map(n => n * 2);`,
    highlight: { start: 26, end: 64 },
    question: "What is this programming pattern called?",
    correct: "method chaining",
    options: ["method chaining", "pipeline", "fluent interface", "cascade"],
    hint: "Each method call returns an object, letting the next call be appended with a dot."
  },
  {
    code: `function greet(name = 'World') {
  return \`Hello, \${name}!\`;
}`,
    highlight: { start: 15, end: 29 },
    question: "What is this parameter syntax called?",
    correct: "default parameter",
    options: ["default parameter", "optional parameter", "fallback parameter", "preset parameter"],
    hint: "The = sign assigns a value that's used when no argument is provided."
  },
  {
    code: `function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}`,
    highlight: { start: 13, end: 23 },
    question: "What is this parameter syntax called?",
    correct: "rest parameter",
    options: ["rest parameter", "spread parameter", "variadic parameter", "collect parameter"],
    hint: "The three dots (...) collect all remaining arguments into an array."
  },
  {
    code: `const element = <h1>Hello World</h1>;`,
    highlight: { start: 16, end: 36 },
    question: "What is this syntax called?",
    correct: "JSX",
    options: ["JSX", "HTML", "XML", "template"],
    hint: "This HTML-like syntax is used inside JavaScript, typically with React."
  },
  {
    code: `const colors = ['red', 'green', 'blue'];
const last = colors.pop();`,
    highlight: { start: 54, end: 66 },
    question: "What does this method do?",
    correct: "removes the last element",
    options: ["removes the last element", "adds an element", "returns the length", "finds an element"],
    hint: "Think about what 'pop' means — like popping something off the top of a stack."
  },
  {
    code: `const numbers = [1, 2, 3];
numbers.push(4);`,
    highlight: { start: 27, end: 42 },
    question: "What does this method do?",
    correct: "adds to the end",
    options: ["adds to the end", "adds to the start", "removes from end", "removes from start"],
    hint: "Think about pushing something onto the end of a line."
  },
  {
    code: `const text = 'hello world';
const upper = text.toUpperCase();`,
    highlight: { start: 42, end: 60 },
    question: "What type of method is this?",
    correct: "string method",
    options: ["string method", "array method", "object method", "number method"],
    hint: "Look at the type of value that text holds — it's a word in quotes."
  },
  {
    code: `function greet(name: string) {
  return \`Hello, \${name}!\`;
}
greet('Alice');`,
    highlight: { start: 66, end: 73 },
    question: "What is the highlighted part called?",
    correct: "argument",
    options: ["argument", "parameter", "property", "value"],
    hint: "This is the actual value passed when calling (invoking) the function."
  },
  {
    code: `function calculate(a: number, b: number) {
  return a + b;
}`,
    highlight: { start: 41, end: 60 },
    question: "What is the highlighted part called?",
    correct: "function body",
    options: ["function body", "code block", "statement", "expression"],
    hint: "This is the code inside the curly braces where the function does its work."
  },
  {
    code: `const numbers = [1, 2, 3, 4, 5];`,
    highlight: { start: 16, end: 31 },
    question: "What are these symbols called?",
    correct: "square brackets",
    options: ["square brackets", "curly braces", "parentheses", "angle brackets"],
    hint: "These [ ] symbols are commonly used to define arrays."
  },
  {
    code: `const person = { name: 'Alice', age: 30 };`,
    highlight: { start: 15, end: 41 },
    question: "What are these symbols called?",
    correct: "curly braces",
    options: ["curly braces", "square brackets", "parentheses", "angle brackets"],
    hint: "These { } symbols are commonly used to define objects."
  },
  {
    code: `function add(a: number, b: number): number {
  return a + b;
}`,
    highlight: { start: 12, end: 34 },
    question: "What are these symbols called?",
    correct: "parentheses",
    options: ["parentheses", "curly braces", "square brackets", "angle brackets"],
    hint: "These ( ) symbols surround function parameters."
  },
  {
    code: `interface User {
  name: string;
  age: number;
}`,
    highlight: { start: 19, end: 31 },
    question: "What is the highlighted part called?",
    correct: "property",
    options: ["property", "field", "attribute", "member"],
    hint: "In an interface, each key-value pair declaration is called a ___."
  },
  {
    code: `const fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]);`,
    highlight: { start: 64, end: 67 },
    question: "What is the highlighted part called?",
    correct: "index",
    options: ["index", "key", "position", "offset"],
    hint: "The number inside square brackets refers to a position in the array."
  },
  {
    code: `const add = (a, b) => a + b;`,
    highlight: { start: 12, end: 27 },
    question: "What is this syntax called?",
    correct: "arrow function",
    options: ["arrow function", "lambda", "anonymous function", "inline function"],
    hint: "The => symbol gives this ES6 function syntax its name."
  },
  {
    code: `const point = { x: 10, y: 20 };`,
    highlight: { start: 14, end: 30 },
    question: "What is this syntax called?",
    correct: "object literal",
    options: ["object literal", "object notation", "hash", "dictionary"],
    hint: "This creates an object directly in code using { key: value } syntax."
  },
  {
    code: `const doubled = numbers.map(n => n * 2);`,
    highlight: { start: 28, end: 38 },
    question: "What is the function passed to map called?",
    correct: "callback",
    options: ["callback", "lambda", "handler", "delegate"],
    hint: "A function passed as an argument to another function, to be 'called back' later."
  }
];

export const level2Questions: Question[] = [
  {
    code: `const numbers: Array<number> = [1, 2, 3];`,
    highlight: { start: 15, end: 28 },
    question: "What is the highlighted part called?",
    correct: "generic",
    options: ["generic", "type parameter", "template", "type annotation"],
    hint: "The angle brackets <> let this type work with different inner types."
  },
  {
    code: `type Status = 'active' | 'inactive' | 'pending';`,
    highlight: { start: 14, end: 47 },
    question: "What is the highlighted part called?",
    correct: "union type",
    options: ["union type", "intersection type", "literal type", "enum"],
    hint: "The | (pipe) operator combines multiple types into one 'this OR that' type."
  },
  {
    code: `function getName(): string {
  return 'Alice';
}`,
    highlight: { start: 18, end: 26 },
    question: "What is the highlighted part called?",
    correct: "return type",
    options: ["return type", "type annotation", "type hint", "output type"],
    hint: "This annotation after the () declares what type the function gives back."
  },
  {
    code: `const user = { name: 'Alice', age: 30, city: 'NYC' };
const { name, age } = user;`,
    highlight: { start: 60, end: 73 },
    question: "What is this syntax called?",
    correct: "destructuring",
    options: ["destructuring", "unpacking", "pattern matching", "extraction"],
    hint: "This syntax extracts values from an object into individual variables."
  },
  {
    code: `const oldArr = [1, 2, 3];
const newArr = [...oldArr, 4, 5];`,
    highlight: { start: 41, end: 44 },
    question: "What is this syntax called?",
    correct: "spread syntax",
    options: ["spread syntax", "rest syntax", "destructuring", "expansion"],
    hint: "The three dots (...) expand an iterable's elements into a new array."
  },
  {
    code: `const isActive = true;
const message = isActive ? 'yes' : 'no';`,
    highlight: { start: 39, end: 62 },
    question: "What is this operator called?",
    correct: "ternary operator",
    options: ["ternary operator", "comparison operator", "inline if", "expression"],
    hint: "This condition ? valueIfTrue : valueIfFalse operator has three parts."
  },
  {
    code: `const user = { profile: { name: 'Alice' } };
const name = user?.profile?.name;`,
    highlight: { start: 62, end: 64 },
    question: "What is this operator called?",
    correct: "optional chaining",
    options: ["optional chaining", "safe navigation", "null check", "elvis operator"],
    hint: "The ?. operator safely accesses properties that might be null or undefined."
  },
  {
    code: `function getValue(input?: string) {
  return input ?? 'default';
}`,
    highlight: { start: 51, end: 53 },
    question: "What is this operator called?",
    correct: "nullish coalescing",
    options: ["nullish coalescing", "default operator", "fallback operator", "or operator"],
    hint: "The ?? operator provides a fallback only for null or undefined values."
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
    options: ["inheritance", "extension", "composition", "implementation"],
    hint: "The 'extends' keyword means Dog receives all of Animal's properties and methods."
  },
  {
    code: `type ID = string | number;`,
    highlight: { start: 0, end: 25 },
    question: "What is this declaration called?",
    correct: "type alias",
    options: ["type alias", "type definition", "typedef", "interface"],
    hint: "The 'type' keyword gives a new name to an existing type expression."
  },
  {
    code: `type Coordinates = [number, number];`,
    highlight: { start: 19, end: 35 },
    question: "What is this type called?",
    correct: "tuple",
    options: ["tuple", "array", "pair", "vector"],
    hint: "This is a fixed-length array where each position has a specific type."
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
    options: ["closure", "scope", "hoisting", "recursion"],
    hint: "The inner function 'remembers' the variable x from its outer function."
  },
  {
    code: `console.log(x);
var x = 5;`,
    highlight: { start: 0, end: 26 },
    question: "What JavaScript behavior causes x to be undefined here?",
    correct: "hoisting",
    options: ["hoisting", "closure", "scoping", "coercion"],
    hint: "Variable declarations with var are moved to the top of their scope."
  },
  {
    code: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done'), 1000);
});`,
    highlight: { start: 16, end: 93 },
    question: "What is this object called?",
    correct: "Promise",
    options: ["Promise", "Future", "Deferred", "Observable"],
    hint: "This object represents a value that may not be available yet but will resolve later."
  },
  {
    code: `const double = (x) => x * 2;
const numbers = [1, 2, 3].map(double);`,
    highlight: { start: 0, end: 27 },
    question: "What type of function is this?",
    correct: "pure function",
    options: ["pure function", "impure function", "side effect", "closure"],
    hint: "It always returns the same output for the same input and has no side effects."
  },
  {
    code: `const nums = [1, 2, 3].map(n => n * 2);`,
    highlight: { start: 13, end: 38 },
    question: "What does map() return?",
    correct: "new array",
    options: ["new array", "modified array", "undefined", "boolean"],
    hint: "map() does not mutate the original — it creates something fresh."
  },
  {
    code: `const found = [1, 2, 3, 4].find(n => n > 2);`,
    highlight: { start: 14, end: 43 },
    question: "What does find() return?",
    correct: "first matching element",
    options: ["first matching element", "all matches", "boolean", "index"],
    hint: "It stops searching as soon as it finds one element that passes the test."
  },
  {
    code: `const hasEven = [1, 2, 3].some(n => n % 2 === 0);`,
    highlight: { start: 16, end: 48 },
    question: "What does some() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"],
    hint: "It answers a yes/no question: does at least one element pass the test?"
  },
  {
    code: `const allPositive = [1, 2, 3].every(n => n > 0);`,
    highlight: { start: 20, end: 47 },
    question: "What does every() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"],
    hint: "It answers a yes/no question: do ALL elements pass the test?"
  },
  {
    code: `const sum = [1, 2, 3].reduce((acc, n) => acc + n, 0);`,
    highlight: { start: 12, end: 52 },
    question: "What array method accumulates values?",
    correct: "reduce",
    options: ["reduce", "accumulate", "fold", "aggregate"],
    hint: "It takes many values and 'reduces' them down to a single accumulated result."
  },
  {
    code: `const [count, setCount] = useState(0);`,
    highlight: { start: 0, end: 37 },
    question: "What React feature is being used here?",
    correct: "hook",
    options: ["hook", "component", "prop", "context"],
    hint: "Functions starting with 'use' that let you 'hook into' React features."
  },
  {
    code: `useEffect(() => {
  document.title = 'Hello';
}, []);`,
    highlight: { start: 0, end: 50 },
    question: "What is this React hook used for?",
    correct: "side effects",
    options: ["side effects", "state management", "memoization", "context"],
    hint: "This hook runs code that interacts with things outside the component, like the DOM."
  },
  {
    code: `useEffect(() => {
  fetchData();
}, [userId]);`,
    highlight: { start: 33, end: 41 },
    question: "What is this array called in useEffect?",
    correct: "dependency array",
    options: ["dependency array", "watch list", "trigger array", "effect list"],
    hint: "The effect re-runs whenever a value in this array changes."
  },
  {
    code: `function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}`,
    highlight: { start: 16, end: 38 },
    question: "What is this pattern called in React?",
    correct: "props destructuring",
    options: ["props destructuring", "parameter spread", "object unpacking", "property access"],
    hint: "The { } in the function parameters extract specific properties from the props object."
  },
  {
    code: `<button onClick={() => setCount(count + 1)}>
  Click me
</button>`,
    highlight: { start: 8, end: 43 },
    question: "What is this attribute called in React?",
    correct: "event handler",
    options: ["event handler", "callback prop", "action", "listener"],
    hint: "This function responds to a user interaction like a click."
  },
  {
    code: `{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}`,
    highlight: { start: 27, end: 41 },
    question: "What is this attribute used for in React?",
    correct: "identifying list items",
    options: ["identifying list items", "styling elements", "indexing", "sorting"],
    hint: "React uses this to track which items in a list have changed, been added, or removed."
  },
  {
    code: `type AdminUser = User & Admin;`,
    highlight: { start: 22, end: 23 },
    question: "What operator creates an intersection type?",
    correct: "ampersand",
    options: ["ampersand", "pipe", "plus", "asterisk"],
    hint: "This & symbol means a type must satisfy ALL of the combined types."
  },
  {
    code: `type StringOrNumber = string | number;`,
    highlight: { start: 29, end: 30 },
    question: "What operator creates a union type?",
    correct: "pipe",
    options: ["pipe", "ampersand", "or", "plus"],
    hint: "This | symbol means a type can be ONE of the combined types."
  }
];

export const level3Questions: Question[] = [
  {
    code: `const value: unknown = getValue();
const str = value as string;`,
    highlight: { start: 47, end: 62 },
    question: "What is this syntax called?",
    correct: "type assertion",
    options: ["type assertion", "type cast", "type conversion", "type coercion"],
    hint: "The 'as' keyword tells TypeScript to treat a value as a specific type."
  },
  {
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}`,
    highlight: { start: 35, end: 50 },
    question: "What is this return type syntax called?",
    correct: "type predicate",
    options: ["type predicate", "type narrowing", "type check", "type assertion"],
    hint: "The 'value is string' syntax narrows the type when the function returns true."
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
    options: ["access modifier", "visibility", "scope", "qualifier"],
    hint: "This keyword controls who can see and use a class member (public, private, protected)."
  },
  {
    code: `abstract class Shape {
  abstract area(): number;
}`,
    highlight: { start: 0, end: 21 },
    question: "What is this type of class called?",
    correct: "abstract class",
    options: ["abstract class", "base class", "interface", "virtual class"],
    hint: "This class cannot be instantiated directly — it must be extended by a subclass."
  },
  {
    code: `interface StringMap {
  [key: string]: any;
}`,
    highlight: { start: 24, end: 42 },
    question: "What is this syntax called?",
    correct: "index signature",
    options: ["index signature", "indexer", "dynamic property", "computed property"],
    hint: "The [key: string] syntax allows an object to have any number of dynamically-named properties."
  },
  {
    code: `type IsString<T> = T extends string ? T : never;`,
    highlight: { start: 19, end: 47 },
    question: "What is this type called?",
    correct: "conditional type",
    options: ["conditional type", "ternary type", "generic constraint", "mapped type"],
    hint: "It uses the same ? : pattern as an if/else, but at the type level."
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
    options: ["default export", "primary export", "main export", "single export"],
    hint: "A module can only have one of these — it's what you get when importing without curly braces."
  },
  {
    code: `export const API_URL = 'https://api.example.com';
export function fetchData() { }`,
    highlight: { start: 0, end: 6 },
    question: "What is this type of export called?",
    correct: "named export",
    options: ["named export", "explicit export", "public export", "module export"],
    hint: "Each export is identified by its specific name and imported with curly braces."
  },
  {
    code: `type Partial<T> = {
  [P in keyof T]?: T[P];
};`,
    highlight: { start: 22, end: 43 },
    question: "What is this type called?",
    correct: "mapped type",
    options: ["mapped type", "conditional type", "indexed type", "generic type"],
    hint: "The [P in keyof T] iterates over each property, transforming the type like Array.map."
  },
  {
    code: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;`,
    highlight: { start: 51, end: 58 },
    question: "What keyword extracts a type from a pattern?",
    correct: "infer",
    options: ["infer", "extract", "typeof", "keyof"],
    hint: "This keyword lets TypeScript deduce a type variable from within a conditional type."
  },
  {
    code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };`,
    highlight: { start: 19, end: 23 },
    question: "What property enables discriminated unions?",
    correct: "discriminant",
    options: ["discriminant", "enumerator", "identifier", "selector"],
    hint: "This shared property with literal types lets TypeScript narrow which variant you have."
  },
  {
    code: `function process<T extends { id: number }>(item: T) {
  return item.id;
}`,
    highlight: { start: 19, end: 41 },
    question: "What is this syntax called?",
    correct: "generic constraint",
    options: ["generic constraint", "type bound", "type limit", "interface requirement"],
    hint: "The 'extends' keyword limits what types T can be, requiring certain properties."
  },
  {
    code: `type NonNullable<T> = T extends null | undefined ? never : T;`,
    highlight: { start: 49, end: 54 },
    question: "What type represents an impossible value?",
    correct: "never",
    options: ["never", "void", "null", "undefined"],
    hint: "A function that always throws or an exhausted conditional produces this bottom type."
  },
  {
    code: `type EventNames = \`on\${Capitalize<string>}\`;`,
    highlight: { start: 18, end: 43 },
    question: "What is this type syntax called?",
    correct: "template literal type",
    options: ["template literal type", "string pattern type", "format type", "interpolated type"],
    hint: "It uses backtick syntax at the type level to create string patterns."
  },
  {
    code: `type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};`,
    highlight: { start: 0, end: 72 },
    question: "What kind of type is this?",
    correct: "recursive type",
    options: ["recursive type", "nested type", "deep type", "self-referential type"],
    hint: "This type references itself in its own definition — like a function calling itself."
  },
  {
    code: `const theme = useContext(ThemeContext);`,
    highlight: { start: 14, end: 38 },
    question: "What React hook accesses context?",
    correct: "useContext",
    options: ["useContext", "useProvider", "useConsumer", "useTheme"],
    hint: "This hook reads a value that was provided by a Context.Provider higher in the tree."
  },
  {
    code: `const memoized = useMemo(() => compute(a, b), [a, b]);`,
    highlight: { start: 17, end: 53 },
    question: "What React hook memoizes computed values?",
    correct: "useMemo",
    options: ["useMemo", "useCallback", "useRef", "useEffect"],
    hint: "It caches the result of an expensive calculation, recomputing only when dependencies change."
  },
  {
    code: `const handler = useCallback(() => {
  onClick(id);
}, [onClick, id]);`,
    highlight: { start: 16, end: 66 },
    question: "What React hook memoizes functions?",
    correct: "useCallback",
    options: ["useCallback", "useMemo", "useHandler", "useFunction"],
    hint: "Like useMemo, but specifically for caching function references between renders."
  },
  {
    code: `const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();`,
    highlight: { start: 17, end: 47 },
    question: "What React hook creates a mutable reference?",
    correct: "useRef",
    options: ["useRef", "usePointer", "useHandle", "useMutable"],
    hint: "It returns an object with a .current property that persists across renders."
  },
  {
    code: `type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};`,
    highlight: { start: 0, end: 55 },
    question: "What utility type selects specific properties?",
    correct: "Pick",
    options: ["Pick", "Select", "Extract", "Choose"],
    hint: "Like picking items from a menu — you choose which properties to keep."
  },
  {
    code: `type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;`,
    highlight: { start: 0, end: 64 },
    question: "What utility type removes specific properties?",
    correct: "Omit",
    options: ["Omit", "Exclude", "Remove", "Without"],
    hint: "The opposite of Pick — you specify which properties to leave out."
  },
  {
    code: `function useCustomHook(initialValue: number) {
  const [value, setValue] = useState(initialValue);
  return { value, increment: () => setValue(v => v + 1) };
}`,
    highlight: { start: 0, end: 154 },
    question: "What React pattern is this?",
    correct: "custom hook",
    options: ["custom hook", "higher-order component", "render prop", "compound component"],
    hint: "A reusable function starting with 'use' that composes built-in hooks."
  },
  {
    code: `type Awaited<T> = T extends Promise<infer U> ? U : T;`,
    highlight: { start: 0, end: 52 },
    question: "What utility type unwraps Promises?",
    correct: "Awaited",
    options: ["Awaited", "Unwrap", "Resolve", "PromiseResult"],
    hint: "It extracts the resolved value type, like what you get after using await."
  }
];

export const levels: Level[] = [
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

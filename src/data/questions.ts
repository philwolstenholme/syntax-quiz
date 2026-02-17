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
  explanation: string;
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
    hint: "This appears in the function declaration, not at the call site.",
    explanation: "A parameter is a variable listed in a function's declaration. An argument is the actual value passed to the function when it's called \u2014 parameters define, arguments supply."
  },
  {
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: { start: 17, end: 34 },
    question: "What is this string syntax called?",
    correct: "template literal",
    options: ["template literal", "string literal", "format string", "interpolated string"],
    hint: "It uses backticks instead of quotes.",
    explanation: "Template literals use backticks (`) instead of quotes and allow embedded expressions via ${}. Regular string literals use single or double quotes and don't support interpolation."
  },
  {
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: { start: 25, end: 32 },
    question: "What is the highlighted syntax called?",
    correct: "string interpolation",
    options: ["string interpolation", "variable injection", "placeholder", "expression slot"],
    hint: "This ${} syntax embeds an expression inside a string.",
    explanation: "String interpolation is the process of embedding expressions inside a string using ${expression} syntax within a template literal. The expression is evaluated and its result is inserted into the string."
  },
  {
    code: `import { useState } from 'react';`,
    highlight: { start: 9, end: 17 },
    question: "What type of import is this?",
    correct: "named import",
    options: ["named import", "default import", "namespace import", "side effect import"],
    hint: "The curly braces indicate a specific export is being selected by name.",
    explanation: "Named imports use curly braces to import specific exports by their exact name. Default imports don't use braces, and namespace imports use * as name."
  },
  {
    code: `const doubled = numbers
  .filter(n => n > 0)
  .map(n => n * 2);`,
    highlight: { start: 26, end: 64 },
    question: "What is this programming pattern called?",
    correct: "method chaining",
    options: ["method chaining", "pipeline", "fluent interface", "cascade"],
    hint: "Each method call returns an object, letting the next call be appended with a dot.",
    explanation: "Method chaining calls multiple methods in sequence, where each method returns an object that the next method is called on. This works because array methods like filter() and map() return new arrays."
  },
  {
    code: `function greet(name = 'World') {
  return \`Hello, \${name}!\`;
}`,
    highlight: { start: 15, end: 29 },
    question: "What is this parameter syntax called?",
    correct: "default parameter",
    options: ["default parameter", "optional parameter", "fallback parameter", "preset parameter"],
    hint: "The = sign assigns a value that's used when no argument is provided.",
    explanation: "A default parameter provides a fallback value using = syntax in the function declaration. If the caller omits that argument (or passes undefined), the default value is used instead."
  },
  {
    code: `function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}`,
    highlight: { start: 13, end: 23 },
    question: "What is this parameter syntax called?",
    correct: "rest parameter",
    options: ["rest parameter", "spread parameter", "variadic parameter", "collect parameter"],
    hint: "The three dots (...) collect all remaining arguments into an array.",
    explanation: "A rest parameter uses ...name syntax to collect all remaining arguments into a single array. Unlike spread syntax (which expands), rest syntax gathers multiple values together."
  },
  {
    code: `const element = <h1>Hello World</h1>;`,
    highlight: { start: 16, end: 36 },
    question: "What is this syntax called?",
    correct: "JSX",
    options: ["JSX", "HTML", "XML", "template"],
    hint: "This HTML-like syntax is used inside JavaScript, typically with React.",
    explanation: "JSX (JavaScript XML) is a syntax extension that lets you write HTML-like markup inside JavaScript. It's used by React and gets compiled to regular JavaScript function calls."
  },
  {
    code: `const colors = ['red', 'green', 'blue'];
const last = colors.pop();`,
    highlight: { start: 54, end: 66 },
    question: "What does this method do?",
    correct: "removes the last element",
    options: ["removes the last element", "adds an element", "returns the length", "finds an element"],
    hint: "Sometimes people use a stack of spring-loaded plates as a cafeteria as the analogy here. What makes those plates 'pop' upwards?.",
    explanation: "Array.pop() removes and returns the last element of the array, mutating the original array. It's the opposite of push(), which adds to the end."
  },
  {
    code: `const numbers = [1, 2, 3];
numbers.push(4);`,
    highlight: { start: 27, end: 42 },
    question: "What does this method do?",
    correct: "adds to the end",
    options: ["adds to the end", "adds to the start", "removes from end", "removes from start"],
    hint: "Sometimes people use a stack of spring-loaded plates as a cafeteria as the analogy here. What makes those plates 'push' downwards?.",
    explanation: "Array.push() adds one or more elements to the end of an array and returns the new length. It mutates the original array, unlike concat() which creates a new one."
  },
  {
    code: `const text = 'hello world';
const upper = text.toUpperCase();`,
    highlight: { start: 42, end: 60 },
    question: "What type of method is this?",
    correct: "string method",
    options: ["string method", "array method", "object method", "number method"],
    hint: "Look at the type of value that text holds — it's a word in quotes.",
    explanation: "toUpperCase() is a string method because it's called on a string value. JavaScript has distinct method sets for strings, arrays, numbers, and objects."
  },
  {
    code: `function greet(name: string) {
  return \`Hello, \${name}!\`;
}
greet('Alice');`,
    highlight: { start: 67, end: 74 },
    question: "What is the highlighted part called?",
    correct: "argument",
    options: ["argument", "parameter", "property", "value"],
    hint: "This is the actual value passed when calling (invoking) the function.",
    explanation: "An argument is the actual value passed when calling a function. Parameters are the variables in the function declaration; arguments are the concrete values supplied at the call site."
  },
  {
    code: `function calculate(a: number, b: number) {
  return a + b;
}`,
    highlight: { start: 41, end: 60 },
    question: "What is the highlighted part called?",
    correct: "function body",
    options: ["function body", "code block", "statement", "expression"],
    hint: "This is the code inside the curly braces where the function does its work.",
    explanation: "The function body is the code between the curly braces { } that executes when the function is called. It contains the statements and the return value."
  },
  {
    code: `const numbers = [1, 2, 3, 4, 5];`,
    highlight: { start: 16, end: 31 },
    question: "What are these symbols called?",
    correct: "square brackets",
    options: ["square brackets", "curly braces", "parentheses", "angle brackets"],
    hint: "These [ ] symbols are commonly used to define arrays.",
    explanation: "Square brackets [ ] are used to create arrays and to access elements by index. Curly braces { } define objects and blocks, parentheses ( ) group expressions and parameters."
  },
  {
    code: `const person = { name: 'Alice', age: 30 };`,
    highlight: { start: 15, end: 41 },
    question: "What are these symbols called?",
    correct: "curly braces",
    options: ["curly braces", "square brackets", "parentheses", "angle brackets"],
    hint: "These { } symbols are commonly used to define objects.",
    explanation: "Curly braces { } define object literals, code blocks, and destructuring patterns. Square brackets [ ] are for arrays, and parentheses ( ) are for function calls and grouping."
  },
  {
    code: `function add(a: number, b: number): number {
  return a + b;
}`,
    highlight: { start: 12, end: 34 },
    question: "What are these symbols called?",
    correct: "parentheses",
    options: ["parentheses", "curly braces", "square brackets", "angle brackets"],
    hint: "These ( ) symbols surround function parameters.",
    explanation: "Parentheses ( ) surround function parameters in declarations and arguments in calls. They also group expressions to control evaluation order."
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
    hint: "In an interface, each key-value pair declaration is called a ___.",
    explanation: "In TypeScript interfaces, each declaration like 'name: string' is a property definition. Properties define the shape of an object \u2014 what keys it has and what types they hold."
  },
  {
    code: `const fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]);`,
    highlight: { start: 64, end: 67 },
    question: "What is the highlighted part called?",
    correct: "index",
    options: ["index", "key", "position", "offset"],
    hint: "The number inside square brackets refers to a position in the array.",
    explanation: "An array index is the numeric position used to access elements, starting at 0. So fruits[0] accesses the first element, fruits[1] the second, and so on."
  },
  {
    code: `const add = (a, b) => a + b;`,
    highlight: { start: 12, end: 27 },
    question: "What is this syntax called?",
    correct: "arrow function",
    options: ["arrow function", "lambda", "anonymous function", "inline function"],
    hint: "The => symbol gives this ES6 function syntax its name.",
    explanation: "Arrow functions use the => syntax introduced in ES6. They provide a shorter syntax than function expressions and lexically bind the 'this' value from their surrounding scope."
  },
  {
    code: `const point = { x: 10, y: 20 };`,
    highlight: { start: 14, end: 30 },
    question: "What is this syntax called?",
    correct: "object literal",
    options: ["object literal", "object notation", "hash", "dictionary"],
    hint: "This creates an object directly in code using { key: value } syntax.",
    explanation: "An object literal creates an object directly using { key: value } syntax. It's called a 'literal' because you're writing the object's contents literally in the code."
  },
  {
    code: `const doubled = numbers.map(n => n * 2);`,
    highlight: { start: 28, end: 38 },
    question: "What is the function passed to map called?",
    correct: "callback",
    options: ["callback", "lambda", "handler", "delegate"],
    hint: "A function passed as an argument to another function, to be 'called back' later.",
    explanation: "A callback is a function passed as an argument to another function, to be called later. Here, the arrow function n => n * 2 is passed to map() which 'calls it back' for each element."
  },
  {
    code: `const USER_FIRST_NAME = 'Alice';`,
    highlight: { start: 6, end: 21 },
    question: "What naming convention is used here?",
    correct: "snake case",
    options: ["snake case", "camel case", "kebab case", "pascal case"],
    hint: "The words are separated by underscores, which look like they're crawling on the ground.",
    explanation: "Snake case uses underscores to separate words (user_first_name). It's the standard convention in Python and Ruby, and is also commonly used for database column names and environment variables."
  },
  {
    code: `const userFirstName = 'Alice';`,
    highlight: { start: 6, end: 19 },
    question: "What naming convention is used here?",
    correct: "camel case",
    options: ["camel case", "snake case", "pascal case", "kebab case"],
    hint: "Each new word starts with an uppercase letter, forming 'humps'…",
    explanation: "Camel case joins words with no separator, capitalizing each word after the first (userFirstName). It's the standard convention for variables and functions in JavaScript and TypeScript."
  },
  {
    code: `<div class="user-profile-card">Hello</div>`,
    highlight: { start: 12, end: 29 },
    question: "What naming convention is used in this CSS class?",
    correct: "kebab case",
    options: ["kebab case", "snake case", "camel case", "train case"],
    hint: "The words are separated by hyphens, like items on a skewer.",
    explanation: "Kebab case uses hyphens to separate words (user-profile-card). It's the standard convention for CSS class names, HTML attributes, and URL slugs. It's called 'kebab case' because the hyphens look like a skewer."
  },
  {
    code: `let count: number = 0;`,
    highlight: { start: 9, end: 17 },
    question: "What is the highlighted part called?",
    correct: "type annotation",
    options: ["type annotation", "type assertion", "type cast", "type declaration"],
    hint: "The ': number' syntax after the variable name tells TypeScript what type it is.",
    explanation: "A type annotation uses : Type syntax to explicitly declare a variable's type. TypeScript can often infer types, but annotations provide explicit documentation and enforce type checking."
  },
  {
    code: `function log(msg: string): void {
  console.log(msg);
}`,
    highlight: { start: 27, end: 31 },
    question: "What does this return type mean?",
    correct: "returns nothing",
    options: ["returns nothing", "returns null", "returns undefined", "returns any"],
    hint: "This keyword means the function doesn't give back a meaningful value.",
    explanation: "The void type indicates a function does not return a value. It's different from undefined — void means the return value should not be used, while undefined is an actual value."
  },
  {
    code: `interface User {
  name: string;
  age: number;
}`,
    highlight: { start: 0, end: 9 },
    question: "What keyword is used to define this structure?",
    correct: "interface",
    options: ["interface", "type", "class", "struct"],
    hint: "This keyword defines the shape of an object without creating an actual value.",
    explanation: "The interface keyword defines a contract that describes the shape of an object — what properties it has and their types. Unlike classes, interfaces exist only at compile time and generate no JavaScript code."
  },
  {
    code: `interface User {
  name: string;
  age?: number;
}`,
    highlight: { start: 35, end: 39 },
    question: "What does the ? symbol mean in this property?",
    correct: "optional property",
    options: ["optional property", "nullable property", "default property", "conditional property"],
    hint: "The question mark after the property name means it doesn't have to be provided.",
    explanation: "The ? after a property name makes it optional — objects of this type may or may not include it. An optional property can be omitted entirely, unlike a required property which must always be present."
  },
  {
    code: `async function fetchData() {
  const data = await fetch("/api");
  return data.json();
}`,
    highlight: { start: 0, end: 5 },
    question: "What does this keyword do to a function?",
    correct: "makes it return a Promise",
    options: ["makes it return a Promise", "makes it run faster", "makes it run in parallel", "makes it synchronous"],
    hint: "This keyword enables the use of 'await' inside the function.",
    explanation: "The async keyword makes a function always return a Promise and enables the use of await inside it. It allows asynchronous code to be written in a synchronous-looking style."
  },
  {
    code: `async function fetchData() {
  const data = await fetch("/api");
  return data.json();
}`,
    highlight: { start: 44, end: 49 },
    question: "What does this keyword do?",
    correct: "pauses until the Promise resolves",
    options: ["pauses until the Promise resolves", "creates a new Promise", "cancels the operation", "runs code in parallel"],
    hint: "This keyword waits for an asynchronous operation to complete before continuing.",
    explanation: "The await keyword pauses execution of an async function until the Promise it's given resolves, then returns the resolved value. It makes asynchronous code read like synchronous code."
  },
  {
    code: `const names: string[] = ["Alice", "Bob"];`,
    highlight: { start: 13, end: 21 },
    question: "What does this type annotation mean?",
    correct: "array of strings",
    options: ["array of strings", "single string", "string or array", "tuple of strings"],
    hint: "The [] after the type name means a collection of that type.",
    explanation: "string[] is TypeScript's shorthand syntax for an array of strings. It's equivalent to Array<string>. The square brackets after any type name indicate an array of that type."
  },
  {
    code: `const isActive = true;
const message = isActive ? 'yes' : 'no';`,
    highlight: { start: 39, end: 62 },
    question: "What is this operator called?",
    correct: "ternary operator",
    options: ["ternary operator", "comparison operator", "inline if", "expression"],
    hint: "This condition ? valueIfTrue : valueIfFalse operator has three parts.",
    explanation: "The ternary operator (condition ? a : b) is the only JavaScript operator that takes three operands. It's a concise alternative to if/else for simple conditional expressions."
  },
  {
    code: `const nums = [1, 2, 3].map(n => n * 2);`,
    highlight: { start: 13, end: 38 },
    question: "What does map() return?",
    correct: "new array",
    options: ["new array", "modified array", "undefined", "boolean"],
    hint: "map() does not mutate the original — it creates something fresh.",
    explanation: "Array.map() always returns a new array of the same length, with each element transformed by the callback. It never mutates the original array \u2014 this immutability is a key principle of functional programming."
  },
  {
    code: `const found = [1, 2, 3, 4].find(n => n > 2);`,
    highlight: { start: 14, end: 43 },
    question: "What does find() return?",
    correct: "first matching element",
    options: ["first matching element", "all matches", "boolean", "index"],
    hint: "It stops searching as soon as it finds one element that passes the test.",
    explanation: "Array.find() returns the first element that satisfies the test function, then stops iterating. If no element matches, it returns undefined. Use filter() to get all matches instead."
  },
  {
    code: `const hasEven = [1, 2, 3].some(n => n % 2 === 0);`,
    highlight: { start: 16, end: 48 },
    question: "What does some() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"],
    hint: "It answers a yes/no question: does at least one element pass the test?",
    explanation: "Array.some() returns true if at least one element passes the test, false otherwise. It short-circuits: once it finds a passing element, it stops checking the rest."
  },
  {
    code: `const allPositive = [1, 2, 3].every(n => n > 0);`,
    highlight: { start: 20, end: 47 },
    question: "What does every() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"],
    hint: "It answers a yes/no question: do ALL elements pass the test?",
    explanation: "Array.every() returns true only if all elements pass the test. It short-circuits on the first failure \u2014 as soon as one element fails, it returns false without checking the rest."
  },
  {
    code: `const [count, setCount] = useState(0);`,
    highlight: { start: 0, end: 37 },
    question: "What React feature is being used here?",
    correct: "hook",
    options: ["hook", "component", "prop", "context"],
    hint: "Functions starting with 'use' that let you 'hook into' React features.",
    explanation: "React hooks are functions starting with 'use' that let functional components manage state, effects, and other React features. useState, useEffect, useContext are all built-in hooks."
  },
  {
    code: `<button onClick={() => setCount(count + 1)}>
  Click me
</button>`,
    highlight: { start: 8, end: 43 },
    question: "What is this attribute called in React?",
    correct: "event handler",
    options: ["event handler", "callback prop", "action", "listener"],
    hint: "This function responds to a user interaction like a click.",
    explanation: "An event handler is a function assigned to respond to user interactions like clicks, keypresses, or form submissions. In React, they use camelCase naming like onClick instead of HTML's onclick."
  }
];

export const level2Questions: Question[] = [
  {
    code: `const numbers: Array<number> = [1, 2, 3];`,
    highlight: { start: 15, end: 28 },
    question: "What is the highlighted part called?",
    correct: "generic",
    options: ["generic", "type parameter", "template", "type annotation"],
    hint: "The angle brackets <> let this type work with different inner types.",
    explanation: "Generics use angle brackets <T> to create reusable types that work with different data types. Array<number> means 'an array specifically containing numbers' \u2014 the type parameter makes Array flexible."
  },
  {
    code: `type Status = 'active' | 'inactive' | 'pending';`,
    highlight: { start: 14, end: 47 },
    question: "What is the highlighted part called?",
    correct: "union type",
    options: ["union type", "intersection type", "literal type", "enum"],
    hint: "The | (pipe) operator combines multiple types into one 'this OR that' type.",
    explanation: "A union type uses the | operator to declare that a value can be one of several types. Each option in 'active' | 'inactive' | 'pending' is a string literal type combined with union."
  },
  {
    code: `function getName(): string {
  return 'Alice';
}`,
    highlight: { start: 18, end: 26 },
    question: "What is the highlighted part called?",
    correct: "return type",
    options: ["return type", "output signature", "type hint", "output type"],
    hint: "This annotation after the () declares what type the function gives back.",
    explanation: "A return type annotation after the parentheses declares what type a function will return. It helps TypeScript verify that all code paths return the expected type."
  },
  {
    code: `const user = { name: 'Alice', age: 30, city: 'NYC' };
const { name, age } = user;`,
    highlight: { start: 60, end: 73 },
    question: "What is this syntax called?",
    correct: "destructuring",
    options: ["destructuring", "unpacking", "pattern matching", "extraction"],
    hint: "This syntax extracts values from an object into individual variables.",
    explanation: "Destructuring extracts values from objects or arrays into distinct variables using a pattern that mirrors the data structure. const { name, age } = user creates variables name and age from the user object."
  },
  {
    code: `const oldArr = [1, 2, 3];
const newArr = [...oldArr, 4, 5];`,
    highlight: { start: 42, end: 45 },
    question: "What is this syntax called?",
    correct: "spread syntax",
    options: ["spread syntax", "rest syntax", "destructuring", "expansion"],
    hint: "The three dots (...) expand an iterable's elements into a new array.",
    explanation: "Spread syntax (...) expands an iterable's elements in place. In [...oldArr, 4, 5], it unpacks oldArr's elements into the new array. The same ... in a function parameter is rest syntax, which does the opposite."
  },
  {
    code: `const user = { profile: { name: 'Alice' } };
const name = user?.profile?.name;`,
    highlight: { start: 62, end: 64 },
    question: "What is this operator called?",
    correct: "optional chaining",
    options: ["optional chaining", "safe navigation", "null check", "elvis operator"],
    hint: "The ?. operator safely accesses properties that might be null or undefined.",
    explanation: "Optional chaining (?.) short-circuits to undefined if the left side is null or undefined, preventing 'cannot read property of null' errors. It's safer than regular dot notation for nested access."
  },
  {
    code: `function getValue(input?: string) {
  return input ?? 'default';
}`,
    highlight: { start: 51, end: 53 },
    question: "What is this operator called?",
    correct: "nullish coalescing",
    options: ["nullish coalescing", "default operator", "fallback operator", "NaN operator"],
    hint: "The ?? operator provides a fallback only for null or undefined values.",
    explanation: "The nullish coalescing operator (??) returns the right operand only when the left is null or undefined. Unlike || (logical OR), it doesn't trigger on falsy values like 0 or empty string."
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
    hint: "The 'extends' keyword means Dog receives all of Animal's properties and methods.",
    explanation: "Inheritance (via extends) lets a child class receive all properties and methods from a parent class. Dog extends Animal means Dog 'is an' Animal with additional behavior like bark()."
  },
  {
    code: `type ID = string | number;`,
    highlight: { start: 0, end: 25 },
    question: "What is this declaration called?",
    correct: "type alias",
    options: ["type alias", "type definition", "typedef", "interface"],
    hint: "The 'type' keyword gives a new name to an existing type expression.",
    explanation: "A type alias gives a name to any type expression using the type keyword. Unlike interfaces, type aliases can name unions, intersections, primitives, and other complex types."
  },
  {
    code: `type Coordinates = [number, number];`,
    highlight: { start: 19, end: 35 },
    question: "What is this type called?",
    correct: "tuple",
    options: ["tuple", "array", "pair", "vector"],
    hint: "This is a fixed-length array where each position has a specific type.",
    explanation: "A tuple is a fixed-length array where each position has a known, specific type. [number, number] always has exactly two elements, both numbers \u2014 unlike a regular array which can vary in length."
  },
  {
    code: `function outer() {
  const x = 10;
  return function inner() {
    return x;
  };
}`,
    highlight: { start: 0, end: 83 },
    question: "What JavaScript concept is demonstrated here?",
    correct: "closure",
    options: ["closure", "scope", "hoisting", "recursion"],
    hint: "The inner function 'remembers' the variable x from its outer function.",
    explanation: "A closure is a function that retains access to variables from its enclosing scope, even after that scope has finished executing. Here, inner() can still access x from outer() after outer() returns."
  },
  {
    code: `console.log(x);
var x = 5;`,
    highlight: { start: 0, end: 26 },
    question: "What JavaScript behavior causes x to be undefined here?",
    correct: "hoisting",
    options: ["hoisting", "closure", "scoping", "coercion"],
    hint: "Variable declarations with var are moved to the top of their scope.",
    explanation: "Hoisting moves var declarations (but not their assignments) to the top of their scope during compilation. So var x exists when console.log runs, but its value hasn't been assigned yet, resulting in undefined."
  },
  {
    code: `async function loadUser(id: number) {
  const data = await fetchUser(id);
  return data;
}`,
    highlight: { start: 52, end: 57 },
    question: "What does the `await` keyword pause execution for?",
    correct: "Promise",
    options: ["Promise", "Callback", "Observable", "Event"],
    hint: "This object represents a value that may not be available yet but will resolve later.",
    explanation: "The await keyword pauses an async function until a Promise settles. A Promise represents an asynchronous operation that will eventually resolve with a value or reject with an error — it has three states: pending, fulfilled, or rejected."
  },
  {
    code: `const double = (x) => x * 2;
const numbers = [1, 2, 3].map(double);`,
    highlight: { start: 0, end: 27 },
    question: "What type of function is this?",
    correct: "pure function",
    options: ["pure function", "impure function", "side effect", "closure"],
    hint: "It always returns the same output for the same input and has no side effects.",
    explanation: "A pure function always returns the same output for the same input and produces no side effects. double(3) always returns 6 and doesn't modify any external state."
  },
  {
    code: `useEffect(() => {
  document.title = 'Hello';
}, []);`,
    highlight: { start: 0, end: 52 },
    question: "What is this React hook used for?",
    correct: "side effects",
    options: ["side effects", "state management", "memoization", "context"],
    hint: "This hook runs code that interacts with things outside the component, like the DOM.",
    explanation: "useEffect runs code that interacts with systems outside React's rendering, like DOM manipulation, API calls, or subscriptions. The empty dependency array [] means it runs once after the first render."
  },
  {
    code: `useEffect(() => {
  fetchData();
}, [userId]);`,
    highlight: { start: 36, end: 44 },
    question: "What is this array called in useEffect?",
    correct: "dependency array",
    options: ["dependency array", "watch list", "trigger array", "effect list"],
    hint: "The effect re-runs whenever a value in this array changes.",
    explanation: "The dependency array tells useEffect when to re-run. The effect fires whenever any value in this array changes. An empty array [] means 'run once on mount'; omitting it means 'run after every render.'"
  },
  {
    code: `function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}`,
    highlight: { start: 16, end: 37 },
    question: "What is this pattern called in React?",
    correct: "props destructuring",
    options: ["props destructuring", "parameter spread", "object unpacking", "property access"],
    hint: "The { } in the function parameters extract specific properties from the props object.",
    explanation: "Props destructuring extracts specific properties from the props object directly in the function parameters. Instead of writing props.onClick and props.children, you get onClick and children as direct variables."
  },
  {
    code: `{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}`,
    highlight: { start: 27, end: 40 },
    question: "What is this attribute used for in React?",
    correct: "identifying list items",
    options: ["identifying list items", "styling elements", "indexing", "sorting"],
    hint: "React uses this to track which items in a list have changed, been added, or removed.",
    explanation: "React uses the key prop to track which items in a list have changed, been added, or removed. Keys should be stable, unique identifiers \u2014 using array indices can cause bugs when the list order changes."
  },
  {
    code: `type AdminUser = User & Admin;`,
    highlight: { start: 22, end: 23 },
    question: "What operator creates an intersection type?",
    correct: "ampersand",
    options: ["ampersand", "pipe", "plus", "asterisk"],
    hint: "This & symbol means a type must satisfy ALL of the combined types.",
    explanation: "The ampersand (&) creates an intersection type, meaning the resulting type must have ALL properties from both types. User & Admin has everything from User AND everything from Admin."
  },
  {
    code: `enum Direction {
  Up,
  Down,
  Left,
  Right
}`,
    highlight: { start: 0, end: 4 },
    question: "What keyword defines this set of named constants?",
    correct: "enum",
    options: ["enum", "const", "type", "object"],
    hint: "This TypeScript feature creates a set of named numeric or string constants.",
    explanation: "An enum (enumeration) is a TypeScript feature that defines a set of named constants. By default, enums are numeric (0, 1, 2...), but they can also be string-based. Enums are one of the few TypeScript features that exist at runtime."
  },
  {
    code: `type UserKeys = keyof User;`,
    highlight: { start: 16, end: 21 },
    question: "What operator extracts the property names of a type?",
    correct: "keyof",
    options: ["keyof", "keys", "typeof", "nameof"],
    hint: "This operator creates a union of all property names from a type.",
    explanation: "The keyof operator produces a union type of all property names from an object type. For interface User { name: string; age: number }, keyof User would be 'name' | 'age'."
  },
  {
    code: `const colors = ["red", "green", "blue"] as const;`,
    highlight: { start: 40, end: 48 },
    question: "What does this assertion do?",
    correct: "makes values readonly and literal",
    options: ["makes values readonly and literal", "converts to constant", "freezes the object", "makes it immutable at runtime"],
    hint: "This changes the type from string[] to readonly ['red', 'green', 'blue'].",
    explanation: "The as const assertion creates a readonly type with literal values instead of widened types. It makes arrays readonly tuples and object properties readonly with their literal values, useful for creating immutable data structures at the type level."
  },
  {
    code: `class Dog implements Animal {
  speak() {
    return "Woof";
  }
}`,
    highlight: { start: 11, end: 21 },
    question: "What does this keyword do?",
    correct: "enforces a class satisfies an interface",
    options: ["enforces a class satisfies an interface", "inherits from a class", "creates an abstract class", "extends a type"],
    hint: "This keyword ensures the class has all the properties and methods from the interface.",
    explanation: "The implements keyword enforces that a class adheres to the contract defined by an interface. TypeScript will error if the class doesn't provide all required properties and methods. Unlike extends (which copies implementation), implements only checks the shape."
  },
  {
    code: `function parse(input: unknown) {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
}`,
    highlight: { start: 22, end: 29 },
    question: "What is this type called?",
    correct: "unknown",
    options: ["unknown", "any", "never", "void"],
    hint: "This type is like 'any' but requires type checking before use.",
    explanation: "The unknown type is a type-safe alternative to any. While any allows all operations, unknown requires you to narrow the type (with typeof, instanceof, or type guards) before performing operations. It's the top type in TypeScript's type hierarchy."
  },
  {
    code: `const input = document.getElementById("app")!;`,
    highlight: { start: 45, end: 46 },
    question: "What is this operator called?",
    correct: "non-null assertion",
    options: ["non-null assertion", "not operator", "force unwrap", "definite assignment"],
    hint: "This tells TypeScript 'I know this value is not null or undefined'.",
    explanation: "The non-null assertion operator (!) tells TypeScript to trust that a value is neither null nor undefined, even if the type suggests it could be. Use sparingly — if you're wrong, you'll get a runtime error."
  },
  {
    code: `const user = { name: "Alice", age: 30 };
type UserType = typeof user;`,
    highlight: { start: 57, end: 63 },
    question: "What does typeof do in a type context?",
    correct: "extracts the type of a value",
    options: ["extracts the type of a value", "checks the runtime type", "creates a new type", "converts to a string"],
    hint: "In types, typeof captures the TypeScript type of a value.",
    explanation: "When used in a type position, typeof extracts the TypeScript type of a value. This is different from runtime typeof — it happens at compile time and creates a type based on the value's inferred type."
  },
  {
    code: `interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}`,
    highlight: { start: 21, end: 29 },
    question: "What does this modifier prevent?",
    correct: "reassignment of the property",
    options: ["reassignment of the property", "reading the property", "deleting the property", "runtime changes"],
    hint: "This keyword makes a property immutable after initialization.",
    explanation: "The readonly modifier prevents reassignment of a property after initialization. Note that this is a compile-time check only — readonly doesn't prevent mutations at runtime, and it doesn't make nested objects readonly (use DeepReadonly for that)."
  },
];

export const level3Questions: Question[] = [
  {
    code: `const value: unknown = getValue();
const str = value as string;`,
    highlight: { start: 47, end: 62 },
    question: "What is this syntax called?",
    correct: "type assertion",
    options: ["type assertion", "type cast", "type conversion", "type coercion"],
    hint: "The 'as' keyword tells TypeScript to treat a value as a specific type.",
    explanation: "A type assertion (value as Type) tells TypeScript to treat a value as a specific type. Unlike type casting in other languages, it doesn't convert the value at runtime \u2014 it only affects type checking."
  },
  {
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}`,
    highlight: { start: 35, end: 50 },
    question: "What is this return type syntax called?",
    correct: "type predicate",
    options: ["type predicate", "type narrowing", "type check", "type assertion"],
    hint: "The 'value is string' syntax narrows the type when the function returns true.",
    explanation: "A type predicate (value is Type) in a return type tells TypeScript to narrow the type of the parameter when the function returns true. This enables custom type guard functions."
  },
  {
    code: `interface StringMap {
  [key: string]: any;
}`,
    highlight: { start: 24, end: 42 },
    question: "What is this syntax called?",
    correct: "index signature",
    options: ["index signature", "indexer", "dynamic property", "computed property"],
    hint: "The [key: string] syntax allows an object to have any number of dynamically-named properties.",
    explanation: "An index signature [key: string]: type allows an object to have any number of properties with string keys. It defines a contract for dynamically-named properties whose types are known."
  },
  {
    code: `type IsString<T> = T extends string ? T : never;`,
    highlight: { start: 19, end: 47 },
    question: "What is this type called?",
    correct: "conditional type",
    options: ["conditional type", "ternary type", "generic constraint", "mapped type"],
    hint: "It uses the same ? : pattern as an if/else, but at the type level.",
    explanation: "A conditional type uses T extends U ? X : Y syntax to choose between types based on a condition. It's like an if/else statement but for types, evaluated at compile time."
  },
  {
    code: `type Partial<T> = {
  [P in keyof T]?: T[P];
};`,
    highlight: { start: 22, end: 43 },
    question: "What is this type called?",
    correct: "mapped type",
    options: ["mapped type", "conditional type", "indexed type", "generic type"],
    hint: "The [P in keyof T] iterates over each property, transforming the type like Array.map.",
    explanation: "A mapped type iterates over the keys of another type using [P in keyof T] and transforms each property. Partial<T> makes every property optional by adding ? to each one."
  },
  {
    code: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;`,
    highlight: { start: 51, end: 58 },
    question: "What keyword extracts a type from a pattern?",
    correct: "infer",
    options: ["infer", "extract", "typeof", "keyof"],
    hint: "This keyword lets TypeScript deduce a type variable from within a conditional type.",
    explanation: "The infer keyword declares a type variable within a conditional type that TypeScript will fill in. In T extends (...) => infer R, TypeScript deduces R from the actual return type."
  },
  {
    code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };`,
    highlight: { start: 19, end: 23 },
    question: "What property enables discriminated unions?",
    correct: "discriminant",
    options: ["discriminant", "enumerator", "identifier", "selector"],
    hint: "This shared property with literal types lets TypeScript narrow which variant you have.",
    explanation: "A discriminant is a shared property (like kind) with literal types that lets TypeScript narrow a union. When you check kind === 'circle', TypeScript knows you have the circle variant."
  },
  {
    code: `function process<T extends { id: number }>(item: T) {
  return item.id;
}`,
    highlight: { start: 19, end: 41 },
    question: "What is this syntax called?",
    correct: "generic constraint",
    options: ["generic constraint", "type bound", "type limit", "interface requirement"],
    hint: "The 'extends' keyword limits what types T can be, requiring certain properties.",
    explanation: "A generic constraint (T extends Type) restricts what types can be used as a type argument. Here, T must have an { id: number } property, so item.id is safe to access."
  },
  {
    code: `type NonNullable<T> = T extends null | undefined ? never : T;`,
    highlight: { start: 51, end: 56 },
    question: "What type represents an impossible value?",
    correct: "never",
    options: ["never", "void", "null", "undefined"],
    hint: "A function that always throws or an exhausted conditional produces this bottom type.",
    explanation: "The never type represents values that never occur \u2014 functions that always throw, infinite loops, or exhausted type narrowing. It's TypeScript's 'bottom type,' assignable to everything but nothing is assignable to it."
  },
  {
    code: `type EventNames = \`on\${Capitalize<string>}\`;`,
    highlight: { start: 18, end: 43 },
    question: "What is this type syntax called?",
    correct: "template literal type",
    options: ["template literal type", "string pattern type", "format type", "interpolated type"],
    hint: "It uses backtick syntax at the type level to create string patterns.",
    explanation: "Template literal types use backtick syntax at the type level to create string pattern types. They can combine string literals and type operators to generate sets of allowed string values."
  },
  {
    code: `type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};`,
    highlight: { start: 0, end: 72 },
    question: "What kind of type is this?",
    correct: "recursive type",
    options: ["recursive type", "nested type", "deep type", "self-referential type"],
    hint: "This type references itself in its own definition — like a function calling itself.",
    explanation: "A recursive type references itself in its definition, allowing it to describe nested data structures. DeepReadonly applies readonly to every level of a nested object by calling itself on each property's type."
  },
  {
    code: `type Awaited<T> = T extends Promise<infer U> ? U : T;`,
    highlight: { start: 0, end: 54 },
    question: "What utility type unwraps Promise types?",
    correct: "Awaited",
    options: ["Awaited", "Unwrap", "PromiseValue", "Resolved"],
    hint: "This type extracts the resolved value type from a Promise.",
    explanation: "Awaited<T> recursively unwraps Promise types to get the eventual resolved value type. If T is Promise<string>, Awaited<T> is string. It's useful for typing async function return values."
  },
  {
    code: `declare const API_URL: string;`,
    highlight: { start: 0, end: 7 },
    question: "What is this keyword used for?",
    correct: "ambient declaration",
    options: ["ambient declaration", "constant declaration", "type declaration", "global declaration"],
    hint: "This tells TypeScript about values that exist elsewhere without generating code.",
    explanation: "The declare keyword creates ambient declarations — it tells TypeScript about types and values that exist (perhaps in global scope or from external libraries) without emitting any JavaScript code. Commonly used in .d.ts declaration files."
  },
  {
    code: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};`,
    highlight: { start: 37, end: 71 },
    question: "What is this mapped type technique called?",
    correct: "key remapping",
    options: ["key remapping", "key transformation", "property mapping", "key mutation"],
    hint: "The 'as' clause in the mapped type transforms property names.",
    explanation: "Key remapping in mapped types uses the as clause to transform property keys. This example converts property names to getter function names, like 'name' becomes 'getName'. It combines mapped types with template literal types."
  },
  {
    code: `type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>;`,
    highlight: { start: 18, end: 46 },
    question: "Why does Result become string[] | number[]?",
    correct: "distributive conditional type",
    options: ["distributive conditional type", "union distribution", "type spreading", "conditional mapping"],
    hint: "When T is a union, the conditional type distributes over each member.",
    explanation: "Distributive conditional types apply the condition to each member of a union separately. ToArray<string | number> distributes to ToArray<string> | ToArray<number>, resulting in string[] | number[]. This only happens when T is a naked type parameter."
  },
  {
    code: `type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];`,
    highlight: { start: 53, end: 68 },
    question: "What TypeScript feature allows spreads in tuple types?",
    correct: "variadic tuple type",
    options: ["variadic tuple type", "tuple spreading", "rest tuple", "dynamic tuple"],
    hint: "This feature lets tuple types have dynamic length using spread syntax.",
    explanation: "Variadic tuple types allow spread syntax (...) in tuple type definitions to create tuples with dynamic length. They enable powerful type-level operations on tuple types, like concatenating or slicing them while preserving type information."
  },
  {
    code: `type T = Extract<"a" | "b" | "c", "a" | "c">;`,
    highlight: { start: 9, end: 45 },
    question: "What utility type keeps only matching union members?",
    correct: "Extract",
    options: ["Extract", "Filter", "Pick", "Select"],
    hint: "This type filters a union to only members assignable to another type.",
    explanation: "Extract<T, U> keeps only the members of union T that are assignable to U. It's the opposite of Exclude. Extract<'a' | 'b' | 'c', 'a' | 'c'> results in 'a' | 'c', filtering out 'b'."
  },
  {
    code: `function getUser() { return { name: "Alice", age: 30 }; }
type Result = ReturnType<typeof getUser>;`,
    highlight: { start: 72, end: 98 },
    question: "What utility type extracts a function's return type?",
    correct: "ReturnType",
    options: ["ReturnType", "Returns", "OutputType", "ResultType"],
    hint: "This type extracts what a function returns without calling it.",
    explanation: "ReturnType<T> extracts the return type from a function type. Combined with typeof, you can get the return type of a function value. It uses conditional types with infer internally: T extends (...args: any) => infer R ? R : never."
  },
  {
    code: `const config = {
  width: 100,
  color: "red"
} satisfies Record<string, string | number>;`,
    highlight: { start: 44, end: 84 },
    question: "What operator validates a type without widening it?",
    correct: "satisfies",
    options: ["satisfies", "validates", "conforms", "checks"],
    hint: "This operator checks type compatibility while preserving literal types.",
    explanation: "The satisfies operator validates that a value matches a type without widening the value's type. Unlike type assertions (as), it catches type errors while preserving specific literal types. config.color remains type 'red', not string."
  },
  {
    code: `type Shouted = Uppercase<"hello">;`,
    highlight: { start: 15, end: 24 },
    question: "What kind of built-in type is Uppercase?",
    correct: "intrinsic type",
    options: ["intrinsic type", "utility type", "template type", "string type"],
    hint: "This type is implemented natively in the TypeScript compiler, not in TypeScript code.",
    explanation: "Intrinsic types like Uppercase, Lowercase, Capitalize, and Uncapitalize are implemented directly in the TypeScript compiler rather than being written in TypeScript. They perform string transformations at the type level that can't be expressed with regular TypeScript."
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

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
    code: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done'), 1000);
});`,
    highlight: { start: 16, end: 96 },
    question: "What is this object called?",
    correct: "Promise",
    options: ["Promise", "Future", "Deferred", "Observable"],
    hint: "This object represents a value that may not be available yet but will resolve later.",
    explanation: "A Promise represents an asynchronous operation that will eventually resolve with a value or reject with an error. It has three states: pending, fulfilled, or rejected."
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
    code: `const sum = [1, 2, 3].reduce((acc, n) => acc + n, 0);`,
    highlight: { start: 12, end: 52 },
    question: "What array method accumulates values?",
    correct: "reduce",
    options: ["reduce", "accumulate", "fold", "aggregate"],
    hint: "It takes many values and 'reduces' them down to a single accumulated result.",
    explanation: "Array.reduce() iterates through an array, accumulating a single result by applying a callback to each element. The accumulator (acc) carries the running total between iterations."
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
    code: `<button onClick={() => setCount(count + 1)}>
  Click me
</button>`,
    highlight: { start: 8, end: 43 },
    question: "What is this attribute called in React?",
    correct: "event handler",
    options: ["event handler", "callback prop", "action", "listener"],
    hint: "This function responds to a user interaction like a click.",
    explanation: "An event handler is a function assigned to respond to user interactions like clicks, keypresses, or form submissions. In React, they use camelCase naming like onClick instead of HTML's onclick."
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
    code: `type StringOrNumber = string | number;`,
    highlight: { start: 29, end: 30 },
    question: "What operator creates a union type?",
    correct: "pipe",
    options: ["pipe", "ampersand", "or", "plus"],
    hint: "This | symbol means a type can be ONE of the combined types.",
    explanation: "The pipe (|) creates a union type, meaning a value can be any ONE of the listed types. string | number accepts either a string or a number, but not both at once."
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
    hint: "This keyword controls who can see and use a class member (public, private, protected).",
    explanation: "Access modifiers (public, private, protected) control the visibility of class members. private means the member can only be accessed within the class itself, not from outside or subclasses."
  },
  {
    code: `abstract class Shape {
  abstract area(): number;
}`,
    highlight: { start: 0, end: 21 },
    question: "What is this type of class called?",
    correct: "abstract class",
    options: ["abstract class", "base class", "interface", "virtual class"],
    hint: "This class cannot be instantiated directly — it must be extended by a subclass.",
    explanation: "An abstract class provides a base for other classes but cannot be instantiated directly with new. It can contain abstract methods (no implementation) that subclasses must implement."
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
    code: `export default class App {
  render() {
    return <div>Hello</div>;
  }
}`,
    highlight: { start: 0, end: 14 },
    question: "What is this type of export called?",
    correct: "default export",
    options: ["default export", "primary export", "main export", "single export"],
    hint: "A module can only have one of these — it's what you get when importing without curly braces.",
    explanation: "A default export (export default) is the main exported value of a module. Each module can have only one, and it can be imported without curly braces using any name the importer chooses."
  },
  {
    code: `export const API_URL = 'https://api.example.com';
export function fetchData() { }`,
    highlight: { start: 0, end: 6 },
    question: "What is this type of export called?",
    correct: "named export",
    options: ["named export", "explicit export", "public export", "module export"],
    hint: "Each export is identified by its specific name and imported with curly braces.",
    explanation: "Named exports use the export keyword before declarations. A module can have many named exports, and importers must use the exact name (with curly braces) or rename with 'as'."
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
    code: `const theme = useContext(ThemeContext);`,
    highlight: { start: 14, end: 38 },
    question: "What React hook accesses context?",
    correct: "useContext",
    options: ["useContext", "useProvider", "useConsumer", "useTheme"],
    hint: "This hook reads a value that was provided by a Context.Provider higher in the tree.",
    explanation: "useContext reads the current value from a React Context, which is set by the nearest Context.Provider ancestor in the component tree. It avoids the need to pass props through every intermediate component."
  },
  {
    code: `const memoized = useMemo(() => compute(a, b), [a, b]);`,
    highlight: { start: 17, end: 53 },
    question: "What React hook memoizes computed values?",
    correct: "useMemo",
    options: ["useMemo", "useCallback", "useRef", "useEffect"],
    hint: "It caches the result of an expensive calculation, recomputing only when dependencies change.",
    explanation: "useMemo caches the result of an expensive computation and only recomputes when its dependencies change. It returns the memoized value, unlike useCallback which memoizes the function itself."
  },
  {
    code: `const handler = useCallback(() => {
  onClick(id);
}, [onClick, id]);`,
    highlight: { start: 16, end: 66 },
    question: "What React hook memoizes functions?",
    correct: "useCallback",
    options: ["useCallback", "useMemo", "useHandler", "useFunction"],
    hint: "Like useMemo, but specifically for caching function references between renders.",
    explanation: "useCallback returns a memoized version of a callback function that only changes when its dependencies change. It's essentially useMemo(() => fn, deps) \u2014 useful for preventing unnecessary re-renders of child components."
  },
  {
    code: `const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();`,
    highlight: { start: 17, end: 47 },
    question: "What React hook creates a mutable reference?",
    correct: "useRef",
    options: ["useRef", "usePointer", "useHandle", "useMutable"],
    hint: "It returns an object with a .current property that persists across renders.",
    explanation: "useRef creates a mutable ref object with a .current property that persists across renders without causing re-renders when changed. It's commonly used for DOM element references and storing mutable values."
  },
  {
    code: `type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};`,
    highlight: { start: 0, end: 55 },
    question: "What utility type selects specific properties?",
    correct: "Pick",
    options: ["Pick", "Select", "Extract", "Choose"],
    hint: "Like picking items from a menu — you choose which properties to keep.",
    explanation: "Pick<T, K> constructs a type by selecting a subset of properties from T. For example, Pick<User, 'name' | 'email'> creates a type with only the name and email properties from User."
  },
  {
    code: `type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;`,
    highlight: { start: 0, end: 64 },
    question: "What utility type removes specific properties?",
    correct: "Omit",
    options: ["Omit", "Exclude", "Remove", "Without"],
    hint: "The opposite of Pick — you specify which properties to leave out.",
    explanation: "Omit<T, K> constructs a type by removing specified properties from T. It's implemented using Pick and Exclude internally, and is the inverse of Pick \u2014 useful for creating types without certain fields."
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
    hint: "A reusable function starting with 'use' that composes built-in hooks.",
    explanation: "A custom hook is a function starting with 'use' that composes other hooks to extract reusable stateful logic. Unlike components, custom hooks return data and functions rather than JSX."
  },
  {
    code: `type Awaited<T> = T extends Promise<infer U> ? U : T;`,
    highlight: { start: 0, end: 52 },
    question: "What utility type unwraps Promises?",
    correct: "Awaited",
    options: ["Awaited", "Unwrap", "Resolve", "PromiseResult"],
    hint: "It extracts the resolved value type, like what you get after using await.",
    explanation: "Awaited<T> recursively unwraps Promise types to get the resolved value type. Awaited<Promise<string>> gives string, and it even handles nested promises like Promise<Promise<number>> giving number."
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

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
    explanation: "A parameter is a variable listed in a function's declaration — it defines what the function expects. An argument is the actual value passed at the call site. A common confusion: 'property' describes a key on an object, and 'variable' is a broader term for any named storage — neither specifically describes a function's input slot."
  },
  {
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: { start: 17, end: 34 },
    question: "What is this string syntax called?",
    correct: "template literal",
    options: ["template literal", "string literal", "format string", "interpolated string"],
    hint: "It uses backticks instead of quotes.",
    explanation: "Template literals use backticks (`) instead of quotes and allow embedded expressions via ${}. A regular string literal uses single or double quotes and doesn't support interpolation. 'Format string' and 'interpolated string' are terms from other languages (Python, C#) — in JavaScript, the official term is template literal."
  },
  {
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: { start: 25, end: 32 },
    question: "What is the highlighted syntax called?",
    correct: "string interpolation",
    options: ["string interpolation", "variable injection", "placeholder", "expression slot"],
    hint: "This ${} syntax embeds an expression inside a string.",
    explanation: "String interpolation is the process of embedding expressions inside a string using ${expression} syntax within a template literal. It's not called a 'placeholder' (that implies something to be filled in later) — the expression is evaluated immediately when the string is created."
  },
  {
    code: `import { useState } from 'react';`,
    highlight: { start: 7, end: 19 },
    question: "What type of import is this?",
    correct: "named import",
    options: ["named import", "default import", "namespace import", "side effect import"],
    hint: "The curly braces indicate a specific export is being selected by name.",
    explanation: "Named imports use curly braces to import specific exports by their exact name. A default import doesn't use braces (e.g., import React from 'react'). A namespace import uses * as name to grab everything. A side effect import has no bindings at all (e.g., import './styles.css')."
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
    explanation: "Method chaining calls multiple methods in sequence, where each method returns an object that the next method is called on. This isn't a 'pipeline' (which pipes output through standalone functions) or a 'cascade' (which returns 'this' regardless). It works because array methods like filter() and map() return new arrays."
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
    explanation: "A default parameter provides a fallback value using = syntax in the function declaration. This is different from an optional parameter (TypeScript's ? syntax), which allows omitting the argument but doesn't assign a value — it just becomes undefined. 'Fallback parameter' and 'preset parameter' aren't standard terms."
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
    explanation: "A rest parameter uses ...name syntax to collect all remaining arguments into a single array. The key confusion: spread syntax looks identical (...) but does the opposite — it expands an array into individual elements. Rest gathers, spread scatters. 'Variadic parameter' is the concept from other languages; JavaScript's specific term is rest parameter."
  },
  {
    code: `const element = <h1>Hello World</h1>;`,
    highlight: { start: 16, end: 36 },
    question: "What is this syntax called?",
    correct: "JSX",
    options: ["JSX", "HTML", "XML", "template"],
    hint: "This HTML-like syntax is used inside JavaScript, typically with React.",
    explanation: "JSX (JavaScript XML) is a syntax extension that lets you write HTML-like markup inside JavaScript. It looks like HTML but isn't — JSX gets compiled to JavaScript function calls (React.createElement). XML is a generic data format, and 'template' usually refers to template literals or templating engines."
  },
  {
    code: `const colors = ['red', 'green', 'blue'];
const last = colors.pop();`,
    highlight: { start: 54, end: 67 },
    question: "What does this method do?",
    correct: "removes the last element",
    options: ["removes the last element", "adds an element", "returns the length", "finds an element"],
    hint: "Sometimes people use a stack of spring-loaded plates as a cafeteria as the analogy here. What makes those plates 'pop' upwards?.",
    explanation: "Array.pop() removes and returns the last element of the array, mutating the original array. It doesn't 'add' an element (that's push()), doesn't return the length (that's the .length property), and doesn't search for elements (that's find() or indexOf())."
  },
  {
    code: `const numbers = [1, 2, 3];
numbers.push(4);`,
    highlight: { start: 27, end: 42 },
    question: "What does this method do?",
    correct: "adds to the end",
    options: ["adds to the end", "adds to the start", "removes from end", "removes from start"],
    hint: "Sometimes people use a stack of spring-loaded plates as a cafeteria as the analogy here. What makes those plates 'push' downwards?.",
    explanation: "Array.push() adds one or more elements to the end of an array and returns the new length. It doesn't add to the start (that's unshift()), and it doesn't remove elements (pop() removes from the end, shift() removes from the start). Push and pop work on the end; unshift and shift work on the beginning."
  },
  {
    code: `const text = 'hello world';
const upper = text.toUpperCase();`,
    highlight: { start: 42, end: 60 },
    question: "What type of method is this?",
    correct: "string method",
    options: ["string method", "array method", "object method", "number method"],
    hint: "Look at the type of value that text holds — it's a word in quotes.",
    explanation: "toUpperCase() is a string method because it's called on a string value. The key clue is what type 'text' holds — it's assigned a quoted value, making it a string. Array methods like .map() or .filter() only exist on arrays, and number methods like .toFixed() only exist on numbers."
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
    explanation: "An argument is the actual value passed when calling a function. The key distinction: parameters appear in the function declaration (they're the variable names), while arguments appear at the call site (they're the concrete values). Here, 'Alice' is the argument being passed to the name parameter."
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
    explanation: "The function body is the code between the curly braces { } that executes when the function is called. It's not just a 'code block' (which is any { } block, including if/for blocks) — 'function body' specifically refers to the block belonging to a function. A 'statement' is a single instruction, and an 'expression' produces a value."
  },
  {
    code: `const numbers = [1, 2, 3, 4, 5];`,
    highlight: { start: 16, end: 31 },
    question: "What are these symbols called?",
    correct: "square brackets",
    options: ["square brackets", "curly braces", "parentheses", "angle brackets"],
    hint: "These [ ] symbols are commonly used to define arrays.",
    explanation: "Square brackets [ ] are used to create arrays and to access elements by index. Curly braces { } define objects and code blocks, parentheses ( ) group expressions and function parameters, and angle brackets < > are used for generics in TypeScript and for JSX tags."
  },
  {
    code: `const person = { name: 'Alice', age: 30 };`,
    highlight: { start: 15, end: 41 },
    question: "What are these symbols called?",
    correct: "curly braces",
    options: ["curly braces", "square brackets", "parentheses", "angle brackets"],
    hint: "These { } symbols are commonly used to define objects.",
    explanation: "Curly braces { } define object literals, code blocks, and destructuring patterns. They're not square brackets [ ] (which create arrays), not parentheses ( ) (which group expressions), and not angle brackets < > (which are used for generics and JSX)."
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
    explanation: "Parentheses ( ) surround function parameters in declarations and arguments in calls. They also group expressions to control evaluation order. Curly braces { } enclose code blocks, square brackets [ ] define arrays, and angle brackets < > are used for type parameters in TypeScript."
  },
  {
    code: `interface User {
  name: string;
  age: number;
}`,
    highlight: { start: 19, end: 32 },
    question: "What is the highlighted part called?",
    correct: "property",
    options: ["property", "field", "attribute", "member"],
    hint: "In an interface, each key-value pair declaration is called a ___.",
    explanation: "In TypeScript interfaces, each declaration like 'name: string' is a property definition. While 'field' and 'member' are used in other languages (Java, C#), JavaScript and TypeScript consistently use 'property' for object and interface key-value declarations. 'Attribute' is typically reserved for HTML elements."
  },
  {
    code: `const fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]);`,
    highlight: { start: 64, end: 69 },
    question: "What is the highlighted part called?",
    correct: "index",
    options: ["index", "key", "position", "offset"],
    hint: "The number inside square brackets refers to a position in the array.",
    explanation: "An array index is the numeric position used to access elements, starting at 0. A 'key' is used for object properties (string-based), not array positions. 'Position' and 'offset' aren't standard JavaScript terminology — the spec and docs consistently call it an index."
  },
  {
    code: `const add = (a, b) => a + b;`,
    highlight: { start: 12, end: 27 },
    question: "What is this syntax called?",
    correct: "arrow function",
    options: ["arrow function", "lambda", "anonymous function", "inline function"],
    hint: "The => symbol gives this ES6 function syntax its name.",
    explanation: "Arrow functions use the => syntax introduced in ES6. They provide a shorter syntax than function expressions and lexically bind the 'this' value. While 'lambda' is the equivalent concept in other languages and 'anonymous function' describes any unnamed function, JavaScript specifically calls this syntax an arrow function."
  },
  {
    code: `const point = { x: 10, y: 20 };`,
    highlight: { start: 14, end: 30 },
    question: "What is this syntax called?",
    correct: "object literal",
    options: ["object literal", "object notation", "hash", "dictionary"],
    hint: "This creates an object directly in code using { key: value } syntax.",
    explanation: "An object literal creates an object directly using { key: value } syntax. It's called a 'literal' because you write the object's contents literally in code, as opposed to using new Object(). 'Hash' and 'dictionary' are terms from Ruby and Python — JavaScript calls them objects or object literals."
  },
  {
    code: `const doubled = numbers.map(n => n * 2);`,
    highlight: { start: 28, end: 40 },
    question: "What is the function passed to map called?",
    correct: "callback",
    options: ["callback", "lambda", "handler", "delegate"],
    hint: "A function passed as an argument to another function, to be 'called back' later.",
    explanation: "A callback is a function passed as an argument to another function, to be called later. Here, n => n * 2 is passed to map(), which 'calls it back' for each element. While it is technically a 'lambda' (anonymous function), the term 'callback' specifically describes the pattern of passing a function to be invoked by another function."
  },
  {
    code: `const USER_FIRST_NAME = 'Alice';`,
    highlight: { start: 6, end: 21 },
    question: "What naming convention is used here?",
    correct: "snake case",
    options: ["snake case", "camel case", "kebab case", "pascal case"],
    hint: "The words are separated by underscores, which look like they're crawling on the ground.",
    explanation: "This is SCREAMING_SNAKE_CASE, a variant of snake case that uses underscores with all uppercase letters. Camel case joins words with capital letters (userFirstName), kebab case uses hyphens (user-first-name), and pascal case capitalizes every word including the first (UserFirstName)."
  },
  {
    code: `const userFirstName = 'Alice';`,
    highlight: { start: 6, end: 19 },
    question: "What naming convention is used here?",
    correct: "camel case",
    options: ["camel case", "snake case", "pascal case", "kebab case"],
    hint: "Each new word starts with an uppercase letter, forming 'humps'…",
    explanation: "Camel case joins words with no separator, capitalizing each word after the first (userFirstName). The difference from pascal case: pascal case capitalizes the first word too (UserFirstName). Snake case uses underscores (user_first_name), and kebab case uses hyphens (user-first-name)."
  },
  {
    code: `<div class="user-profile-card">Hello</div>`,
    highlight: { start: 12, end: 29 },
    question: "What naming convention is used in this CSS class?",
    correct: "kebab case",
    options: ["kebab case", "snake case", "camel case", "train case"],
    hint: "The words are separated by hyphens, like items on a skewer.",
    explanation: "Kebab case uses hyphens to separate words (user-profile-card). It's the standard for CSS class names and URL slugs. Train case is similar but capitalizes each word (User-Profile-Card). Snake case uses underscores instead of hyphens, and camel case removes all separators."
  },
  {
    code: `const isActive = true;
const message = isActive ? 'yes' : 'no';`,
    highlight: { start: 39, end: 62 },
    question: "What is this operator called?",
    correct: "ternary operator",
    options: ["ternary operator", "comparison operator", "inline if", "expression"],
    hint: "This condition ? valueIfTrue : valueIfFalse operator has three parts.",
    explanation: "The ternary operator (condition ? a : b) is the only JavaScript operator that takes three operands. It's not just a 'comparison operator' (those are ===, !==, <, >, etc.) — the ternary evaluates a condition and returns one of two values. 'Inline if' describes what it does, but the official name is the conditional (ternary) operator."
  },
  {
    code: `const nums = [1, 2, 3].map(n => n * 2);`,
    highlight: { start: 13, end: 38 },
    question: "What does map() return?",
    correct: "new array",
    options: ["new array", "modified array", "undefined", "boolean"],
    hint: "map() does not mutate the original — it creates something fresh.",
    explanation: "Array.map() always returns a new array of the same length, with each element transformed by the callback. It never mutates the original array — this is a key principle. 'Modified array' is wrong because the original stays unchanged. It doesn't return undefined (that's forEach's return value) or a boolean (that's some/every)."
  },
  {
    code: `const found = [1, 2, 3, 4].find(n => n > 2);`,
    highlight: { start: 14, end: 43 },
    question: "What does find() return?",
    correct: "first matching element",
    options: ["first matching element", "all matches", "boolean", "index"],
    hint: "It stops searching as soon as it finds one element that passes the test.",
    explanation: "Array.find() returns the first element that satisfies the test function, then stops iterating. It doesn't return all matches (that's filter()), a boolean (that's some() or every()), or an index (that's findIndex()). If no element matches, find() returns undefined."
  },
  {
    code: `const hasEven = [1, 2, 3].some(n => n % 2 === 0);`,
    highlight: { start: 16, end: 48 },
    question: "What does some() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"],
    hint: "It answers a yes/no question: does at least one element pass the test?",
    explanation: "Array.some() returns true if at least one element passes the test, false otherwise. Unlike filter() (which returns an array of matches) or find() (which returns the element itself), some() only answers a yes/no question. It short-circuits: once it finds a passing element, it stops."
  },
  {
    code: `const allPositive = [1, 2, 3].every(n => n > 0);`,
    highlight: { start: 20, end: 47 },
    question: "What does every() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"],
    hint: "It answers a yes/no question: do ALL elements pass the test?",
    explanation: "Array.every() returns true only if all elements pass the test, false otherwise. Like some(), it returns a boolean — not an array (that's filter/map), a number (that's reduce), or a single element (that's find). It short-circuits on the first failure."
  },
  {
    code: `const [count, setCount] = useState(0);`,
    highlight: { start: 26, end: 37 },
    question: "What React feature is being used here?",
    correct: "hook",
    options: ["hook", "component", "prop", "context"],
    hint: "Functions starting with 'use' that let you 'hook into' React features.",
    explanation: "React hooks are functions starting with 'use' that let functional components manage state, effects, and other React features. A component returns JSX and renders UI. A prop is data passed from parent to child. Context is a specific mechanism for sharing data without prop drilling — useState is a hook, not a context."
  },
  {
    code: `<button onClick={() => setCount(count + 1)}>
  Click me
</button>`,
    highlight: { start: 8, end: 15 },
    question: "What is this attribute called in React?",
    correct: "event handler",
    options: ["event handler", "callback prop", "action", "listener"],
    hint: "This function responds to a user interaction like a click.",
    explanation: "An event handler is a function assigned to respond to user interactions like clicks, keypresses, or form submissions. While it is technically a 'callback prop' (a function passed as a prop), the specific term for a prop that responds to DOM events is event handler. In React, they use camelCase naming (onClick, not onclick)."
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
    explanation: "Generics use angle brackets <T> to create reusable types that work with different data types. Array<number> means 'an array specifically containing numbers.' While 'type parameter' refers to the T inside the brackets, the overall feature is called generics. A 'type annotation' (like : string) simply labels a variable's type without parameterization."
  },
  {
    code: `type Status = 'active' | 'inactive' | 'pending';`,
    highlight: { start: 14, end: 47 },
    question: "What is the highlighted part called?",
    correct: "union type",
    options: ["union type", "intersection type", "literal type", "enum"],
    hint: "The | (pipe) operator combines multiple types into one 'this OR that' type.",
    explanation: "A union type uses the | operator to declare that a value can be one of several types. An intersection type uses & and requires all types at once. An enum defines named constants \u2014 while similar in effect, union types are more flexible. Each option here is a string literal type; the | combines them into a union."
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
    explanation: "A return type annotation after the parentheses declares what type a function will return. It's placed after the parameter list, separated by a colon. 'Type hint' is Python's term for this concept. 'Output signature' and 'output type' aren't standard TypeScript terminology \u2014 the official term is return type annotation."
  },
  {
    code: `const user = { name: 'Alice', age: 30, city: 'NYC' };
const { name, age } = user;`,
    highlight: { start: 60, end: 73 },
    question: "What is this syntax called?",
    correct: "destructuring",
    options: ["destructuring", "unpacking", "pattern matching", "extraction"],
    hint: "This syntax extracts values from an object into individual variables.",
    explanation: "Destructuring extracts values from objects or arrays into distinct variables using a pattern that mirrors the data structure. It's not 'unpacking' (Python's term) or 'pattern matching' (a broader concept involving conditional checks). Destructuring simply creates variables from an existing structure \u2014 const { name, age } = user creates variables name and age from the user object."
  },
  {
    code: `const oldArr = [1, 2, 3];
const newArr = [...oldArr, 4, 5];`,
    highlight: { start: 42, end: 51 },
    question: "What is this syntax called?",
    correct: "spread syntax",
    options: ["spread syntax", "rest syntax", "destructuring", "expansion"],
    hint: "The three dots (...) expand an iterable's elements into a new array.",
    explanation: "Spread syntax (...) expands an iterable's elements in place. The critical distinction from rest syntax: spread appears in array literals or function calls to expand elements, while rest appears in function parameters or destructuring patterns to collect them. Here, ...oldArr expands into the new array \u2014 it's spreading, not resting."
  },
  {
    code: `const user = { profile: { name: 'Alice' } };
const name = user?.profile?.name;`,
    highlight: { start: 62, end: 77 },
    question: "What is this operator called?",
    correct: "optional chaining",
    options: ["optional chaining", "safe navigation", "null check", "elvis operator"],
    hint: "The ?. operator safely accesses properties that might be null or undefined.",
    explanation: "Optional chaining (?.) short-circuits to undefined if the left side is null or undefined, preventing 'cannot read property of null' errors. It's not a 'null check' (which is an explicit if statement) or an 'elvis operator' (which is ?:, a different concept from other languages). Safe navigation is what some languages call it, but JavaScript's official name is optional chaining."
  },
  {
    code: `function getValue(input?: string) {
  return input ?? 'default';
}`,
    highlight: { start: 51, end: 66 },
    question: "What is this operator called?",
    correct: "nullish coalescing",
    options: ["nullish coalescing", "default operator", "fallback operator", "NaN operator"],
    hint: "The ?? operator provides a fallback only for null or undefined values.",
    explanation: "The nullish coalescing operator (??) returns the right operand only when the left is null or undefined. The key distinction from || (logical OR): || triggers on any falsy value (0, '', false), while ?? only triggers on null and undefined. This matters when 0 or empty string are valid values you want to keep."
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
    explanation: "Inheritance (via extends) lets a child class receive all properties and methods from a parent class. Composition is a different pattern where objects contain other objects rather than inheriting from them. 'Extension' describes the act, but the OOP concept is called inheritance. 'Implementation' in TypeScript refers to the implements keyword for interfaces, not class extension."
  },
  {
    code: `type ID = string | number;`,
    highlight: { start: 0, end: 25 },
    question: "What is this declaration called?",
    correct: "type alias",
    options: ["type alias", "type definition", "typedef", "interface"],
    hint: "The 'type' keyword gives a new name to an existing type expression.",
    explanation: "A type alias gives a name to any type expression using the type keyword. Unlike an interface (which can only describe object shapes and can be extended), type aliases can name unions, intersections, tuples, primitives, and any other type expression. 'Typedef' is C/C++ terminology \u2014 TypeScript uses 'type alias.'"
  },
  {
    code: `type Coordinates = [number, number];`,
    highlight: { start: 19, end: 35 },
    question: "What is this type called?",
    correct: "tuple",
    options: ["tuple", "array", "pair", "vector"],
    hint: "This is a fixed-length array where each position has a specific type.",
    explanation: "A tuple is a fixed-length array where each position has a known, specific type. [number, number] always has exactly two elements, both numbers. Unlike a regular array type (number[]), a tuple has a fixed length and can have different types per position, like [string, number]. 'Pair' and 'vector' aren't TypeScript types."
  },
  {
    code: `function outer() {
  const x = 10;
  return function inner() {
    return x;
  };
}`,
    highlight: { start: 44, end: 80 },
    question: "What JavaScript concept is demonstrated here?",
    correct: "closure",
    options: ["closure", "scope", "hoisting", "recursion"],
    hint: "The inner function 'remembers' the variable x from its outer function.",
    explanation: "A closure is a function that retains access to variables from its enclosing scope, even after that scope has finished executing. This isn't just 'scope' (which defines where variables are accessible) \u2014 a closure specifically captures and preserves that scope. It's not hoisting (which moves declarations to the top) or recursion (where a function calls itself)."
  },
  {
    code: `console.log(x);
var x = 5;`,
    highlight: { start: 0, end: 26 },
    question: "What JavaScript behavior causes x to be undefined here?",
    correct: "hoisting",
    options: ["hoisting", "closure", "scoping", "coercion"],
    hint: "Variable declarations with var are moved to the top of their scope.",
    explanation: "Hoisting moves var declarations (but not their assignments) to the top of their scope during compilation. So var x exists when console.log runs, but its value hasn't been assigned yet, resulting in undefined. This isn't a closure (which preserves scope across function boundaries), scoping (which defines variable visibility), or coercion (which converts between types)."
  },
  {
    code: `async function loadUser(id: number) {
  const data = await fetchUser(id);
  return data;
}`,
    highlight: { start: 53, end: 72 },
    question: "What does the `await` keyword pause execution for?",
    correct: "Promise",
    options: ["Promise", "Callback", "Observable", "Event"],
    hint: "This object represents a value that may not be available yet but will resolve later.",
    explanation: "The await keyword pauses an async function until a Promise settles. A Promise represents an asynchronous operation with three states: pending, fulfilled, or rejected. Callbacks are an older pattern for handling async code but aren't what await operates on. Observables (from RxJS) handle streams of values — Promises handle a single future value."
  },
  {
    code: `const double = (x) => x * 2;
const numbers = [1, 2, 3].map(double);`,
    highlight: { start: 0, end: 28 },
    question: "What type of function is this?",
    correct: "pure function",
    options: ["pure function", "impure function", "side effect", "closure"],
    hint: "It always returns the same output for the same input and has no side effects.",
    explanation: "A pure function always returns the same output for the same input and produces no side effects. An impure function would modify external state or depend on it (like reading a global variable). This isn't a closure (though a pure function can be one) or a side effect (which is something a pure function avoids by definition)."
  },
  {
    code: `useEffect(() => {
  document.title = 'Hello';
}, []);`,
    highlight: { start: 0, end: 9 },
    question: "What is this React hook used for?",
    correct: "side effects",
    options: ["side effects", "state management", "memoization", "context"],
    hint: "This hook runs code that interacts with things outside the component, like the DOM.",
    explanation: "useEffect runs code that produces side effects \u2014 interactions with systems outside React's rendering, like DOM manipulation, API calls, or subscriptions. It's not for state management (that's useState/useReducer), memoization (that's useMemo/useCallback), or context (that's useContext). The empty [] dependency array means it runs once after the first render."
  },
  {
    code: `useEffect(() => {
  fetchData();
}, [userId]);`,
    highlight: { start: 36, end: 46 },
    question: "What is this array called in useEffect?",
    correct: "dependency array",
    options: ["dependency array", "watch list", "trigger array", "effect list"],
    hint: "The effect re-runs whenever a value in this array changes.",
    explanation: "The dependency array tells useEffect when to re-run. The effect fires whenever any value in this array changes between renders. It's not a 'watch list' or 'trigger array' \u2014 those aren't React concepts. Key rule: an empty [] means 'run once on mount'; omitting the array entirely means 'run after every render.'"
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
    explanation: "Props destructuring extracts specific properties from the props object directly in the function parameters. This isn't 'parameter spread' (which would use ... to pass all props through) \u2014 destructuring selects specific properties. It's standard JavaScript destructuring applied to React's props object."
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
    explanation: "React uses the key prop to uniquely identify list items so it can efficiently track which items have changed, been added, or removed during re-renders. It's not for styling, indexing data, or sorting \u2014 it's purely a React reconciliation optimization. Keys should be stable, unique identifiers; using array indices can cause bugs when the list reorders."
  },
  {
    code: `type AdminUser = User & Admin;`,
    highlight: { start: 22, end: 30 },
    question: "What operator creates an intersection type?",
    correct: "ampersand",
    options: ["ampersand", "pipe", "plus", "asterisk"],
    hint: "This & symbol means a type must satisfy ALL of the combined types.",
    explanation: "The ampersand (&) creates an intersection type, meaning the resulting type must have ALL properties from both types. The pipe (|) creates a union type (one OR the other) \u2014 the ampersand requires both. User & Admin has everything from User AND everything from Admin combined into a single type."
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
    explanation: "A type assertion (value as Type) tells TypeScript to treat a value as a specific type. Unlike type casting or type conversion in other languages, assertions don't transform the value at runtime \u2014 they only affect compile-time type checking. Type coercion is JavaScript's automatic runtime conversion (like '5' * 1 becoming 5), which is a completely different concept."
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
    explanation: "A type predicate (value is Type) in a return type tells TypeScript to narrow the type of the parameter when the function returns true. 'Type narrowing' is the broader concept (it includes typeof checks, instanceof, etc.) — a type predicate is a specific mechanism for creating custom type guards. A type assertion (as Type) forces the type without checking; a predicate proves it."
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
    explanation: "An index signature [key: string]: type allows an object to have any number of properties with string keys. A computed property ([expression]: value) evaluates an expression as a key in an object literal — that's a different concept. An 'indexer' is C#'s term. Index signatures define a contract for dynamically-named properties whose types are known."
  },
  {
    code: `type IsString<T> = T extends string ? T : never;`,
    highlight: { start: 19, end: 47 },
    question: "What is this type called?",
    correct: "conditional type",
    options: ["conditional type", "ternary type", "generic constraint", "mapped type"],
    hint: "It uses the same ? : pattern as an if/else, but at the type level.",
    explanation: "A conditional type uses T extends U ? X : Y syntax to choose between types based on a condition, evaluated at compile time. While the ? : syntax looks like the ternary operator, this is a type-level construct. It's not a 'generic constraint' (which uses extends to limit type parameters) or a 'mapped type' (which iterates over keys with [P in keyof T])."
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
    explanation: "A mapped type iterates over the keys of another type using [P in keyof T] and transforms each property. The 'in' keyword is the distinguishing feature — conditional types use extends ? :, while mapped types use in to loop. An indexed type uses T[K] to look up a single property. Partial<T> makes every property optional by adding ? to each one."
  },
  {
    code: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;`,
    highlight: { start: 51, end: 58 },
    question: "What keyword extracts a type from a pattern?",
    correct: "infer",
    options: ["infer", "extract", "typeof", "keyof"],
    hint: "This keyword lets TypeScript deduce a type variable from within a conditional type.",
    explanation: "The infer keyword declares a type variable within a conditional type that TypeScript will fill in automatically. It's not extract (that's a utility type), typeof (which gets a value's type at the type level), or keyof (which gets an object type's keys). Infer is unique: it lets TypeScript deduce a type from a pattern, like extracting R from a function's return type."
  },
  {
    code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };`,
    highlight: { start: 19, end: 33 },
    question: "What property enables discriminated unions?",
    correct: "discriminant",
    options: ["discriminant", "enumerator", "identifier", "selector"],
    hint: "This shared property with literal types lets TypeScript narrow which variant you have.",
    explanation: "A discriminant is a shared property (like kind) with literal types that lets TypeScript narrow a union to a specific variant. It's not an 'identifier' (a general programming term for names) or a 'selector' (a CSS concept). The discriminant must be a common property across all union members with distinct literal types, enabling TypeScript to narrow automatically."
  },
  {
    code: `function process<T extends { id: number }>(item: T) {
  return item.id;
}`,
    highlight: { start: 16, end: 42 },
    question: "What is this syntax called?",
    correct: "generic constraint",
    options: ["generic constraint", "type bound", "type limit", "interface requirement"],
    hint: "The 'extends' keyword limits what types T can be, requiring certain properties.",
    explanation: "A generic constraint (T extends Type) restricts what types can be used as a type argument. 'Extends' here means 'must be assignable to,' not class inheritance. A 'type bound' is Java's term for this concept. An interface requirement would use 'implements' — extends in a generic context specifically constrains the type parameter."
  },
  {
    code: `type NonNullable<T> = T extends null | undefined ? never : T;`,
    highlight: { start: 51, end: 61 },
    question: "What type represents an impossible value?",
    correct: "never",
    options: ["never", "void", "null", "undefined"],
    hint: "A function that always throws or an exhausted conditional produces this bottom type.",
    explanation: "The never type represents values that never occur \u2014 functions that always throw, infinite loops, or exhausted type narrowing. It's different from void (which means 'no return value' \u2014 the function completes but returns nothing), null (an intentional empty value), and undefined (an unset value). Never means the code point is truly unreachable."
  },
  {
    code: `type EventNames = \`on\${Capitalize<string>}\`;`,
    highlight: { start: 18, end: 43 },
    question: "What is this type syntax called?",
    correct: "template literal type",
    options: ["template literal type", "string pattern type", "format type", "interpolated type"],
    hint: "It uses backtick syntax at the type level to create string patterns.",
    explanation: "Template literal types use backtick syntax at the type level to create string pattern types. They're not 'string pattern types' (not an official term) or 'format types.' Template literal types mirror runtime template literals but operate on types, letting you combine string literal types to generate permitted string shapes like 'onClick' | 'onHover'."
  },
  {
    code: `type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};`,
    highlight: { start: 52, end: 70 },
    question: "What kind of type is this?",
    correct: "recursive type",
    options: ["recursive type", "nested type", "deep type", "self-referential type"],
    hint: "This type references itself in its own definition — like a function calling itself.",
    explanation: "A recursive type references itself in its definition, like a function calling itself. 'Nested type' just means types within types — it doesn't imply self-reference. 'Self-referential type' describes the concept but isn't the standard term. Recursive types are essential for modeling tree structures, linked lists, and deeply nested objects like DeepReadonly."
  },
  {
    code: `function useCustomHook(initialValue: number) {
  const [value, setValue] = useState(initialValue);
  return { value, increment: () => setValue(v => v + 1) };
}`,
    highlight: { start: 9, end: 22 },
    question: "What React pattern is this?",
    correct: "custom hook",
    options: ["custom hook", "higher-order component", "render prop", "compound component"],
    hint: "A reusable function starting with 'use' that composes built-in hooks.",
    explanation: "A custom hook is a function starting with 'use' that composes other hooks to extract reusable stateful logic. A higher-order component (HOC) wraps a component to add behavior — that's the older pattern. Render props pass a function as a child. Custom hooks are the modern React pattern for logic reuse, returning data and functions rather than JSX."
  },
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

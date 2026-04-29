type Highlight = string;

export interface Question {
  code: string;
  highlight: Highlight;
  question: string;
  correct: string;
  options: string[];
  hint: string;
  explanation: string;
  docsLink?: string;
}

export interface Level {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  questions: Question[];
  color: string;
}

const level1Questions: Question[] = [
  {
    code: `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`,
    highlight: "name",
    question: "What is the highlighted part called?",
    correct: "parameter",
    options: ["parameter", "argument", "property", "variable"],
    hint: "This appears in the function declaration, not at the call site.",
    explanation:
      "A parameter is a variable listed in a function's declaration — it defines what the function expects. An argument is the actual value passed at the call site. A common confusion: 'property' describes a key on an object, and 'variable' is a broader term for any named storage — neither specifically describes a function's input slot.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Glossary/Parameter",
  },
  {
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: `\`Hello, \${name}!\``,
    question: "What is this string syntax called?",
    correct: "template literal",
    options: ["template literal", "string literal", "format string", "interpolated string"],
    hint: "It uses backticks instead of quotes.",
    explanation:
      "Template literals use backtick characters instead of quotes and allow embedded expressions via `${}`. A regular string literal uses single or double quotes and doesn't support interpolation. 'Format string' and 'interpolated string' are terms from other languages (Python, C#) — in JavaScript, the official term is template literal.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals",
  },
  {
    code: `const greeting = \`Hello, \${name}!\`;`,
    highlight: "${name}",
    question: "What is the highlighted syntax called?",
    correct: "string interpolation",
    options: ["string interpolation", "variable injection", "placeholder", "expression slot"],
    hint: "This ${} syntax embeds an expression inside a string.",
    explanation:
      "String interpolation is the process of embedding expressions inside a string using `${expression}` syntax within a template literal. It's not called a 'placeholder' (that implies something to be filled in later) — the expression is evaluated immediately when the string is created.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#string_interpolation",
  },
  {
    code: `import { useState } from 'react';`,
    highlight: "{ useState }",
    question: "What type of import is this?",
    correct: "named import",
    options: ["named import", "default import", "namespace import", "side effect import"],
    hint: "The curly braces indicate a specific export is being selected by name.",
    explanation:
      "Named imports use curly braces to import specific exports by their exact name. A default import doesn't use braces (e.g., `import React from 'react'`). A namespace import uses `* as name` to grab everything. A side effect import has no bindings at all (e.g., `import './styles.css'`).",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import",
  },
  {
    code: `const doubled = numbers
  .filter(n => n > 0)
  .map(n => n * 2);`,
    highlight: `.filter(n => n > 0)
  .map(n => n * 2)`,
    question: "What is this programming pattern called?",
    correct: "method chaining",
    options: ["method chaining", "pipeline", "fluent interface", "cascade"],
    hint: "Each method call returns an object, letting the next call be appended with a dot.",
    explanation:
      "Method chaining calls multiple methods in sequence, where each method returns an object that the next method is called on. This isn't a 'pipeline' (which pipes output through standalone functions) or a 'cascade' (which returns `this` regardless). It works because array methods like `filter()` and `map()` return new arrays.",
  },
  {
    code: `function greet(name = 'World') {
  return \`Hello, \${name}!\`;
}`,
    highlight: "name = 'World'",
    question: "What is this parameter syntax called?",
    correct: "default parameter",
    options: ["default parameter", "optional parameter", "fallback parameter", "preset parameter"],
    hint: "The = sign assigns a value that's used when no argument is provided.",
    explanation:
      "A default parameter provides a fallback value using `=` syntax in the function declaration. This is different from an optional parameter (TypeScript's `?` syntax), which allows omitting the argument but doesn't assign a value — it just becomes `undefined`. 'Fallback parameter' and 'preset parameter' aren't standard terms.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters",
  },
  {
    code: `function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}`,
    highlight: "...numbers",
    question: "What is this parameter syntax called?",
    correct: "rest parameter",
    options: ["rest parameter", "spread parameter", "variadic parameter", "collect parameter"],
    hint: "The three dots (...) collect all remaining arguments into an array.",
    explanation:
      "A rest parameter uses `...name` syntax to collect all remaining arguments into a single array. The key confusion: spread syntax looks identical (`...`) but does the opposite — it expands an array into individual elements. Rest gathers, spread scatters. 'Variadic parameter' is the concept from other languages; JavaScript's specific term is rest parameter.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters",
  },
  {
    code: `const element = <h1>Hello World</h1>;`,
    highlight: "<h1>Hello World</h1>",
    question: "What is this syntax called?",
    correct: "JSX",
    options: ["JSX", "HTML", "XML", "template"],
    hint: "This HTML-like syntax is used inside JavaScript, typically with React.",
    explanation:
      "JSX (JavaScript XML) is a syntax extension that lets you write HTML-like markup inside JavaScript. It looks like HTML but isn't — JSX gets compiled to JavaScript function calls (`React.createElement`). XML is a generic data format, and 'template' usually refers to template literals or templating engines.",
    docsLink: "https://react.dev/learn/writing-markup-with-jsx",
  },
  {
    code: `const colors = ['red', 'green', 'blue'];
const last = colors.pop();`,
    highlight: "colors.pop();",
    question: "What does this method do?",
    correct: "removes the last element",
    options: [
      "removes the last element",
      "adds an element",
      "returns the length",
      "finds an element",
    ],
    hint: "Sometimes people use a stack of spring-loaded plates as a cafeteria as the analogy here. What makes those plates 'pop' upwards?.",
    explanation:
      "`Array.pop()` removes and returns the last element of the array, mutating the original array. It doesn't 'add' an element (that's `push()`), doesn't return the length (that's the `.length` property), and doesn't search for elements (that's `find()` or `indexOf()`).",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop",
  },
  {
    code: `const numbers = [1, 2, 3];
numbers.push(4);`,
    highlight: "numbers.push(4)",
    question: "What does this method do?",
    correct: "adds to the end",
    options: ["adds to the end", "adds to the start", "removes from end", "removes from start"],
    hint: "Sometimes people use a stack of spring-loaded plates as a cafeteria as the analogy here. What makes those plates 'push' downwards?.",
    explanation:
      "`Array.push()` adds one or more elements to the end of an array and returns the new length. It doesn't add to the start (that's `unshift()`), and it doesn't remove elements (`pop()` removes from the end, `shift()` removes from the start). Push and pop work on the end; unshift and shift work on the beginning.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push",
  },
  {
    code: `const text = 'hello world';
const upper = text.toUpperCase();`,
    highlight: "text.toUpperCase()",
    question: "What type of method is this?",
    correct: "string method",
    options: ["string method", "array method", "object method", "number method"],
    hint: "Look at the type of value that text holds — it's a word in quotes.",
    explanation:
      "`toUpperCase()` is a string method because it's called on a string value. The key clue is what type 'text' holds — it's assigned a quoted value, making it a string. Array methods like `.map()` or `.filter()` only exist on arrays, and number methods like `.toFixed()` only exist on numbers.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase",
  },
  {
    code: `function greet(name: string) {
  return \`Hello, \${name}!\`;
}
greet('Alice');`,
    highlight: "'Alice'",
    question: "What is the highlighted part called?",
    correct: "argument",
    options: ["argument", "parameter", "property", "value"],
    hint: "This is the actual value passed when calling (invoking) the function.",
    explanation:
      "An argument is the actual value passed when calling a function. The key distinction: parameters appear in the function declaration (they're the variable names), while arguments appear at the call site (they're the concrete values). Here, `'Alice'` is the argument being passed to the `name` parameter.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Glossary/Argument",
  },
  {
    code: `function calculate(a: number, b: number) {
  return a + b;
}`,
    highlight: `{
  return a + b;
}`,
    question: "What is the highlighted part called?",
    correct: "function body",
    options: ["function body", "code block", "statement", "expression"],
    hint: "This is the code inside the curly braces where the function does its work.",
    explanation:
      "The function body is the code between the curly braces `{ }` that executes when the function is called. It's not just a 'code block' (which is any `{ }` block, including if/for blocks) — 'function body' specifically refers to the block belonging to a function. A 'statement' is a single instruction, and an 'expression' produces a value.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function",
  },
  {
    code: `const numbers = [1, 2, 3, 4, 5];`,
    highlight: "[1, 2, 3, 4, 5]",
    question: "What are these symbols called?",
    correct: "square brackets",
    options: ["square brackets", "curly braces", "parentheses", "angle brackets"],
    hint: "These [ ] symbols are commonly used to define arrays.",
    explanation:
      "Square brackets `[ ]` are used to create arrays and to access elements by index. Curly braces `{ }` define objects and code blocks, parentheses `( )` group expressions and function parameters, and angle brackets `< >` are used for generics in TypeScript and for JSX tags.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
  },
  {
    code: `const person = { name: 'Alice', age: 30 };`,
    highlight: "{ name: 'Alice', age: 30 }",
    question: "What are these symbols called?",
    correct: "curly braces",
    options: ["curly braces", "square brackets", "parentheses", "angle brackets"],
    hint: "These { } symbols are commonly used to define objects.",
    explanation:
      "Curly braces `{ }` define object literals, code blocks, and destructuring patterns. They're not square brackets `[ ]` (which create arrays), not parentheses `( )` (which group expressions), and not angle brackets `< >` (which are used for generics and JSX).",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block",
  },
  {
    code: `function add(a: number, b: number): number {
  return a + b;
}`,
    highlight: "(a: number, b: number)",
    question: "What are these symbols called?",
    correct: "parentheses",
    options: ["parentheses", "curly braces", "square brackets", "angle brackets"],
    hint: "These ( ) symbols surround function parameters.",
    explanation:
      "Parentheses `( )` surround function parameters in declarations and arguments in calls. They also group expressions to control evaluation order. Curly braces `{ }` enclose code blocks, square brackets `[ ]` define arrays, and angle brackets `< >` are used for type parameters in TypeScript.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
  },
];

const level1_5Questions: Question[] = [
  {
    code: `interface User {
  name: string;
  age: number;
}`,
    highlight: "name: string;",
    question: "What is the highlighted part called?",
    correct: "property",
    options: ["property", "field", "attribute", "member"],
    hint: "In an interface, each key-value pair declaration is called a ___.",
    explanation:
      "In TypeScript interfaces, each declaration like `name: string` is a property definition. While 'field' and 'member' are used in other languages (Java, C#), JavaScript and TypeScript consistently use 'property' for object and interface key-value declarations. 'Attribute' is typically reserved for HTML elements.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Glossary/property/JavaScript",
  },
  {
    code: `const fruits = ['apple', 'banana', 'orange'];
console.log(fruits[0]);`,
    highlight: "[0]",
    question: "What is the highlighted part called?",
    correct: "index",
    options: ["index", "key", "position", "offset"],
    hint: "The number inside square brackets refers to a position in the array.",
    explanation:
      "An array index is the numeric position used to access elements, starting at 0. A 'key' is used for object properties (string-based), not array positions. 'Position' and 'offset' aren't standard JavaScript terminology — the spec and docs consistently call it an index.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#accessing_array_elements",
  },
  {
    code: `const add = (a, b) => a + b;`,
    highlight: "(a, b) => a + b",
    question: "What is this syntax called?",
    correct: "arrow function",
    options: ["arrow function", "lambda", "anonymous function", "inline function"],
    hint: "The => symbol gives this ES6 function syntax its name.",
    explanation:
      "Arrow functions use the `=>` syntax introduced in ES6. They provide a shorter syntax than function expressions and lexically bind the `this` value. While 'lambda' is the equivalent concept in other languages and 'anonymous function' describes any unnamed function, JavaScript specifically calls this syntax an arrow function.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions",
  },
  {
    code: `const point = { x: 10, y: 20 };`,
    highlight: "{ x: 10, y: 20 }",
    question: "What is this syntax called?",
    correct: "object literal",
    options: ["object literal", "object notation", "hash", "dictionary"],
    hint: "This creates an object directly in code using { key: value } syntax.",
    explanation:
      "An object literal creates an object directly using `{ key: value }` syntax. It's called a 'literal' because you write the object's contents literally in code, as opposed to using `new Object()`. 'Hash' and 'dictionary' are terms from Ruby and Python — JavaScript calls them objects or object literals.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer",
  },
  {
    code: `const doubled = numbers.map(n => n * 2);`,
    highlight: "n => n * 2",
    question: "What is the function passed to map called?",
    correct: "callback",
    options: ["callback", "lambda", "handler", "delegate"],
    hint: "A function passed as an argument to another function, to be 'called back' later.",
    explanation:
      "A callback is a function passed as an argument to another function, to be called later. Here, `n => n * 2` is passed to `map()`, which 'calls it back' for each element. While it is technically a 'lambda' (anonymous function), the term 'callback' specifically describes the pattern of passing a function to be invoked by another function.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Glossary/Callback_function",
  },
  {
    code: `const USER_FIRST_NAME = 'Alice';`,
    highlight: "USER_FIRST_NAME",
    question: "What naming convention is used here?",
    correct: "snake case",
    options: ["snake case", "camel case", "kebab case", "pascal case"],
    hint: "The words are separated by underscores, which look like they're crawling on the ground.",
    explanation:
      "This is SCREAMING_SNAKE_CASE, a variant of snake case that uses underscores with all uppercase letters. Camel case joins words with capital letters (`userFirstName`), kebab case uses hyphens (`user-first-name`), and pascal case capitalizes every word including the first (`UserFirstName`).",
    docsLink: "https://developer.mozilla.org/en-US/docs/Glossary/Snake_case",
  },
  {
    code: `const userFirstName = 'Alice';`,
    highlight: "userFirstName",
    question: "What naming convention is used here?",
    correct: "camel case",
    options: ["camel case", "snake case", "pascal case", "kebab case"],
    hint: "Each new word starts with an uppercase letter, forming 'humps'\u2026",
    explanation:
      "Camel case joins words with no separator, capitalizing each word after the first (`userFirstName`). The difference from pascal case: pascal case capitalizes the first word too (`UserFirstName`). Snake case uses underscores (`user_first_name`), and kebab case uses hyphens (`user-first-name`).",
    docsLink: "https://developer.mozilla.org/en-US/docs/Glossary/Camel_case",
  },
  {
    code: `<div class="user-profile-card">Hello</div>`,
    highlight: "user-profile-card",
    question: "What naming convention is used in this CSS class?",
    correct: "kebab case",
    options: ["kebab case", "snake case", "camel case", "train case"],
    hint: "The words are separated by hyphens, like items on a skewer.",
    explanation:
      "Kebab case uses hyphens to separate words (`user-profile-card`). It's the standard for CSS class names and URL slugs. Train case is similar but capitalizes each word (`User-Profile-Card`). Snake case uses underscores instead of hyphens, and camel case removes all separators.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case",
  },
  {
    code: `const isActive = true;
const message = isActive ? 'yes' : 'no';`,
    highlight: "isActive ? 'yes' : 'no'",
    question: "What is this operator called?",
    correct: "ternary operator",
    options: ["ternary operator", "comparison operator", "inline if", "expression"],
    hint: "This condition ? valueIfTrue : valueIfFalse operator has three parts.",
    explanation:
      "The ternary operator (`condition ? a : b`) is the only JavaScript operator that takes three operands. It's not just a 'comparison operator' (those are `===`, `!==`, `<`, `>`, etc.) — the ternary evaluates a condition and returns one of two values. 'Inline if' describes what it does, but the official name is the conditional (ternary) operator.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator",
  },
  {
    code: `const nums = [1, 2, 3].map(n => n * 2);`,
    highlight: "[1, 2, 3].map(n => n * 2)",
    question: "What does map() return?",
    correct: "new array",
    options: ["new array", "modified array", "undefined", "boolean"],
    hint: "map() does not mutate the original — it creates something fresh.",
    explanation:
      "`Array.map()` always returns a new array of the same length, with each element transformed by the callback. It never mutates the original array — this is a key principle. 'Modified array' is wrong because the original stays unchanged. It doesn't return `undefined` (that's `forEach`'s return value) or a boolean (that's `some`/`every`).",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map",
  },
  {
    code: `const found = [1, 2, 3, 4].find(n => n > 2);`,
    highlight: "[1, 2, 3, 4].find(n => n > 2)",
    question: "What does find() return?",
    correct: "first matching element",
    options: ["first matching element", "all matches", "boolean", "index"],
    hint: "It stops searching as soon as it finds one element that passes the test.",
    explanation:
      "`Array.find()` returns the first element that satisfies the test function, then stops iterating. It doesn't return all matches (that's `filter()`), a boolean (that's `some()` or `every()`), or an index (that's `findIndex()`). If no element matches, `find()` returns `undefined`.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find",
  },
  {
    code: `let selectedUser = null;
let cachedValue;

console.log(selectedUser, cachedValue);`,
    highlight: "null",
    question: "In JavaScript, what does null usually represent (compared to undefined)?",
    correct: "intentional absence of a value",
    options: [
      "intentional absence of a value",
      "an uninitialized variable",
      "a missing object property",
      "a variable that was never declared",
    ],
    hint: "Think: was the value set on purpose, or is it just not assigned yet?",
    explanation:
      "`null` is usually used intentionally to mean 'no value right now.' `undefined` usually means a value hasn't been assigned yet (like an uninitialized variable) or a property doesn't exist. So `null` is explicit absence, while `undefined` is default/missing absence.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null",
  },
  {
    code: `const hasEven = [1, 2, 3].some(n => n % 2 === 0);`,
    highlight: "[1, 2, 3].some(n => n % 2 === 0)",
    question: "What does some() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"],
    hint: "It answers a yes/no question: does at least one element pass the test?",
    explanation:
      "`Array.some()` returns `true` if at least one element passes the test, `false` otherwise. Unlike `filter()` (which returns an array of matches) or `find()` (which returns the element itself), `some()` only answers a yes/no question. It short-circuits: once it finds a passing element, it stops.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some",
  },
  {
    code: `const allPositive = [1, 2, 3].every(n => n > 0);`,
    highlight: "[1, 2, 3].every(n => n > 0)",
    question: "What does every() return?",
    correct: "boolean",
    options: ["boolean", "array", "number", "element"],
    hint: "It answers a yes/no question: do ALL elements pass the test?",
    explanation:
      "`Array.every()` returns `true` only if all elements pass the test, `false` otherwise. Like `some()`, it returns a boolean — not an array (that's `filter`/`map`), a number (that's `reduce`), or a single element (that's `find`). It short-circuits on the first failure.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every",
  },
  {
    code: `const [count, setCount] = useState(0);`,
    highlight: "useState(0)",
    question: "What React feature is being used here?",
    correct: "hook",
    options: ["hook", "component", "prop", "context"],
    hint: "Functions starting with 'use' that let you 'hook into' React features.",
    explanation:
      "React hooks are functions starting with 'use' that let functional components manage state, effects, and other React features. A component returns JSX and renders UI. A prop is data passed from parent to child. Context is a specific mechanism for sharing data without prop drilling — `useState` is a hook, not a context.",
    docsLink: "https://react.dev/reference/react/hooks",
  },
  {
    code: `<button onClick={() => setCount(count + 1)}>
  Click me
</button>`,
    highlight: "onClick",
    question: "What is this attribute called in React?",
    correct: "event handler",
    options: ["event handler", "callback prop", "action", "listener"],
    hint: "This function responds to a user interaction like a click.",
    explanation:
      "An event handler is a function assigned to respond to user interactions like clicks, keypresses, or form submissions. While it is technically a 'callback prop' (a function passed as a prop), the specific term for a prop that responds to DOM events is event handler. In React, they use camelCase naming (`onClick`, not `onclick`).",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers",
  },
];

const level2AllQuestions: Question[] = [
  {
    code: `const numbers: Array<number> = [1, 2, 3];`,
    highlight: "<number>",
    question: "What is the highlighted part called?",
    correct: "generic",
    options: ["generic", "type parameter", "template", "type annotation"],
    hint: "The angle brackets <> let this type work with different inner types.",
    explanation:
      "Generics use angle brackets `<T>` to create reusable types that work with different data types. `Array<number>` means 'an array specifically containing numbers.' While 'type parameter' refers to the `T` inside the brackets, the overall feature is called generics. A 'type annotation' (like `: string`) simply labels a variable's type without parameterization.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
  },
  {
    code: `type Status = 'active' | 'inactive' | 'pending';`,
    highlight: "'active' | 'inactive' | 'pending'",
    question: "What is the highlighted part called?",
    correct: "union type",
    options: ["union type", "intersection type", "literal type", "enum"],
    hint: "The | (pipe) operator combines multiple types into one 'this OR that' type.",
    explanation:
      "A union type uses the `|` operator to declare that a value can be one of several types. An intersection type uses `&` and requires all types at once. An enum defines named constants — while similar in effect, union types are more flexible. Each option here is a string literal type; the `|` combines them into a union.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types",
  },
  {
    code: `function getName(): string {
  return 'Alice';
}`,
    highlight: ": string",
    question: "What is the highlighted part called?",
    correct: "return type",
    options: ["return type", "output signature", "type hint", "output type"],
    hint: "This annotation after the () declares what type the function gives back.",
    explanation:
      "A return type annotation after the parentheses declares what type a function will return. It's placed after the parameter list, separated by a colon. 'Type hint' is Python's term for this concept. 'Output signature' and 'output type' aren't standard TypeScript terminology — the official term is return type annotation.",
    docsLink:
      "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#return-type-annotations",
  },
  {
    code: `const user = { name: 'Alice', age: 30, city: 'NYC' };
const { name, age } = user;`,
    highlight: "{ name, age }",
    question: "What is this syntax called?",
    correct: "destructuring",
    options: ["destructuring", "unpacking", "pattern matching", "extraction"],
    hint: "This syntax extracts values from an object into individual variables.",
    explanation:
      "Destructuring extracts values from objects or arrays into distinct variables using a pattern that mirrors the data structure. It's not 'unpacking' (Python's term) or 'pattern matching' (a broader concept involving conditional checks). Destructuring simply creates variables from an existing structure — `const { name, age } = user` creates variables `name` and `age` from the `user` object.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",
  },
  {
    code: `const oldArr = [1, 2, 3];
const newArr = [...oldArr, 4, 5];`,
    highlight: "...oldArr",
    question: "What is this syntax called?",
    correct: "spread syntax",
    options: ["spread syntax", "rest syntax", "destructuring", "expansion"],
    hint: "The three dots (...) expand an iterable's elements into a new array.",
    explanation:
      "Spread syntax (`...`) expands an iterable's elements in place. The critical distinction from rest syntax: spread appears in array literals or function calls to expand elements, while rest appears in function parameters or destructuring patterns to collect them. Here, `...oldArr` expands into the new array — it's spreading, not resting.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
  },
  {
    code: `const user = { profile: { name: 'Alice' } };
const name = user?.profile?.name;`,
    highlight: "?.profile?.name",
    question: "What is this operator called?",
    correct: "optional chaining",
    options: ["optional chaining", "safe navigation", "null check", "elvis operator"],
    hint: "The ?. operator safely accesses properties that might be null or undefined.",
    explanation:
      "Optional chaining (`?.`) short-circuits to `undefined` if the left side is `null` or `undefined`, preventing 'cannot read property of null' errors. It's not a 'null check' (which is an explicit if statement) or an 'elvis operator' (which is `?:`, a different concept from other languages). Safe navigation is what some languages call it, but JavaScript's official name is optional chaining.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining",
  },
  {
    code: `function getValue(input?: string) {
  return input ?? 'default';
}`,
    highlight: `?? 'default';
}`,
    question: "What is this operator called?",
    correct: "nullish coalescing",
    options: ["nullish coalescing", "default operator", "fallback operator", "NaN operator"],
    hint: "The ?? operator provides a fallback only for null or undefined values.",
    explanation:
      "The nullish coalescing operator (`??`) returns the right operand only when the left is `null` or `undefined`. The key distinction from `||` (logical OR): `||` triggers on any falsy value (`0`, `''`, `false`), while `??` only triggers on `null` and `undefined`. This matters when `0` or empty string are valid values you want to keep.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing",
  },
  {
    code: `class Dog extends Animal {
  bark() {
    console.log('Woof!');
  }
}`,
    highlight: "extends Animal",
    question: "What does this represent?",
    correct: "inheritance",
    options: ["inheritance", "extension", "composition", "implementation"],
    hint: "The 'extends' keyword means Dog receives all of Animal's properties and methods.",
    explanation:
      "Inheritance (via `extends`) lets a child class receive all properties and methods from a parent class. Composition is a different pattern where objects contain other objects rather than inheriting from them. 'Extension' describes the act, but the OOP concept is called inheritance. 'Implementation' in TypeScript refers to the `implements` keyword for interfaces, not class extension.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript#inheritance",
  },
  {
    code: `type ID = string | number;`,
    highlight: "type ID = string | number",
    question: "What is this declaration called?",
    correct: "type alias",
    options: ["type alias", "type definition", "typedef", "interface"],
    hint: "The 'type' keyword gives a new name to an existing type expression.",
    explanation:
      "A type alias gives a name to any type expression using the `type` keyword. Unlike an interface (which can only describe object shapes and can be extended), type aliases can name unions, intersections, tuples, primitives, and any other type expression. 'Typedef' is C/C++ terminology — TypeScript uses 'type alias.'",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases",
  },
  {
    code: `type Coordinates = [number, number];`,
    highlight: "[number, number]",
    question: "What is this type called?",
    correct: "tuple",
    options: ["tuple", "array", "pair", "vector"],
    hint: "This is a fixed-length array where each position has a specific type.",
    explanation:
      "A tuple is a fixed-length array where each position has a known, specific type. `[number, number]` always has exactly two elements, both numbers. Unlike a regular array type (`number[]`), a tuple has a fixed length and can have different types per position, like `[string, number]`. 'Pair' and 'vector' aren't TypeScript types.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types",
  },
  {
    code: `function outer() {
  const x = 10;
  return function inner() {
    return x;
  };
}`,
    highlight: `function inner() {
    return x;
  }`,
    question: "What JavaScript concept is demonstrated here?",
    correct: "closure",
    options: ["closure", "scope", "hoisting", "recursion"],
    hint: "The inner function 'remembers' the variable x from its outer function.",
    explanation:
      "A closure is a function that retains access to variables from its enclosing scope, even after that scope has finished executing. This isn't just 'scope' (which defines where variables are accessible) — a closure specifically captures and preserves that scope. It's not hoisting (which moves declarations to the top) or recursion (where a function calls itself).",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
  },
  {
    code: `console.log(x);
var x = 5;`,
    highlight: `console.log(x);
var x = 5;`,
    question: "What JavaScript behavior causes x to be undefined here?",
    correct: "hoisting",
    options: ["hoisting", "closure", "scoping", "coercion"],
    hint: "Variable declarations with var are moved to the top of their scope.",
    explanation:
      "Hoisting moves `var` declarations (but not their assignments) to the top of their scope during compilation. So `var x` exists when `console.log` runs, but its value hasn't been assigned yet, resulting in `undefined`. This isn't a closure (which preserves scope across function boundaries), scoping (which defines variable visibility), or coercion (which converts between types).",
    docsLink: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting",
  },
  {
    code: `async function loadUser(id: number) {
  const data = await fetchUser(id);
  return data;
}`,
    highlight: "await fetchUser(id)",
    question: "What does the `await` keyword pause execution for?",
    correct: "Promise",
    options: ["Promise", "Callback", "Observable", "Event"],
    hint: "This object represents a value that may not be available yet but will resolve later.",
    explanation:
      "The `await` keyword pauses an async function until a Promise settles. A Promise represents an asynchronous operation with three states: pending, fulfilled, or rejected. Callbacks are an older pattern for handling async code but aren't what `await` operates on. Observables (from RxJS) handle streams of values — Promises handle a single future value.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
  },
  {
    code: `const double = (x) => x * 2;
const numbers = [1, 2, 3].map(double);`,
    highlight: "const double = (x) => x * 2;",
    question: "What type of function is this?",
    correct: "pure function",
    options: ["pure function", "impure function", "side effect", "closure"],
    hint: "It always returns the same output for the same input and has no side effects.",
    explanation:
      "A pure function always returns the same output for the same input and produces no side effects. An impure function would modify external state or depend on it (like reading a global variable). This isn't a closure (though a pure function can be one) or a side effect (which is something a pure function avoids by definition).",
  },
  {
    code: `useEffect(() => {
  document.title = 'Hello';
}, []);`,
    highlight: "useEffect",
    question: "What is this React hook used for?",
    correct: "side effects",
    options: ["side effects", "state management", "memoization", "context"],
    hint: "This hook runs code that interacts with things outside the component, like the DOM.",
    explanation:
      "`useEffect` runs code that produces side effects — interactions with systems outside React's rendering, like DOM manipulation, API calls, or subscriptions. It's not for state management (that's `useState`/`useReducer`), memoization (that's `useMemo`/`useCallback`), or context (that's `useContext`). The empty `[]` dependency array means it runs once after the first render.",
    docsLink: "https://react.dev/reference/react/useEffect",
  },
  {
    code: `useEffect(() => {
  fetchData();
}, [userId]);`,
    highlight: "[userId]);",
    question: "What is this array called in useEffect?",
    correct: "dependency array",
    options: ["dependency array", "watch list", "trigger array", "effect list"],
    hint: "The effect re-runs whenever a value in this array changes.",
    explanation:
      "The dependency array tells `useEffect` when to re-run. The effect fires whenever any value in this array changes between renders. It's not a 'watch list' or 'trigger array' — those aren't React concepts. Key rule: an empty `[]` means 'run once on mount'; omitting the array entirely means 'run after every render.'",
    docsLink: "https://react.dev/reference/react/useEffect#specifying-reactive-dependencies",
  },
  {
    code: `function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}`,
    highlight: "{ onClick, children }",
    question: "What is this pattern called in React?",
    correct: "props destructuring",
    options: ["props destructuring", "parameter spread", "object unpacking", "property access"],
    hint: "The { } in the function parameters extract specific properties from the props object.",
    explanation:
      "Props destructuring extracts specific properties from the props object directly in the function parameters. This isn't 'parameter spread' (which would use `...` to pass all props through) — destructuring selects specific properties. It's standard JavaScript destructuring applied to React's props object.",
    docsLink: "https://react.dev/learn/passing-props-to-a-component",
  },
  {
    code: `{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}`,
    highlight: "key={item.id}",
    question: "What is this attribute used for in React?",
    correct: "identifying list items",
    options: ["identifying list items", "styling elements", "indexing", "sorting"],
    hint: "React uses this to track which items in a list have changed, been added, or removed.",
    explanation:
      "React uses the `key` prop to uniquely identify list items so it can efficiently track which items have changed, been added, or removed during re-renders. It's not for styling, indexing data, or sorting — it's purely a React reconciliation optimization. Keys should be stable, unique identifiers; using array indices can cause bugs when the list reorders.",
    docsLink: "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
  },
  {
    code: `type AdminUser = User & Admin;`,
    highlight: "& Admin;",
    question: "What operator creates an intersection type?",
    correct: "ampersand",
    options: ["ampersand", "pipe", "plus", "asterisk"],
    hint: "This & symbol means a type must satisfy ALL of the combined types.",
    explanation:
      "The ampersand (`&`) creates an intersection type, meaning the resulting type must have ALL properties from both types. The pipe (`|`) creates a union type (one OR the other) — the ampersand requires both. `User & Admin` has everything from `User` AND everything from `Admin` combined into a single type.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types",
  },
  {
    code: `const total = [10, 20, 30].reduce((acc, n) => acc + n, 0);`,
    highlight: "[10, 20, 30].reduce((acc, n) => acc + n, 0)",
    question: "What does reduce() return?",
    correct: "single accumulated value",
    options: ["single accumulated value", "new array", "boolean", "first matching element"],
    hint: "It 'reduces' an entire array down to one result by combining elements together.",
    explanation:
      "`Array.reduce()` processes each element through a callback, accumulating a single result. It doesn't return a new array (that's `map()` or `filter()`), a boolean (that's `some()` or `every()`), or the first match (that's `find()`). The first argument `acc` is the accumulator that carries the running total, and `0` is the initial value.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
  },
  {
    code: `function format(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}`,
    highlight: "typeof value === 'string'",
    question: "What is this typeof check called in TypeScript?",
    correct: "type guard",
    options: ["type guard", "type assertion", "type cast", "runtime check"],
    hint: "This check narrows the type of value so TypeScript knows it's a string inside the if block.",
    explanation:
      "A type guard is a runtime check that narrows a variable's type within a conditional block. After `typeof value === 'string'`, TypeScript knows `value` is a `string` inside the `if` block. A type assertion (`as string`) forces the type without checking — a type guard proves it. 'Type cast' is terminology from other languages; TypeScript doesn't have true casts.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards",
  },
  {
    code: `const field = 'color';
const style = { [field]: 'blue' };`,
    highlight: "[field]",
    question: "What is this syntax called?",
    correct: "computed property name",
    options: ["computed property name", "index signature", "destructuring", "dynamic key"],
    hint: "The square brackets evaluate an expression to determine the property name at runtime.",
    explanation:
      "A computed property name uses `[expression]` in an object literal to evaluate the key at runtime. It's not an index signature (`[key: string]: type`), which defines a type contract for any string key in an interface. Destructuring extracts values from objects — it doesn't create them. 'Dynamic key' describes the concept informally, but the official term is computed property name.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names",
  },
  {
    code: `const name = 'Alice';
const age = 30;
const user = { name, age };`,
    highlight: "{ name, age }",
    question: "What is this object syntax called?",
    correct: "shorthand property",
    options: ["shorthand property", "destructuring", "implicit assignment", "property alias"],
    hint: "When the variable name matches the property name, you can omit the colon and value.",
    explanation:
      "Shorthand property syntax lets you write `{ name }` instead of `{ name: name }` when the variable name matches the desired property name. This isn't destructuring (which goes the other direction — extracting values from an object). 'Implicit assignment' and 'property alias' aren't standard JavaScript terms. Shorthand properties were introduced in ES6.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#property_definitions",
  },
  {
    code: `const COLORS = ['red', 'green', 'blue'] as const;`,
    highlight: "as const",
    question: "What does as const do?",
    correct: "creates a readonly literal type",
    options: [
      "creates a readonly literal type",
      "freezes the array at runtime",
      "casts to a constant",
      "prevents reassignment",
    ],
    hint: "This is a compile-time assertion that makes TypeScript treat the value as deeply immutable.",
    explanation:
      "`as const` is a const assertion that tells TypeScript to infer the narrowest possible type — making the array `readonly` with literal element types (`readonly ['red', 'green', 'blue']` instead of `string[]`). It doesn't freeze the array at runtime (that's `Object.freeze()`), doesn't cast anything, and doesn't prevent reassignment of the variable (`const` does that). It's purely a compile-time construct.",
    docsLink:
      "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions",
  },
  {
    code: `interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}`,
    highlight: "extends Animal",
    question: "What is Dog doing with Animal?",
    correct: "extending an interface",
    options: [
      "extending an interface",
      "implementing an interface",
      "composing interfaces",
      "merging declarations",
    ],
    hint: "Dog inherits all of Animal's properties and adds its own.",
    explanation:
      "Interface extension uses `extends` to inherit all properties from a parent interface and add new ones. `Dog` gets `name` from `Animal` and adds `breed`. 'Implementing' an interface (`implements`) is what classes do to satisfy an interface contract. 'Composing' would mean combining separate interfaces without inheritance. Declaration merging is when TypeScript automatically combines multiple declarations of the same interface name.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types",
  },
  {
    code: `const fruits = ['apple', 'banana', 'cherry'];
for (const fruit of fruits) {
  console.log(fruit);
}`,
    highlight: "of fruits",
    question: "What does for...of iterate over?",
    correct: "values",
    options: ["values", "keys", "indices", "entries"],
    hint: "The 'of' keyword gives you each element directly, not its position.",
    explanation:
      "`for...of` iterates over the values of an iterable (arrays, strings, Maps, Sets). The critical distinction: `for...in` iterates over keys (property names/indices as strings), while `for...of` gives you the actual values. To get indices, use `entries()` with destructuring: `for (const [i, fruit] of fruits.entries())`. `for...in` is designed for objects; `for...of` is designed for iterables.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of",
  },
  {
    code: `function Timer() {
  const intervalRef = useRef<number | null>(null);
  // start/stop logic using intervalRef.current
}`,
    highlight: "useRef<number | null>(null)",
    question: "What does useRef return?",
    correct: "mutable ref object",
    options: ["mutable ref object", "state variable", "DOM element", "callback function"],
    hint: "It returns an object with a .current property that persists across renders.",
    explanation:
      "`useRef` returns a mutable ref object with a `.current` property that persists for the component's entire lifetime. Unlike `useState`, updating `.current` doesn't trigger a re-render. It's not a state variable (state changes cause re-renders), not a DOM element directly (though refs can hold DOM nodes via the `ref` attribute), and not a callback function.",
    docsLink: "https://react.dev/reference/react/useRef",
  },
  {
    code: `let title = '';
title ||= 'Untitled';`,
    highlight: "||= 'Untitled'",
    question: "What is this operator called?",
    correct: "logical OR assignment",
    options: [
      "logical OR assignment",
      "nullish assignment",
      "default assignment",
      "fallback operator",
    ],
    hint: "It combines || and = into one operator, assigning only when the left side is falsy.",
    explanation:
      "The logical OR assignment operator (`||=`) assigns the right value only when the left is falsy (`false`, `0`, `''`, `null`, `undefined`, `NaN`). The key distinction from nullish assignment (`??=`): `??=` only triggers on `null` or `undefined`, not other falsy values like empty string or `0`. Here, `title` is `''` (falsy), so it becomes `'Untitled'`. 'Default assignment' and 'fallback operator' aren't standard terms.",
    docsLink:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment",
  },
];

// Level 2 currently has 28 questions, so split it evenly into two 14-question levels.
const LEVEL_2_SPLIT_INDEX = 14;

const level2Questions: Question[] = level2AllQuestions.slice(0, LEVEL_2_SPLIT_INDEX);

const level2_5Questions: Question[] = level2AllQuestions.slice(LEVEL_2_SPLIT_INDEX);

const level3Questions: Question[] = [
  {
    code: `const value: unknown = getValue();
const str = value as string;`,
    highlight: "value as string",
    question: "What is this syntax called?",
    correct: "type assertion",
    options: ["type assertion", "type cast", "type conversion", "type coercion"],
    hint: "The 'as' keyword tells TypeScript to treat a value as a specific type.",
    explanation:
      "A type assertion (`value as Type`) tells TypeScript to treat a value as a specific type. Unlike type casting or type conversion in other languages, assertions don't transform the value at runtime — they only affect compile-time type checking. Type coercion is JavaScript's automatic runtime conversion (like `'5' * 1` becoming `5`), which is a completely different concept.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions",
  },
  {
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}`,
    highlight: "value is string",
    question: "What is this return type syntax called?",
    correct: "type predicate",
    options: ["type predicate", "type narrowing", "type check", "type assertion"],
    hint: "The 'value is string' syntax narrows the type when the function returns true.",
    explanation:
      "A type predicate (`value is Type`) in a return type tells TypeScript to narrow the type of the parameter when the function returns `true`. 'Type narrowing' is the broader concept (it includes `typeof` checks, `instanceof`, etc.) — a type predicate is a specific mechanism for creating custom type guards. A type assertion (`as Type`) forces the type without checking; a predicate proves it.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates",
  },
  {
    code: `interface StringMap {
  [key: string]: any;
}`,
    highlight: "[key: string]: any",
    question: "What is this syntax called?",
    correct: "index signature",
    options: ["index signature", "indexer", "dynamic property", "computed property"],
    hint: "The [key: string] syntax allows an object to have any number of dynamically-named properties.",
    explanation:
      "An index signature `[key: string]: type` allows an object to have any number of properties with string keys. A computed property (`[expression]: value`) evaluates an expression as a key in an object literal — that's a different concept. An 'indexer' is C#'s term. Index signatures define a contract for dynamically-named properties whose types are known.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures",
  },
  {
    code: `type IsString<T> = T extends string ? T : never;`,
    highlight: "T extends string ? T : never",
    question: "What is this type called?",
    correct: "conditional type",
    options: ["conditional type", "ternary type", "generic constraint", "mapped type"],
    hint: "It uses the same ? : pattern as an if/else, but at the type level.",
    explanation:
      "A conditional type uses `T extends U ? X : Y` syntax to choose between types based on a condition, evaluated at compile time. While the `? :` syntax looks like the ternary operator, this is a type-level construct. It's not a 'generic constraint' (which uses `extends` to limit type parameters) or a 'mapped type' (which iterates over keys with `[P in keyof T]`).",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
  },
  {
    code: `type Flags = {
  [K in "read" | "write" | "execute"]: boolean;
};`,
    highlight: '[K in "read" | "write" | "execute"]: boolean',
    question: "What is this type called?",
    correct: "mapped type",
    options: ["mapped type", "conditional type", "indexed type", "generic type"],
    hint: "The [K in ...] iterates over each member of the union, creating a property for each one — like Array.map for types.",
    explanation:
      "A mapped type iterates over the members of a union using `[K in ...]` and creates a property for each one. The `in` keyword is the distinguishing feature — conditional types use `extends ? :`, while mapped types use `in` to loop. An indexed type uses `T[K]` to look up a single property. Here, the mapped type creates an object with `read`, `write`, and `execute` properties, each typed as `boolean`.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html",
  },
  {
    code: `type ToArray<T> = T extends string ? T[] : never;
type Result = ToArray<'a' | 'b' | 42>;`,
    highlight: "ToArray<'a' | 'b' | 42>",
    question: "What does `Result` resolve to?",
    correct: "'a'[] | 'b'[]",
    options: ["'a'[] | 'b'[]", "('a' | 'b')[]", "'a'[] | 'b'[] | 42[]", "never"],
    hint: "Conditional types distribute over unions, but only union members that satisfy the condition survive.",
    explanation:
      "`Result` becomes `'a'[] | 'b'[]` because conditional types distribute over each union member: `'a'` and `'b'` match `extends string`, while `42` becomes `never` and drops out of the union. `('a' | 'b')[]` would be the non-distributed shape, which you'd get by preventing distribution with a tuple wrapper like `[T] extends [string]`. `'a'[] | 'b'[] | 42[]` is wrong because `42` fails the string condition. It is not `never` because at least two union members satisfy the condition.",
    docsLink:
      "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types",
  },
  {
    code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };`,
    highlight: "kind: 'circle'",
    question: "What property enables discriminated unions?",
    correct: "discriminant",
    options: ["discriminant", "enumerator", "identifier", "selector"],
    hint: "This shared property with literal types lets TypeScript narrow which variant you have.",
    explanation:
      "A discriminant is a shared property (like `kind`) with literal types that lets TypeScript narrow a union to a specific variant. It's not an 'identifier' (a general programming term for names) or a 'selector' (a CSS concept). The discriminant must be a common property across all union members with distinct literal types, enabling TypeScript to narrow automatically.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
  },
  {
    code: `function process<T extends { id: number }>(item: T) {
  return item.id;
}`,
    highlight: "<T extends { id: number }>",
    question: "What is this syntax called?",
    correct: "generic constraint",
    options: ["generic constraint", "type bound", "type limit", "interface requirement"],
    hint: "The 'extends' keyword limits what types T can be, requiring certain properties.",
    explanation:
      "A generic constraint (`T extends Type`) restricts what types can be used as a type argument. `extends` here means 'must be assignable to,' not class inheritance. A 'type bound' is Java's term for this concept. An interface requirement would use `implements` — `extends` in a generic context specifically constrains the type parameter.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints",
  },
  {
    code: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
queueMicrotask(() => console.log('D'));
console.log('E');`,
    highlight: `setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
queueMicrotask(() => console.log('D'));`,
    question: "What is the output order?",
    correct: "A, E, C, D, B",
    options: ["A, E, C, D, B", "A, E, B, C, D", "A, C, D, E, B", "A, E, D, C, B"],
    hint: "Synchronous logs run first, then microtasks in registration order, then macrotasks like timers.",
    explanation:
      "The output is `A, E, C, D, B` because synchronous code runs immediately, then the microtask queue drains before timers. Both `Promise.then()` and `queueMicrotask()` schedule microtasks, and `Promise.then()` is registered first, so `C` logs before `D`. `setTimeout(..., 0)` is a macrotask, so `B` runs after microtasks finish. Any option placing `B` before `C`/`D`, or moving `C`/`D` before `E`, violates event loop ordering.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
  },
  {
    code: `type EventNames = \`on\${Capitalize<string>}\`;`,
    highlight: `\`on\${Capitalize<string>}\``,
    question: "What is this type syntax called?",
    correct: "template literal type",
    options: ["template literal type", "string pattern type", "format type", "interpolated type"],
    hint: "It uses backtick syntax at the type level to create string patterns.",
    explanation:
      "Template literal types use backtick syntax at the type level to create string pattern types. They're not 'string pattern types' (not an official term) or 'format types.' Template literal types mirror runtime template literals but operate on types, letting you combine string literal types to generate permitted string shapes like `'onClick' | 'onHover'`.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
  },
  {
    code: `type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};`,
    highlight: "DeepReadonly<T[P]>",
    question: "What kind of type is this?",
    correct: "recursive type",
    options: ["recursive type", "nested type", "deep type", "self-referential type"],
    hint: "This type references itself in its own definition — like a function calling itself.",
    explanation:
      "A recursive type references itself in its definition, like a function calling itself. 'Nested type' just means types within types — it doesn't imply self-reference. 'Self-referential type' describes the concept but isn't the standard term. Recursive types are essential for modeling tree structures, linked lists, and deeply nested objects like `DeepReadonly`.",
  },
  {
    code: `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{count}</p>;
}`,
    highlight: `setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);`,
    question: "What bug pattern does this component demonstrate?",
    correct: "stale closure",
    options: ["stale closure", "memory leak", "tearing", "double render"],
    hint: "The interval callback captures `count` from the initial render because the effect never re-subscribes.",
    explanation:
      "This is a stale closure: the interval callback closes over the initial `count` value because the effect has an empty dependency array, so `setCount(count + 1)` keeps using outdated state. A memory leak would mean resources are never cleaned up, but this code calls `clearInterval(id)` correctly. Tearing refers to inconsistent concurrent reads across UI boundaries, not this captured-state issue. Double render is a React Strict Mode dev behavior, not the root bug in this snippet.",
  },
];

export const levels: Level[] = [
  {
    id: 1,
    name: "Level 1",
    subtitle: "Easy",
    description: "Basic syntax fundamentals",
    questions: level1Questions,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 1.5,
    name: "Level 1.5",
    subtitle: "Easy+",
    description: "More syntax fundamentals",
    questions: level1_5Questions,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 2,
    name: "Level 2",
    subtitle: "Medium",
    description: "Intermediate concepts",
    questions: level2Questions,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 2.5,
    name: "Level 2.5",
    subtitle: "Medium+",
    description: "More intermediate concepts",
    questions: level2_5Questions,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 3,
    name: "Level 3",
    subtitle: "Hard",
    description: "Advanced bits",
    questions: level3Questions,
    color: "from-red-500 to-pink-500",
  },
];

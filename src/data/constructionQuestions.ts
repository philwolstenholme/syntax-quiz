export interface ConstructionQuestion {
  instruction: string;
  tokens: string[];
  distractors: string[];
  hint: string;
  explanation: string;
  docsLink?: string;
}

export interface ConstructionLevel {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  questions: ConstructionQuestion[];
}

const easyQuestions: ConstructionQuestion[] = [
  {
    instruction: "Write an arrow function called `greet` that takes a `name` parameter and returns a template literal saying `Hello, ${name}!`.",
    tokens: ["const", "greet", "=", "(name)", "=>", "`Hello, ${name}!`"],
    distractors: ["function", "return", "let"],
    hint: "Arrow functions use `=>` and a single expression body doesn't need `return` or curly braces.",
    explanation: "Arrow functions with a single expression use implicit return — the expression after `=>` is returned automatically. Using `function` would require the `function` keyword syntax instead, and `return` is only needed inside a block body `{ ... }`.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions",
  },
  {
    instruction: "Declare a `const` variable called `colors` and assign it an array containing `'red'`, `'green'`, and `'blue'`.",
    tokens: ["const", "colors", "=", "['red',", "'green',", "'blue']"],
    distractors: ["let", "new Array(", ")"],
    hint: "Array literals use square brackets with comma-separated values.",
    explanation: "Array literals are the idiomatic way to create arrays in JavaScript. `const` prevents reassignment of the variable (though the array contents can still be mutated). `new Array()` works but is verbose and has edge cases with single numeric arguments.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Array",
  },
  {
    instruction: "Write a default export of a function called `App` that returns a JSX `<h1>` element containing `Hello`.",
    tokens: ["export default", "function", "App()", "{", "return", "<h1>Hello</h1>", "}"],
    distractors: ["export", "const", "=>"],
    hint: "Default exports use `export default` before the function declaration.",
    explanation: "A default export allows importing without curly braces: `import App from './App'`. The `function` keyword declares a named function that can be hoisted. Using `export` alone (without `default`) would create a named export requiring `import { App }`.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export",
  },
  {
    instruction: "Destructure `name` and `age` from an object parameter in a function called `describe`.",
    tokens: ["function", "describe(", "{ name, age }", ")", "{", "}"],
    distractors: ["const", "=>", "[ name, age ]"],
    hint: "Object destructuring in function parameters uses curly braces, not square brackets.",
    explanation: "Object destructuring in parameters extracts properties directly: `{ name, age }` pulls out those keys from the passed object. Square brackets `[ ]` would be array destructuring, which extracts by position rather than by name.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",
  },
  {
    instruction: "Use the spread operator to create a new array called `all` by combining `first` and `second` arrays.",
    tokens: ["const", "all", "=", "[...first,", "...second]"],
    distractors: ["let", "first.concat(second)", "new"],
    hint: "The spread operator uses `...` inside array brackets to expand elements.",
    explanation: "The spread syntax `...` expands iterables in place. `[...first, ...second]` creates a new array with all elements from both arrays. While `concat()` achieves the same result, spread is more flexible and can interleave other values.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
  },
];

const mediumQuestions: ConstructionQuestion[] = [
  {
    instruction: "Write an async arrow function called `fetchUser` that awaits a `fetch` call to `'/api/user'` and returns the awaited `.json()` result.",
    tokens: ["const", "fetchUser", "=", "async", "()", "=>", "{", "const res", "=", "await fetch('/api/user')", "return", "await res.json()", "}"],
    distractors: [".then()", "new Promise(", "resolve"],
    hint: "`async` goes before the parameter list, and `await` pauses execution until the promise resolves.",
    explanation: "Async arrow functions place `async` before the parameters. Each `await` pauses until the promise resolves, making the code read sequentially. `.then()` is the promise chain alternative but requires callbacks. A block body `{ }` with `return` is needed here because there are two statements.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
  },
  {
    instruction: "Write a generic function called `first` that takes an array of type `T` and returns the first element.",
    tokens: ["function", "first<T>", "(arr: T[])", ": T", "{", "return arr[0]", "}"],
    distractors: ["const", "<any>", "=> T"],
    hint: "The generic type parameter `<T>` goes right after the function name.",
    explanation: "Generic functions use `<T>` after the name to define a type parameter. `T[]` means an array of that type, and `: T` is the return type. Using `<any>` would lose type safety — the whole point of generics is to preserve the specific type through the function.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
  },
  {
    instruction: "Write a ternary expression that assigns `'adult'` to `status` if `age >= 18`, otherwise `'minor'`.",
    tokens: ["const", "status", "=", "age >= 18", "?", "'adult'", ":", "'minor'"],
    distractors: ["if", "else", "let"],
    hint: "The ternary operator follows the pattern: `condition ? valueIfTrue : valueIfFalse`.",
    explanation: "The ternary (conditional) operator is an expression, so it can be used directly in an assignment. `if/else` is a statement and can't be used inline. `const` is preferred over `let` since the variable is assigned once.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator",
  },
  {
    instruction: "Use optional chaining and nullish coalescing to safely access `user.address.city`, defaulting to `'Unknown'`.",
    tokens: ["const", "city", "=", "user?.address?.city", "??", "'Unknown'"],
    distractors: ["||", "&&", "user.address.city"],
    hint: "`?.` stops evaluation if a value is null/undefined. `??` provides a fallback only for null/undefined.",
    explanation: "Optional chaining `?.` short-circuits to `undefined` if any part is null/undefined, preventing runtime errors. Nullish coalescing `??` provides a default only for `null`/`undefined`, unlike `||` which would also replace `''` or `0`. Direct property access `user.address.city` would throw if `user` or `address` is null/undefined.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining",
  },
  {
    instruction: "Write a `map` and `filter` chain that takes `numbers`, keeps only positives, and doubles them.",
    tokens: ["const", "result", "=", "numbers", ".filter(n =>", "n > 0)", ".map(n =>", "n * 2)"],
    distractors: [".forEach(", ".reduce(", "return"],
    hint: "Both `filter` and `map` return new arrays, enabling chaining.",
    explanation: "Method chaining works because `filter()` returns a new array, which `map()` is then called on. `filter` goes first to reduce the array before mapping. `forEach` returns `undefined` so it can't be chained, and `reduce` is for accumulating into a single value.",
    docsLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter",
  },
];

const hardQuestions: ConstructionQuestion[] = [
  {
    instruction: "Write a conditional type `IsString<T>` that evaluates to `'yes'` if `T` extends `string`, otherwise `'no'`.",
    tokens: ["type", "IsString<T>", "=", "T extends string", "?", "'yes'", ":", "'no'"],
    distractors: ["interface", "typeof", "instanceof"],
    hint: "Conditional types use the same ternary syntax as values: `extends ? TrueType : FalseType`.",
    explanation: "Conditional types use `extends` as the condition (not `typeof` or `instanceof`, which are value-level operators). The ternary syntax `? : ` works at the type level to branch. `interface` can't express conditional logic.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
  },
  {
    instruction: "Write a mapped type `Readonly<T>` that makes all properties of `T` readonly.",
    tokens: ["type", "Readonly<T>", "=", "{", "readonly", "[P in keyof T]:", "T[P]", "}"],
    distractors: ["const", "extends", "Object.freeze"],
    hint: "Mapped types iterate over keys with `[P in keyof T]` and can add modifiers like `readonly`.",
    explanation: "Mapped types use `[P in keyof T]` to iterate over each property key of `T`. The `readonly` modifier is placed before the property to make each one immutable. `Object.freeze` is a runtime operation, not a type-level one. This is actually how TypeScript's built-in `Readonly<T>` utility type works.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html",
  },
  {
    instruction: "Write a discriminated union type `Shape` with a `Circle` (kind + radius) and `Square` (kind + side) variant.",
    tokens: ["type", "Shape", "=", "| { kind: 'circle';", "radius: number }", "| { kind: 'square';", "side: number }"],
    distractors: ["interface", "extends", "class"],
    hint: "Discriminated unions use a shared literal property (the discriminant) to distinguish variants.",
    explanation: "Discriminated unions combine union types with a common literal property (`kind`) that TypeScript can narrow on. Each variant has its own shape. `interface` with `extends` can't express union variants — you'd need separate interfaces. `class` adds runtime overhead that's unnecessary for pure type discrimination.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
  },
  {
    instruction: "Write a type predicate function `isString` that narrows an `unknown` value to `string`.",
    tokens: ["function", "isString(value: unknown):", "value is string", "{", "return typeof value", "=== 'string'", "}"],
    distractors: ["as string", "instanceof", "value as string"],
    hint: "Type predicates use `paramName is Type` as the return type annotation.",
    explanation: "Type predicates (`value is string`) tell TypeScript to narrow the parameter's type in the truthy branch of a conditional. `as string` is a type assertion that bypasses checking rather than narrowing safely. `instanceof` checks prototype chains and doesn't work for primitives like `string`.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates",
  },
  {
    instruction: "Write a template literal type `EventName<T>` that produces `on${Capitalize<T>}` where `T extends string`.",
    tokens: ["type", "EventName<T extends string>", "=", "`on${Capitalize<T>}`"],
    distractors: ["'on' +", "keyof", "infer"],
    hint: "Template literal types use the same backtick syntax as template literal values, but at the type level.",
    explanation: "Template literal types combine string literal types using backtick syntax. `Capitalize<T>` is a built-in utility type that uppercases the first character. String concatenation with `+` is a value-level operation, not available in the type system. For example, `EventName<'click'>` produces the type `'onClick'`.",
    docsLink: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
  },
];

export const constructionLevels: ConstructionLevel[] = [
  {
    id: "build-1",
    name: "Build 1",
    subtitle: "Easy",
    description: "Construct basic syntax from tokens",
    questions: easyQuestions,
  },
  {
    id: "build-2",
    name: "Build 2",
    subtitle: "Medium",
    description: "Assemble intermediate patterns",
    questions: mediumQuestions,
  },
  {
    id: "build-3",
    name: "Build 3",
    subtitle: "Hard",
    description: "Construct advanced type-level syntax",
    questions: hardQuestions,
  },
];

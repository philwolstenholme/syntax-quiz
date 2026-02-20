const mdnBaseUrl = 'https://developer.mozilla.org/en-US';

const mdnPages: Record<string, string> = {
  parameter: '/docs/Glossary/Parameter',
  argument: '/docs/Glossary/Argument',
  property: '/docs/Glossary/property/JavaScript',
  callback: '/docs/Glossary/Callback_function',
  tuple: '/docs/Glossary/Tuple',

  'function body': '/docs/Web/JavaScript/Reference/Statements/function',
  'square brackets': '/docs/Web/JavaScript/Reference/Global_Objects/Array',
  'curly braces': '/docs/Web/JavaScript/Reference/Statements/block',
  parentheses: '/docs/Web/JavaScript/Guide/Functions',
  index: '/docs/Web/JavaScript/Reference/Global_Objects/Array#accessing_array_elements',
  destructuring: '/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment',
  'spread operator': '/docs/Web/JavaScript/Reference/Operators/Spread_syntax',
  'spread syntax': '/docs/Web/JavaScript/Reference/Operators/Spread_syntax',
  'ternary operator': '/docs/Web/JavaScript/Reference/Operators/Conditional_operator',
  'optional chaining': '/docs/Web/JavaScript/Reference/Operators/Optional_chaining',
  'nullish coalescing': '/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing',
  'arrow function': '/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
  await: '/docs/Web/JavaScript/Reference/Operators/await',
  inheritance: '/docs/Learn/JavaScript/Objects/Classes_in_JavaScript#inheritance',
  'object literal': '/docs/Web/JavaScript/Reference/Operators/Object_initializer',
  'default export': '/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export',
  'named export': '/docs/Web/JavaScript/Reference/Statements/export',
  'named import': '/docs/Web/JavaScript/Reference/Statements/import',
  void: '/docs/Web/JavaScript/Reference/Operators/void',
  'template literal': '/docs/Web/JavaScript/Reference/Template_literals',
  'default parameter': '/docs/Web/JavaScript/Reference/Functions/Default_parameters',
  'rest parameter': '/docs/Web/JavaScript/Reference/Functions/rest_parameters',
  closure: '/docs/Web/JavaScript/Closures',
  hoisting: '/docs/Glossary/Hoisting',
  promise: '/docs/Web/JavaScript/Reference/Global_Objects/Promise',
  boolean: '/docs/Glossary/Boolean',
  'event handler': '/docs/Web/Events/Event_handlers',
};

export function getMdnUrl(term: string): string {
  const normalizedTerm = term.toLowerCase();

  if (mdnPages[normalizedTerm]) {
    return `${mdnBaseUrl}${mdnPages[normalizedTerm]}`;
  }

  const searchQuery = `${term} AND inurl:https://developer.mozilla.org OR inurl:https://javascript.info OR inurl:https://eloquentjavascript.net OR inurl:https://exploringjs.com OR inurl:https://www.typescriptlang.org/docs OR inurl:https://react.dev/docs OR inurl:https://learntypescript.dev`;
  return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
}

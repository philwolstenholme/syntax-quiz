// Maps quiz terms to specific MDN documentation pages
// Falls back to MDN search if no specific page is available

const mdnBaseUrl = 'https://developer.mozilla.org/en-US';

const mdnPages = {
  // Glossary terms
  parameter: '/docs/Glossary/Parameter',
  argument: '/docs/Glossary/Argument',
  property: '/docs/Glossary/property/JavaScript',
  callback: '/docs/Glossary/Callback_function',
  tuple: '/docs/Glossary/Tuple',

  // JavaScript reference
  'function body': '/docs/Web/JavaScript/Reference/Statements/function',
  'square brackets': '/docs/Web/JavaScript/Reference/Global_Objects/Array',
  'curly braces': '/docs/Web/JavaScript/Reference/Statements/block',
  parentheses: '/docs/Web/JavaScript/Guide/Functions',
  index: '/docs/Web/JavaScript/Reference/Global_Objects/Array#accessing_array_elements',
  destructuring: '/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment',
  'spread operator': '/docs/Web/JavaScript/Reference/Operators/Spread_syntax',
  'ternary operator': '/docs/Web/JavaScript/Reference/Operators/Conditional_operator',
  'optional chaining': '/docs/Web/JavaScript/Reference/Operators/Optional_chaining',
  'nullish coalescing': '/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing',
  'arrow function': '/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
  await: '/docs/Web/JavaScript/Reference/Operators/await',
  inheritance: '/docs/Learn/JavaScript/Objects/Classes_in_JavaScript#inheritance',
  'object literal': '/docs/Web/JavaScript/Reference/Operators/Object_initializer',
  'default export': '/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export',
  'named export': '/docs/Web/JavaScript/Reference/Statements/export',
  void: '/docs/Web/JavaScript/Reference/Operators/void',

  // TypeScript-specific terms - fall back to search
  // These will use the default search fallback
};

/**
 * Get an MDN URL for a quiz term
 * @param {string} term - The quiz answer term
 * @returns {string} The MDN URL (direct page or search)
 */
export function getMdnUrl(term) {
  const normalizedTerm = term.toLowerCase();

  if (mdnPages[normalizedTerm]) {
    return `${mdnBaseUrl}${mdnPages[normalizedTerm]}`;
  }

  // Fall back to MDN search for terms without specific pages
  return `${mdnBaseUrl}/search?q=${encodeURIComponent(term)}`;
}

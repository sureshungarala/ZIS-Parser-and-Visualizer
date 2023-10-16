const TypeDefs = require('./typeDefs.js');

/**
 * Returns the name of the matching key in the JSON.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {string}
 */
function getRuleName(rule, json) {
  // TODO: Use some caching here.
  let key = rule.name;
  if ('keyPattern' in rule) {
    key = Object.keys(json).find((key) => key.match(rule.keyPattern)?.[0]);
  }
  return key ?? '';
}

/**
 * Returns true if the key is present in the JSON.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function mustBePresent(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] !== undefined;
  return [result, result ? '' : `${key} is not present`];
}

/**
 * Returns true if the key is present in the JSON and is not empty.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function mustNotBeEmpty(rule, json) {
  const key = getRuleName(rule, json);
  let result = false;
  const value = json[key];
  if (Array.isArray(value)) {
    result = value.length > 0;
  } else if (typeof value === 'object' && value !== null) {
    result = Object.keys(value).length > 0;
  } else if (typeof value === 'string') {
    result = value.trim() !== '';
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    result = true;
  }
  return [result, result ? '' : `${key} is empty`];
}

/**
 * Returns true if the key is present in the JSON and is not more than the specified length.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function sizeMustNotBeMoreThan(rule, json) {
  const key = getRuleName(rule, json);
  let result = false;
  let error = '';
  const value = json[key];
  const maxLength = rule.maxLength;
  if (Array.isArray(value)) {
    result = value.length <= maxLength;
    error = `${key} must not have more than ${maxLength} ${
      maxLength === 1 ? 'element' : 'elements'
    }.`;
  } else if (typeof value === 'object' && value !== null) {
    result = Object.keys(value).length <= maxLength;
    error = `${key} must not have more than ${maxLength} ${
      maxLength === 1 ? 'element' : 'elements'
    }.`;
  } else if (typeof value === 'string') {
    result = value.length <= maxLength;
    error = `${key} must not be more than ${maxLength} ${
      maxLength === 1 ? 'character' : 'characters'
    }.`;
  }
  return [
    result,
    result
      ? ''
      : error || `${key} must not be more than ${maxLength} characters.`,
  ];
}

/**
 * Returns true if the value is with in the specified range.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function valueMustBeWithIn(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] >= rule.minValue && json[key] <= rule.maxValue;
  return [
    result,
    result
      ? ''
      : `${key} must be with in the range of ${rule.minValue} and ${rule.maxValue}.`,
  ];
}

/**
 * Returns true if the key is one of the specified options.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function keyMustBeOneOf(rule, json) {
  const key = getRuleName(rule, json);
  const result = rule.options.includes(key);
  return [result, result ? '' : `Unknown ${key}.`];
}

/**
 * Returns true if the value is one of the specified options.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function valueMustBeOneOf(rule, json) {
  const key = getRuleName(rule, json);
  const result = rule.options.includes(json[key]);
  return [
    result,
    result
      ? ''
      : `Unknown value. ${key} must be one of ${rule.options.join(', ')}`,
  ];
}

/**
 * Returns true if the value is equal to the specified value.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function mustBeEqualTo(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] === rule.value;
  return [result, result ? '' : `Invalid value. ${key} must be ${rule.value}`];
}

/**
 * Returns true if the key has atleast specified number of children.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function mustHaveMinChildren(rule, json) {
  const key = getRuleName(rule, json);
  const result =
    (Array.isArray(json[key])
      ? json[key].length
      : Object.keys(json[key]).length) >= rule.minChildren;
  return [
    result,
    result ? '' : `${key} must have ${rule.minChildren} children`,
  ];
}

/**
 * Returns true if the value is greater than the specified value.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function mustBeGreaterThan(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] > rule.value;
  return [result, result ? '' : `${key} must be greater than ${rule.value}`];
}

/**
 * Returns true if only one key matches the specified pattern.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function mustMatchOnlyOneKey(rule, json) {
  const regExp = new RegExp(rule.keyPattern);
  let matchedAlready = false;
  Object.keys(json).forEach((key) => {
    const matched = regExp.test(key);
    if (matched && !matchedAlready) {
      matchedAlready = true;
    } else if (matched && matchedAlready) {
      return [false, `Duplicate key found matching pattern ${rule.keyPattern}`];
    }
  });
  return [
    matchedAlready,
    matchedAlready
      ? ''
      : `One of the keys must match pattern ${rule.keyPattern}`,
  ];
}

/**
 * Returns true if the value is not a reference path.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function valueMustNotbeAReferencePath(rule, json) {
  const key = getRuleName(rule, json);
  const result = !String(json[key]).startsWith('$.');
  return [
    result,
    result ? '' : `Value of ${key} must be static and not a reference path`,
  ];
}

/**
 * Returns true if the value is a reference path.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function valueMustbeAReferencePath(rule, json) {
  const key = getRuleName(rule, json);
  const result = String(json[key]).startsWith('$.');
  return [result, result ? '' : `Value of ${key} must be a reference path`];
}

/**
 * Returns true if the key is optional and not present in the JSON.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function isOptional(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] === undefined;
  return [result, result ? '' : `Optional attribute ${rule.name} is present`];
}

/**
 * Executes all the functions / sets of functions passed in and returns true if any of them returns true.
 * @param  {...(Function | Function[])} fns
 * @returns {[boolean, ...string[]]}
 */
function anyOf(...fns) {
  const errors = [];
  return (rule, json) => {
    const result = fns.some((fn) => {
      if (Array.isArray(fn)) {
        return fn.every((childFn) => {
          const [childFnResult, childFnError] = childFn(rule, json);
          if (!childFnResult && childFnError) {
            errors.push(childFnError);
          }
          return childFnResult;
        });
      }
      const [fnResult, fnError] = fn(rule, json);
      fnError && errors.push(fnError);
      return fnResult;
    });
    return [result, ...errors];
  };
}

/**
 * Returns true if the value is of type string.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function isString(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'string';
  return [result, result ? '' : `${key} is not a string`];
}

/**
 * Returns true if the value is of type number.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function isNumber(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'number';
  return [result, result ? '' : `${key} is not a number`];
}

/**
 * Returns true if the value is of type boolean.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function isBoolean(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'boolean';
  return [result, result ? '' : `${key} is not a boolean`];
}

/**
 * Returns true if the value is of type object.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function isObject(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'object';
  return [result, result ? '' : `${key} is not an object`];
}

/**
 * Returns true if the value is of type array.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function isArray(rule, json) {
  const key = getRuleName(rule, json);
  const result = Array.isArray(json[key]);
  return [result, result ? '' : `${key} is not an array`];
}

/**
 * Returns true if the value is of type function.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function isFunction(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'function';
  return [result, result ? '' : `${key} is not a function`];
}

/**
 * Returns true if the value is null.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function isNull(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] === null;
  return [result, result ? '' : `${key} is not null`];
}

/**
 * Returns true if the value is undefined.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json State Object
 * @returns {[boolean, string]}
 */
function isUndefined(rule, json) {
  const result = json[rule.name] === undefined;
  return [result, result ? '' : `${rule.name} is defined`];
}

/**
 * Returns true if the value is a symbol.
 * @param {TypeDefs.Rule} rule
 * @param {Object} json
 * @returns {[boolean, string]}
 */
function isSymbol(rule, json) {
  const result = typeof json[rule.name] === 'symbol';
  return [result, result ? '' : `${rule.name} is not a symbol`];
}

const type = {
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isNull,
  isUndefined,
  isSymbol,
};

const value = {
  anyOf,
  isOptional,
  mustBePresent,
  mustNotBeEmpty,
  sizeMustNotBeMoreThan,
  valueMustBeWithIn,
  keyMustBeOneOf,
  valueMustBeOneOf,
  mustBeEqualTo,
  mustHaveMinChildren,
  mustBeGreaterThan,
  mustMatchOnlyOneKey,
  valueMustbeAReferencePath,
  valueMustNotbeAReferencePath,
};

module.exports = { type, value, getRuleName };

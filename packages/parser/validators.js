function getRuleName(rule, json) {
  // TODO: Use some caching here.
  let key = rule.name;
  if ('keyPattern' in rule) {
    key = Object.keys(json).find((key) => key.match(rule.keyPattern)?.[0]);
  }
  // if (typeof key === 'undefined') {
  //   console.log('getRuleName ', rule, json);
  // }
  return key ?? '';
}

function mustBePresent(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] !== undefined;
  return [result, result ? '' : `${key} is not present`];
}

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

function keyMustBeOneOf(rule, json) {
  const key = getRuleName(rule, json);
  const result = rule.options.includes(key);
  return [result, result ? '' : `Unknown ${key}.`];
}

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

function mustBeEqualTo(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] === rule.value;
  return [result, result ? '' : `Invalid value. ${key} must be ${rule.value}`];
}

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

function mustBeGreaterThan(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] > rule.value;
  return [result, result ? '' : `${key} must be greater than ${rule.value}`];
}

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

function valueMustNotbeAReferencePath(rule, json) {
  const key = getRuleName(rule, json);
  const result = !String(json[key]).startsWith('$.');
  return [
    result,
    result ? '' : `Value of ${key} must be static and not a reference path`,
  ];
}

function valueMustbeAReferencePath(rule, json) {
  const key = getRuleName(rule, json);
  const result = String(json[key]).startsWith('$.');
  return [result, result ? '' : `Value of ${key} must be a reference path`];
}

function isOptional(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] === undefined;
  return [result, result ? '' : `Optional attribute ${rule.name} is present`];
}

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

function isString(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'string';
  return [result, result ? '' : `${key} is not a string`];
}

function isNumber(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'number';
  return [result, result ? '' : `${key} is not a number`];
}

function isBoolean(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'boolean';
  return [result, result ? '' : `${key} is not a boolean`];
}

function isObject(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'object';
  return [result, result ? '' : `${key} is not an object`];
}

function isArray(rule, json) {
  const key = getRuleName(rule, json);
  const result = Array.isArray(json[key]);
  return [result, result ? '' : `${key} is not an array`];
}

function isFunction(rule, json) {
  const key = getRuleName(rule, json);
  const result = typeof json[key] === 'function';
  return [result, result ? '' : `${key} is not a function`];
}

function isNull(rule, json) {
  const key = getRuleName(rule, json);
  const result = json[key] === null;
  return [result, result ? '' : `${key} is not null`];
}

function isUndefined(rule, json) {
  const result = json[rule.name] === undefined;
  return [result, result ? '' : `${rule.name} is defined`];
}

function isSymbol(rule, json) {
  const result = typeof json[rule.name] === 'symbol';
  return [result, result ? '' : `${rule.name} is not a symbol`];
}

function isObjectLike(rule, json) {
  const result = isObject(json[rule.name]) && !isArray(json[rule.name]);
  return [result, result ? '' : `${rule.name} is not object-like`];
}

function isPlainObject(rule, json) {
  const result =
    isObjectLike(json[rule.name]) && json[rule.name].constructor === Object;
  return [result, result ? '' : `${rule.name} is not a plain object`];
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
  isObjectLike,
  isPlainObject,
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

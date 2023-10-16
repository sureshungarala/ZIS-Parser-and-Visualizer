const {
  validateStates,
  validateState,
} = require('../utils/validationHelpers.js');
const { type, value } = require('../utils/validators.js');
const { ruleOperators } = require('../utils/constants.js');

const { isArray, isBoolean, isString, isObject } = type;
const {
  anyOf,
  isOptional,
  mustBeEqualTo,
  mustNotBeEmpty,
  mustHaveMinChildren,
} = value;

const rules = [
  {
    name: 'Type',
    value: 'Map',
    validators: [mustBeEqualTo],
  },
  {
    name: 'InputPath',
    validators: [anyOf(isOptional, [isString, mustNotBeEmpty])],
  },
  {
    name: 'ItemsPath',
    validators: [isString, mustNotBeEmpty],
  },
  {
    name: 'Iterator',
    validators: [isObject, mustHaveMinChildren],
    minChildren: 2,
    children: [
      {
        name: 'StartAt',
        validators: [isString, mustNotBeEmpty],
      },
      {
        name: 'States',
        validators: [isObject, mustHaveMinChildren],
        minChildren: 1,
      },
    ],
  },
  {
    name: 'ResultPath',
    validators: [isString, mustNotBeEmpty],
  },
  {
    execution: ruleOperators.xor,
    children: [
      {
        name: 'Next',
        validators: [isString, mustNotBeEmpty],
      },
      {
        name: 'End',
        value: true,
        validators: [isBoolean, mustBeEqualTo],
      },
    ],
  },
  {
    name: 'Catch',
    validators: [anyOf(isOptional, [isArray, mustHaveMinChildren])],
    minChildren: 1,
  },
];

/**
 * Validates the Map state object against the rules.
 * @param {Object} state State object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function mapStateValidator(state) {
  let [result, ...errors] = validateState(rules, state);
  if (result) {
    const [mapStatesResult, mapStatesErrors] = validateStates(
      state.Iterator.States
    );
    if (!mapStatesResult && mapStatesErrors.length) {
      errors.push(...mapStatesErrors);
      result = false;
    }
  }

  return [result, ...errors];
}

module.exports = mapStateValidator;

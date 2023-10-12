const { validateStates, validateState } = require('../validationHelpers.js');
const { type, value } = require('../validators.js');
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
    validators: [anyOf(isOptional, isString, mustNotBeEmpty)],
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
    validators: [anyOf(isOptional, isArray, mustHaveMinChildren)],
    minChildren: 1,
  },
];

function mapStateValidator(action) {
  let [result, ...errors] = validateState(rules, action);
  if (result) {
    const [mapStatesResult, mapStatesErrors] = validateStates(
      action.Iterator.States
    );
    if (!mapStatesResult && mapStatesErrors.length) {
      errors.push(...mapStatesErrors);
      result = false;
    }
  }

  return [result, ...errors];
}

module.exports = mapStateValidator;

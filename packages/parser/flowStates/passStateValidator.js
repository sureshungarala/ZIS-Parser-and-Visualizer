const { validateState } = require('../validationHelpers.js');
const { type, value } = require('../validators.js');
const { ruleOperators } = require('../utils/constants.js');

const { isBoolean, isObject, isString } = type;
const { anyOf, isOptional, mustBeEqualTo, mustNotBeEmpty } = value;

const rules = [
  {
    name: 'Type',
    value: 'Pass',
    validators: [mustBeEqualTo],
  },
  {
    name: 'Result',
    validators: [anyOf(isOptional, [isObject])],
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
];

function passStateValidator(action) {
  return validateState(rules, action);
}

module.exports = passStateValidator;

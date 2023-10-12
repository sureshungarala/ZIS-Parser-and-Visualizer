const { validateState } = require('../validationHelpers.js');
const { type, value } = require('../validators.js');
const { ruleOperators } = require('../utils/constants.js');

const { isBoolean, isNumber, isString } = type;
const { mustBeEqualTo, mustNotBeEmpty, mustBeGreaterThan } = value;

const rules = [
  {
    name: 'Type',
    value: 'Wait',
    validators: [mustBeEqualTo],
  },
  {
    execution: ruleOperators.xor,
    children: [
      {
        name: 'Seconds',
        value: 0,
        validators: [isNumber, mustBeGreaterThan],
      },
      {
        name: 'SecondsPath',
        validators: [isString, mustNotBeEmpty],
      },
    ],
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

function waitStateValidator(action) {
  return validateState(rules, action);
}

module.exports = waitStateValidator;

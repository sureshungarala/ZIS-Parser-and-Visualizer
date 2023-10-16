const { validateState } = require('../utils/validationHelpers.js');
const { type, value } = require('../utils/validators.js');
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

/**
 * Validates the Wait state object against the rules.
 * @param {Object} state State object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function waitStateValidator(state) {
  return validateState(rules, state);
}

module.exports = waitStateValidator;

const { validateState } = require('../utils/validationHelpers.js');
const { type, value } = require('../utils/validators.js');
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

/**
 * Validates the Pass state object against the rules.
 * @param {Object} state State object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function passStateValidator(state) {
  return validateState(rules, state);
}

module.exports = passStateValidator;

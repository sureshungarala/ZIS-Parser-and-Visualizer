const { validateState } = require('../utils/validationHelpers.js');
const { type, value } = require('../utils/validators.js');

const { isString } = type;
const { mustBeEqualTo, mustNotBeEmpty } = value;

const rules = [
  {
    name: 'Type',
    value: 'Fail',
    validators: [mustBeEqualTo],
  },
  {
    name: 'Error',
    validators: [isString, mustNotBeEmpty],
  },
  {
    name: 'Cause',
    validators: [isString, mustNotBeEmpty],
  },
];

/**
 * Validates the Fail state object against the rules.
 * @param {Object} state State object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function failStateValidator(state) {
  return validateState(rules, state);
}

module.exports = failStateValidator;

const { validateState } = require('../utils/validationHelpers.js');
const { type, value } = require('../utils/validators.js');

const { isString } = type;
const { anyOf, isOptional, mustBeEqualTo } = value;

const rules = [
  {
    name: 'Type',
    value: 'Succeed',
    validators: [mustBeEqualTo],
  },
  {
    name: 'Message',
    validators: [anyOf(isOptional, [isString])],
  },
];

/**
 * Validates the Succeed state object against the rules.
 * @param {Object} state State object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function succeedStateValidator(state) {
  return validateState(rules, state);
}

module.exports = succeedStateValidator;

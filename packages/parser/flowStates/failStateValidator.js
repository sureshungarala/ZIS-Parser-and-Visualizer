const { validateState } = require('../validationHelpers.js');
const { type, value } = require('../validators.js');

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

function failStateValidator(action) {
  return validateState(rules, action);
}

module.exports = failStateValidator;

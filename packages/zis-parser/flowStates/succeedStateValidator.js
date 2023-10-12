const { validateState } = require('../validationHelpers.js');
const { type, value } = require('../validators.js');

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

function succeedStateValidator(action) {
  return validateState(rules, action);
}

module.exports = succeedStateValidator;

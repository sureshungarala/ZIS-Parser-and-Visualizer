const {
  type: typeValidators,
  value: valueValidators,
} = require('../utils/validators.js');
const { validateState } = require('../utils/validationHelpers.js');
const TypeDefs = require('../utils/typeDefs.js');

const { isString, isObject } = typeValidators;
const { mustNotBeEmpty, sizeMustNotBeMoreThan, mustBeEqualTo } =
  valueValidators;

/**
 * @type {Array<TypeDefs.Rule>}
 * rules for ZIS flow
 */
const flowRules = [
  {
    name: 'type',
    value: 'ZIS::Flow',
    validators: [mustBeEqualTo],
  },
  {
    name: 'properties',
    validators: [isObject],
    children: [
      {
        name: 'name',
        maxLength: 50,
        validators: [isString, mustNotBeEmpty, sizeMustNotBeMoreThan],
      },
      {
        name: 'definition',
        validators: [isObject],
        children: [
          {
            name: 'StartAt',
            validators: [isString, mustNotBeEmpty],
          },
          {
            name: 'States',
            validators: [isObject, mustNotBeEmpty],
          },
        ],
      },
    ],
  },
];

/**
 * Validates the flow object structure against the rules.
 * @param {Object} flow Flow Object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function flowValidator(flow) {
  return validateState(flowRules, flow);
}

module.exports = flowValidator;

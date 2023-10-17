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
 * rules for ZIS job spec
 */
const jobSpecRules = [
  {
    name: 'type',
    value: 'ZIS::JobSpec',
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
        name: 'event_source',
        validators: [isString, mustNotBeEmpty],
      },
      {
        name: 'event_type',
        validators: [isString, mustNotBeEmpty],
      },
      {
        name: 'flow_name',
        maxLength: 100,
        validators: [isString, mustNotBeEmpty, sizeMustNotBeMoreThan],
      },
    ],
  },
];

/**
 * Validates the Job Spec against the rules.
 * @param {Object} jobSpec Job Spec Object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function jobSpecValidator(jobSpec) {
  return validateState(jobSpecRules, jobSpec);
}

module.exports = jobSpecValidator;

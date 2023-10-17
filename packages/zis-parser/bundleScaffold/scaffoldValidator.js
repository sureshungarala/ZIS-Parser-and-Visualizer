const {
  type: typeValidators,
  value: valueValidators,
} = require('../utils/validators.js');
const { validateState } = require('../utils/validationHelpers.js');
const TypeDefs = require('../utils/typeDefs.js');

const { isString, isObject } = typeValidators;
const {
  mustNotBeEmpty,
  sizeMustNotBeMoreThan,
  valueMustBeOneOf,
  mustHaveMinChildren,
} = valueValidators;

/**
 * @type {Array<TypeDefs.Rule>}
 * rules for ZIS bundle scaffold
 */
const bundleScaffoldRules = [
  {
    name: 'zis_template_version',
    validators: [isString, mustNotBeEmpty, valueMustBeOneOf],
    options: ['2019-10-14'],
  },
  {
    name: 'name',
    validators: [isString, mustNotBeEmpty, sizeMustNotBeMoreThan],
    maxLength: 50,
  },
  {
    name: 'description',
    validators: [isString, sizeMustNotBeMoreThan],
    maxLength: 100,
  },
  {
    name: 'resources',
    validators: [isObject, mustHaveMinChildren],
    minChildren: 2,
    // children: [
    //   {
    //     name: '',
    //     children: jobSpecRules,
    //   },
    //   {
    //     name: '',
    //     children: flowRules,
    //   },
    // ],
  },
];

/**
 * Validates the bundle structure against the rules.
 * @param {Object} bundle ZIS bundle
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function scaffoldValidator(bundle) {
  return validateState(bundleScaffoldRules, bundle);
}

module.exports = scaffoldValidator;

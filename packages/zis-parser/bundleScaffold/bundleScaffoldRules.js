const {
  type: typeValidators,
  value: valueValidators,
} = require('../utils/validators.js');
const { isString, isObject } = typeValidators;
const {
  mustBeEqualTo,
  mustNotBeEmpty,
  sizeMustNotBeMoreThan,
  valueMustBeOneOf,
  mustHaveMinChildren,
} = valueValidators;

const TypeDefs = require('../utils/typeDefs.js');

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
    validators: [isObject, mustHaveMinChildren],
    minChildren: 2,
    children: [
      {
        name: 'name',
        maxLength: 50,
        validators: [isString, mustNotBeEmpty, sizeMustNotBeMoreThan],
      },
      {
        name: 'definition',
        validators: [isObject, mustHaveMinChildren],
        minChildren: 2,
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
 * @type {Array<TypeDefs.Rule>}
 * rules for ZIS bundle scaffold
 */
const outerScaffoldRules = [
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
    children: [
      {
        name: '',
        children: jobSpecRules,
      },
      {
        name: '',
        children: flowRules,
      },
    ],
  },
];

module.exports = {
  outerScaffoldRules,
  flowRules,
  jobSpecRules,
};

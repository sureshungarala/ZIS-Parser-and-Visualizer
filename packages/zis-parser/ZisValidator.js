const {
  type: typeValidators,
  value: valueValidators,
} = require('./validators.js');
const {
  validateStates,
  validateState,
  constructStatesList,
} = require('./validationHelpers.js');
const { prefixMsg } = require('./utils/helpers.js');

const { isString, isObject } = typeValidators;
const {
  mustNotBeEmpty,
  sizeMustNotBeMoreThan,
  valueMustBeOneOf,
  mustBeEqualTo,
  mustHaveMinChildren,
} = valueValidators;

// rules for ZIS job spec
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

// rules for ZIS flow
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

// rules for ZIS bundle scaffold
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

/**
 * Validates a ZIS bundle
 * @param {JSON} jsonBundle
 */
function ZisValidator(jsonBundle) {
  this.json = jsonBundle;
  this.errors = [];

  const resources = this.json['resources'];
  this.jobSpecs = Object.values(resources).filter(
    (value) => value.type === 'ZIS::JobSpec'
  );
  this.flows = Object.values(resources).filter(
    (value) => value.type === 'ZIS::Flow'
  );
}

ZisValidator.prototype.validate = function () {
  // validate bundle scaffold
  let [scaffoldResult, ...scaffoldErrors] = validateState(
    bundleScaffoldRules,
    this.json
  );

  if (!scaffoldResult && scaffoldErrors.length > 0)
    this.errors.push(...scaffoldErrors);

  // validate job specs
  if (this.errors.length === 0) {
    for (const jobSpec of this.jobSpecs) {
      const [jobSpecResult, ...jobSpecErrors] = validateState(
        jobSpecRules,
        jobSpec
      );
      if (!jobSpecResult && jobSpecErrors.length > 0)
        this.errors.push(
          ...jobSpecErrors.map((error) =>
            prefixMsg(error, jobSpec.properties.name)
          )
        );
    }
  }

  // validate flows
  if (this.errors.length === 0) {
    for (const flow of this.flows) {
      const [flowResult, ...flowErrors] = validateState(flowRules, flow);
      if (!flowResult && flowErrors.length > 0)
        this.errors.push(
          ...flowErrors.map((error) => prefixMsg(error, flow.properties.name))
        );

      // validate flow states
      if (this.errors.length === 0) {
        const [statesResult, ...statesErrors] = validateStates(
          flow.properties.definition.States
        );
        if (!statesResult && statesErrors.length > 0)
          this.errors.push(...statesErrors);
      }
    }
  }

  return [this.errors.length === 0, this.errors];
};

ZisValidator.prototype.constructStatesFlow = function () {
  return this.flows.map((flow) =>
    constructStatesList(
      flow.properties.definition.States,
      flow.properties.definition.StartAt
    )
  );
};

module.exports = ZisValidator;

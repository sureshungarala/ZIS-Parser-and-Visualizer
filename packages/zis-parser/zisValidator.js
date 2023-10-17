const {
  validateStates,
  constructStatesList,
} = require('./utils/validationHelpers.js');
const scaffoldValidator = require('./bundleScaffold/scaffoldValidator.js');
const jobSpecValidator = require('./bundleScaffold/jobSpecValidator.js');
const flowValidator = require('./bundleScaffold/flowValidator.js');
const { prefixMsg } = require('./utils/helpers.js');
const TypeDefs = require('./utils/typeDefs.js');

/**
 * Validates a ZIS bundle
 * @class
 * @param {Object} jsonBundle ZIS bundle
 */
function ZisValidator(jsonBundle) {
  this.json = jsonBundle;

  /**
   * @type {Array<string>}
   */
  this.errors = [];

  /**
   * @type {Object}
   */
  const resources = this.json['resources'] ?? {};

  /**
   * @type {Array<Object>}
   */
  const jobSpecs = Object.values(resources).filter(
    (value) => value.type === 'ZIS::JobSpec'
  );
  this.jobSpecs = jobSpecs;

  /**
   * @type {Array<Object>}
   */
  const flows = Object.values(resources).filter(
    (value) => value.type === 'ZIS::Flow'
  );
  this.flows = flows;
}

/**
 * Validates the ZIS bundle against the rules.
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
ZisValidator.prototype.validate = function () {
  // validate bundle scaffold
  let [scaffoldResult, ...scaffoldErrors] = scaffoldValidator(this.json);

  if (!scaffoldResult && scaffoldErrors.length > 0)
    this.errors.push(...scaffoldErrors);

  // validate job specs
  if (this.errors.length === 0) {
    for (const jobSpec of this.jobSpecs) {
      const [jobSpecResult, ...jobSpecErrors] = jobSpecValidator(jobSpec);
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
      const [flowResult, ...flowErrors] = flowValidator(flow);
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

/**
 * Constructs the states flow paths for flow properties definition.
 * @returns {Array<Array<TypeDefs.StatePath>>} Array of state paths for each flow
 */
ZisValidator.prototype.constructStatesFlow = function () {
  return this.flows.map((flow) =>
    constructStatesList(
      flow.properties.definition.States,
      flow.properties.definition.StartAt
    )
  );
};

module.exports = ZisValidator;

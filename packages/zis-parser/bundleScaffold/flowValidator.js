const { validateState } = require('../utils/validationHelpers.js');
const { flowRules } = require('./bundleScaffoldRules.js');

/**
 * Validates the flow object structure against the rules.
 * @param {Object} flow Flow Object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function flowValidator(flow) {
  return validateState(flowRules, flow);
}

module.exports = flowValidator;

const { validateState } = require('../utils/validationHelpers.js');
const { jobSpecRules } = require('./bundleScaffoldRules.js');

/**
 * Validates the Job Spec against the rules.
 * @param {Object} jobSpec Job Spec Object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function jobSpecValidator(jobSpec) {
  return validateState(jobSpecRules, jobSpec);
}

module.exports = jobSpecValidator;

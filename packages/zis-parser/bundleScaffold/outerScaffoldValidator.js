const { validateState } = require('../utils/validationHelpers.js');
const { outerScaffoldRules } = require('./bundleScaffoldRules.js');

/**
 * Validates the bundle structure against the rules.
 * @param {Object} bundle ZIS bundle
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function scaffoldValidator(bundle) {
  return validateState(outerScaffoldRules, bundle);
}

module.exports = scaffoldValidator;

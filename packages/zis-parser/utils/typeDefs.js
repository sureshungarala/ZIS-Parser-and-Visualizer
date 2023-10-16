/**
 * @namespace TypeDefs
 */

/**
 * @typedef {Object} Rule
 * @property {string=} name Name of the property
 * @property {string=} value Value of the property
 * @property {string=} keyPattern Regex pattern to match the key
 * @property {Array<string>=} options List of valid options for the property value
 * @property {number=} maxLength Max length of the property value. Can be used for string, object and array types.
 * @property {number=} minChildren Min number of children for the property value. Can be used for object and array types.
 * @property {Array<Rule>=} children List of rules for the children of the property value.
 * @property {Array<Function>=} validators List of validator functions for the property value.
 * @property {string=} execution Can be one of either ruleOperators or dataOperators in constants.
 * @property {Array<Function>=} shouldValidateChildren List of validator functions to decide whether to validate the children or not.
 * @memberof TypeDefs
 */

/**
 * @typedef {Object} SourceState
 * @property {string} name State name
 * @property {string} type State type
 * @property {number=} childPathId Index of the Next/Catch child path, defaults to -1 for `default` case in ChoiceState
 * @property {Array<StatePath>=} childPaths
 */

/**
 * @typedef {Object} TargetState
 * @property {string} name
 * @property {string} type
 */

/**
 * @typedef {[SourceState, TargetState]} StatePath
 * @memberof TypeDefs
 */

module.exports = {};

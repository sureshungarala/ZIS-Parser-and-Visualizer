const { getRuleName } = require('./validators.js');
const { prefixMsg } = require('./helpers.js');
const { dataOperators, ruleOperators } = require('./constants.js');
const TypeDefs = require('./typeDefs.js');

/**
 * Validates the state object against the rules.
 * @param {Array<TypeDefs.Rule>} rules
 * @param {Object} json State object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function validateState(rules, json) {
  const errors = [];
  if (typeof json !== 'object') {
    return [false, 'Invalid JSON value'];
  }

  let result = rules.every((rule) => {
    const ruleName = getRuleName(rule, json) ?? '';
    if ('execution' in rule) {
      if (rule.execution === dataOperators.all) {
        return Object.values(json).every((value) => {
          const [result, ...ruleErrors] = validateState(rule.children, value);
          if (!result) {
            errors.push(`Not all children are valid.`);
            if (ruleErrors.length) {
              errors.push(...ruleErrors);
            }
          }
          return result;
        });
      } else {
        const childrenResult = rule.children
          .map((child) => validateState([child], json))
          .reduce(
            ([results, rulesErrors], [result, ...ruleErrors]) => {
              results.push(result);
              if (!result && ruleErrors.length) {
                rulesErrors.push(...ruleErrors);
              }
              return [results, rulesErrors];
            },
            [[], []]
          );
        const validOptions = childrenResult[0].filter((result) => result);
        if (rule.execution === ruleOperators.allOf) {
          if (validOptions.length !== rule.children.length) {
            errors.push(`Not valid or missing few properties.`);
            errors.push(...childrenResult[1]);
            return false;
          }
          return true;
        } else if (rule.execution === ruleOperators.xor) {
          if (validOptions.length === 0) {
            errors.push(`Does not contain any valid properties.`);
            errors.push(...childrenResult[1]);
            return false;
          } else if (validOptions.length > 1) {
            errors.push(`Must have only one of the properties.`);
            return false;
          }
          return true;
        } else if (rule.execution === ruleOperators.or) {
          if (validOptions.length === 0) {
            errors.push(
              `Not valid. It must have atleast one of the required properties.`
            );
            errors.push(...childrenResult[1]);
            return false;
          }
          return true;
        } else {
          errors.push(`Invalid execution operator '${rule.execution}'.`);
          return false;
        }
      }
    } else {
      let parentResult = true;
      if (rule.validators?.length) {
        parentResult = rule.validators?.every((validator) => {
          const [result, ...stepErrors] = validator(rule, json);
          if (!result && stepErrors.length) {
            errors.push(
              ...stepErrors.map((error) => prefixMsg(error, ruleName))
            );
          }
          return result;
        });
      }
      if (rule.name === '' && rule.children?.length) {
        const matchedIndex = Object.values(json).findIndex((value) => {
          const [result, ..._stepErrors] = validateState(rule.children, value);
          return result;
        });
        if (matchedIndex === -1) {
          const [result, ...ruleErrors] = validateState(rule.children, json);
          if (!result && ruleErrors.length) {
            errors.push(
              `No matching object of ${rule.children[0].name ?? ''} =>${
                rule.children[0].value ?? ''
              } found.`
            );
            errors.push(...ruleErrors);
          }
          return result || false;
        }
        return true;
      } else if (
        parentResult &&
        rule.children?.length &&
        (!('shouldValidateChildren' in rule) ||
          !rule.shouldValidateChildren?.length ||
          rule.shouldValidateChildren.every(
            (validator) => validator(rule, json)[0]
          ))
      ) {
        // for optional objects with required properties if the object exists.
        const [result, ...ruleErrors] = validateState(
          rule.children,
          json[rule.name]
        );
        if (!result && ruleErrors.length) {
          errors.push(...ruleErrors.map((error) => prefixMsg(error, ruleName)));
        }
        return result;
      } else {
        return parentResult;
      }
    }
  });
  return [result, ...errors];
}

/**
 * Validates the states object against the rules.
 * @param {Object} states States object in the flow properties definition.
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function validateStates(states) {
  const errors = [];
  for (const [key, value] of Object.entries(states)) {
    let stateResult = [];
    if (value.Type === 'Action') {
      stateResult = actionStateValidator(value);
    } else if (value.Type === 'Choice') {
      stateResult = choiceStateValidator(value);
    } else if (value.Type === 'Pass') {
      stateResult = passStateValidator(value);
    } else if (value.Type === 'Map') {
      stateResult = mapStateValidator(value);
    } else if (value.Type === 'Succeed') {
      stateResult = succeedStateValidator(value);
    } else if (value.Type === 'Fail') {
      stateResult = failStateValidator(value);
    } else if (value.Type === 'Wait') {
      stateResult = waitStateValidator(value);
    } else {
      errors.push(`Invalid state type '${value.Type}' for state '${key}'.`);
    }
    const [result, ...stateErrors] = stateResult;
    if (!result && stateErrors.length) {
      const currentStateErrors = [...new Set(stateErrors)].map((error) =>
        prefixMsg(error, key)
      );
      // console.log('currentStateErrors ', currentStateErrors);
      errors.push(...currentStateErrors);
    }
  }
  return [errors.length === 0, errors];
}

/**
 * Constructs the states list for charting from the states object.
 * @param {Object} states States object in the flow properties definition.
 * @param {string} startAt  StartAt object in the flow properties definition
 * @returns {Array<TypeDefs.StatePath>} statePathList
 */
function constructStatesList(states, startAt) {
  let statesList = [];
  let currentStateName = startAt;
  while (currentStateName in states) {
    const currentState = states[currentStateName];
    if (currentState.Type === 'Map') {
      statesList.push(
        {
          name: currentStateName,
          type: currentState.Type,
          childPaths: constructStatesList(
            currentState.Iterator.States,
            currentState.Iterator.StartAt
          ),
        },
        { name: currentState.Next, type: states[currentState.Next].Type }
      );
      statesList.push(
        constructStatesList(
          currentState.Iterator.States,
          currentState.Iterator.StartAt
        )
      );
    } else if (currentState.Type === 'Choice') {
      // insert default path first
      if (currentState.Default) {
        statesList.push([
          {
            name: currentStateName,
            type: currentState.Type,
            childPathId: -1, // TODO: represents default path => will be used to show the downward path in choice
            childPaths: constructStatesList(states, currentState.Default),
          },
          {
            name: currentState.Default,
            type: states[currentState.Default].Type,
          },
        ]);
      }

      const choices = Object.values(currentState.Choices);
      choices.forEach((choice, index) => {
        if (choice.Next) {
          statesList.push([
            {
              name: currentStateName,
              type: currentState.Type,
              childPathId: index,
              childPaths: constructStatesList(states, choice.Next),
            },
            { name: choice.Next, type: states[choice.Next].Type },
          ]);
        }
      });

      break;
    } else if (
      currentState.Type === 'Succeed' ||
      currentState.Type === 'Fail' ||
      'End' in currentState
    ) {
      statesList.push([
        { name: currentStateName, type: currentState.Type },
        { name: 'End', type: 'End' },
      ]);
    } else {
      statesList.push([
        { name: currentStateName, type: currentState.Type },
        { name: currentState.Next, type: states[currentState.Next].Type },
      ]);

      if ('Catch' in currentState) {
        currentState.Catch.forEach((errorCatch, index) => {
          if (errorCatch.Next) {
            statesList.push([
              {
                name: currentStateName,
                type: currentState.Type,
                childPathId: index,
                childPaths: constructStatesList(states, errorCatch.Next),
              },
              { name: errorCatch.Next, type: states[errorCatch.Next].Type },
            ]);
          }
        });
      }
    }
    currentStateName = currentState.Next;
  }
  return statesList;
}

module.exports = { validateState, validateStates, constructStatesList };

// placing it below the exports to avoid circular dependency error 🤦‍♂️.
const actionStateValidator = require('../flowStates/actionStateValidator.js');
const succeedStateValidator = require('../flowStates/succeedStateValidator.js');
const failStateValidator = require('../flowStates/failStateValidator.js');
const waitStateValidator = require('../flowStates/waitStateValidator.js');
const passStateValidator = require('../flowStates/passStateValidator.js');
const choiceStateValidator = require('../flowStates/choiceStateValidator.js');
const mapStateValidator = require('../flowStates/mapStateValidator.js');

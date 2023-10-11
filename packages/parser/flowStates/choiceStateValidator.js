var { validateState } = require('../validationHelpers.js');
const { type, value } = require('../validators.js');
const {
  ruleOperators,
  dataOperators,
  choiceOperators,
  comparisonOperators,
  pathComparisonOperators,
} = require('../utils/constants.js');

const { isArray, isObject, isString, isNumber, isBoolean } = type;
const {
  anyOf,
  isOptional,
  mustBeEqualTo,
  mustNotBeEmpty,
  mustHaveMinChildren,
  valueMustbeAReferencePath,
  valueMustNotbeAReferencePath,
} = value;

const rules = [
  {
    name: 'Type',
    value: 'Choice',
    validators: [mustBeEqualTo],
  },
  {
    name: 'Comment',
    validators: [anyOf(isOptional, [isString])],
  },
  {
    name: 'Choices',
    validators: [mustHaveMinChildren],
    minChildren: 1,
    children: [
      {
        execution: dataOperators.all,
        children: [
          {
            name: 'Next',
            validators: [isString, mustNotBeEmpty],
          },
          {
            execution: ruleOperators.xor,
            children: [
              {
                name: choiceOperators.and,
                validators: [isArray, mustNotBeEmpty, mustHaveMinChildren],
                minChildren: 1,
                children: [
                  {
                    execution: dataOperators.all,
                    children: [
                      {
                        name: 'Variable',
                        validators: [
                          isString,
                          mustNotBeEmpty,
                          valueMustbeAReferencePath,
                        ],
                      },
                      {
                        execution: ruleOperators.xor,
                        children: [
                          {
                            name: '',
                            validators: [
                              anyOf(isString, isNumber, isBoolean),
                              valueMustNotbeAReferencePath,
                            ],
                            keyPattern: Object.values(comparisonOperators)
                              .map((operator) => `^${operator}$`)
                              .join('|'),
                          },
                          {
                            name: '',
                            validators: [
                              anyOf(isString, isNumber, isBoolean),
                              mustNotBeEmpty,
                              valueMustbeAReferencePath,
                            ],
                            keyPattern: Object.values(pathComparisonOperators)
                              .map((operator) => `^${operator}$`)
                              .join('|'),
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: choiceOperators.or,
                validators: [isArray, mustNotBeEmpty, mustHaveMinChildren],
                minChildren: 1,
                children: [
                  {
                    execution: dataOperators.all,
                    children: [
                      {
                        name: 'Variable',
                        validators: [
                          isString,
                          mustNotBeEmpty,
                          valueMustbeAReferencePath,
                        ],
                      },
                      {
                        execution: ruleOperators.xor,
                        children: [
                          {
                            name: '',
                            validators: [
                              anyOf(isString, isNumber, isBoolean),
                              valueMustNotbeAReferencePath,
                            ],
                            keyPattern: Object.values(comparisonOperators)
                              .map((operator) => `^${operator}$`)
                              .join('|'),
                          },
                          {
                            name: '',
                            validators: [
                              anyOf(isString, isNumber, isBoolean),
                              mustNotBeEmpty,
                              valueMustbeAReferencePath,
                            ],
                            keyPattern: Object.values(pathComparisonOperators)
                              .map((operator) => `^${operator}$`)
                              .join('|'),
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: choiceOperators.not,
                validators: [isObject, mustNotBeEmpty],
                children: [
                  {
                    name: 'Variable',
                    validators: [
                      isString,
                      mustNotBeEmpty,
                      valueMustbeAReferencePath,
                    ],
                  },
                  {
                    execution: ruleOperators.xor,
                    children: [
                      {
                        name: '',
                        validators: [
                          anyOf(isString, isNumber, isBoolean),
                          valueMustNotbeAReferencePath,
                        ],
                        keyPattern: Object.values(comparisonOperators)
                          .map((operator) => `^${operator}$`)
                          .join('|'),
                      },
                      {
                        name: '',
                        validators: [
                          anyOf(isString, isNumber, isBoolean),
                          mustNotBeEmpty,
                          valueMustbeAReferencePath,
                        ],
                        keyPattern: Object.values(pathComparisonOperators)
                          .map((operator) => `^${operator}$`)
                          .join('|'),
                      },
                    ],
                  },
                ],
              },
              {
                execution: ruleOperators.allOf,
                children: [
                  {
                    name: 'Variable',
                    validators: [
                      isString,
                      mustNotBeEmpty,
                      valueMustbeAReferencePath,
                    ],
                  },
                  {
                    execution: ruleOperators.xor,
                    children: [
                      {
                        name: '',
                        validators: [
                          anyOf(isString, isNumber, isBoolean),
                          valueMustNotbeAReferencePath,
                        ],
                        keyPattern: Object.values(comparisonOperators)
                          .map((operator) => `^${operator}$`)
                          .join('|'),
                      },
                      {
                        name: '',
                        validators: [
                          anyOf(isString, isNumber, isBoolean),
                          mustNotBeEmpty,
                          valueMustbeAReferencePath,
                        ],
                        keyPattern: Object.values(pathComparisonOperators)
                          .map((operator) => `^${operator}$`)
                          .join('|'),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Default',
    validators: [anyOf(isOptional, [isString, mustNotBeEmpty])],
  },
];

function choiceStateValidator(action) {
  return validateState(rules, action);
}

module.exports = choiceStateValidator;

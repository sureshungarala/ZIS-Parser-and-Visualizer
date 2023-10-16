const { validateState } = require('../utils/validationHelpers.js');
const { type, value } = require('../utils/validators.js');
const {
  actionTypes,
  ruleOperators,
  builtInActionNames,
} = require('../utils/constants.js');

const { isArray, isBoolean, isNumber, isObject, isString } = type;
const {
  anyOf,
  isOptional,
  mustNotBeEmpty,
  mustBeEqualTo,
  mustHaveMinChildren,
  mustMatchOnlyOneKey,
  valueMustBeWithIn,
} = value;

const rules = [
  {
    name: 'Type',
    value: 'Action',
    validators: [mustBeEqualTo],
  },
  {
    name: 'ActionName',
    validators: [mustNotBeEmpty],
  },
  {
    name: 'ResultPath',
    validators: [isString, mustNotBeEmpty],
  },
  {
    name: 'Comment',
    validators: [anyOf(isOptional, [isString])],
  },
  {
    execution: ruleOperators.xor,
    children: [
      {
        name: 'Next',
        validators: [isString, mustNotBeEmpty],
      },
      {
        name: 'End',
        value: true,
        validators: [isBoolean, mustBeEqualTo],
      },
    ],
  },
  {
    name: 'Catch',
    validators: [anyOf(isOptional, [isArray, mustHaveMinChildren])],
    minChildren: 1,
  },
];

function propertiesRules(action) {
  let rules = [];
  const { ActionName } = action;
  let match = new RegExp(actionTypes.builtInActionName).exec(ActionName);
  if (match !== null) {
    const buildInActionName = match[1];
    if (buildInActionName === builtInActionNames.loadConfig) {
      rules = [
        {
          name: 'Parameters',
          validators: [isObject, mustHaveMinChildren],
          minChildren: 1,
          children: [
            {
              name: '',
              validators: [mustMatchOnlyOneKey, mustNotBeEmpty],
              keyPattern: /scope(\.\$)?$/,
            },
          ],
        },
      ];
    } else if (buildInActionName === builtInActionNames.pathConfig) {
      rules = [
        {
          name: 'Parameters',
          validators: [isObject, mustHaveMinChildren],
          minChildren: 2,
          children: [
            {
              name: '',
              validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
              keyPattern: /scope(\.\$)?$/,
            },
            {
              name: 'config',
              validators: [isObject, mustNotBeEmpty],
            },
          ],
        },
      ];
    } else if (buildInActionName === builtInActionNames.loadLinks) {
      rules = [
        {
          name: 'Parameters',
          validators: [isObject, mustHaveMinChildren],
          minChildren: 2,
          children: [
            {
              name: '',
              validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
              keyPattern: /link_type(\.\$)?$/,
            },
            {
              execution: ruleOperators.or,
              children: [
                {
                  name: '',
                  validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
                  keyPattern: /left_object_name(\.\$)?$/,
                },
                {
                  name: '',
                  validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
                  keyPattern: /right_object_name(\.\$)?$/,
                },
              ],
            },
            {
              name: '',
              validators: [anyOf(isOptional, [isNumber, valueMustBeWithIn])],
              keyPattern: /page_size(\.\$)?$/,
              minValue: 1,
              maxValue: 100,
            },
            {
              name: '',
              validators: [
                anyOf(isOptional, [
                  mustMatchOnlyOneKey,
                  isString,
                  mustNotBeEmpty,
                ]),
              ],
              keyPattern: /page_after_cursor(\.\$)?$/,
            },
            {
              name: '',
              validators: [
                anyOf(isOptional, [
                  mustMatchOnlyOneKey,
                  isString,
                  mustNotBeEmpty,
                ]),
              ],
              keyPattern: /page_before_cursor(\.\$)?$/,
            },
          ],
        },
      ];
    } else if (buildInActionName === builtInActionNames.createLink) {
      rules = [
        {
          name: 'Parameters',
          validators: [isObject, mustHaveMinChildren],
          minChildren: 3,
          children: [
            {
              name: '',
              validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
              keyPattern: /link_type(\.\$)?$/,
            },
            {
              name: 'left_object',
              validators: [isObject, mustNotBeEmpty],
              children: [
                {
                  // TODO: add pattern validation to value
                  name: '',
                  validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
                  keyPattern: /name(\.\$)?$/,
                },
                {
                  name: 'metadata',
                  validators: [anyOf(isOptional, [isObject])],
                },
              ],
            },
            {
              name: 'right_object',
              validators: [isObject, mustNotBeEmpty],
              children: [
                {
                  // TODO: add pattern validation to value
                  name: '',
                  validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
                  keyPattern: /name(\.\$)?$/,
                },
                {
                  name: 'metadata',
                  validators: [anyOf(isOptional, [isObject])],
                },
              ],
            },
          ],
        },
      ];
    } else if (buildInActionName === builtInActionNames.deleteLink) {
      rules = [
        {
          name: 'Parameters',
          validators: [isObject, mustHaveMinChildren],
          minChildren: 3,
          children: [
            {
              name: '',
              validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
              keyPattern: /link_type(\.\$)?$/,
            },
            {
              name: '',
              validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
              keyPattern: /left_object_name(\.\$)?$/,
            },
            {
              name: '',
              validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
              keyPattern: /right_object_name(\.\$)?$/,
            },
          ],
        },
      ];
    } else if (buildInActionName === builtInActionNames.patchLink) {
      rules = [
        {
          name: 'Parameters',
          validators: [isObject, mustHaveMinChildren],
          minChildren: 3,
          children: [
            {
              name: '',
              validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
              keyPattern: /link_type(\.\$)?$/,
            },
            {
              name: '',
              validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
              keyPattern: /left_object_name(\.\$)?$/,
            },
            {
              name: '',
              validators: [
                anyOf(isOptional, [
                  mustMatchOnlyOneKey,
                  isString,
                  mustNotBeEmpty,
                ]),
              ],
              keyPattern: /right_object_name(\.\$)?$/,
            },
            {
              execution: ruleOperators.or,
              children: [
                {
                  name: 'left_object',
                  validators: [isObject, mustNotBeEmpty],
                  children: [
                    {
                      // TODO: add pattern validation to value
                      name: '',
                      validators: [
                        mustMatchOnlyOneKey,
                        isString,
                        mustNotBeEmpty,
                      ],
                      keyPattern: /name(\.\$)?$/,
                    },
                    {
                      name: 'metadata',
                      validators: [anyOf(isOptional, [isObject])],
                    },
                  ],
                },
                {
                  name: 'right_object',
                  validators: [isObject, mustNotBeEmpty],
                  children: [
                    {
                      // TODO: add pattern validation to value
                      name: '',
                      validators: [
                        mustMatchOnlyOneKey,
                        isString,
                        mustNotBeEmpty,
                      ],
                      keyPattern: /name(\.\$)?$/,
                    },
                    {
                      name: 'metadata',
                      validators: [anyOf(isOptional, [isObject])],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
    } else {
      return [];
    }
  } else if (
    (match =
      new RegExp(actionTypes.transformActionName).exec(ActionName) !== null)
  ) {
    rules = [
      {
        name: 'Parameters',
        validators: [isObject, mustHaveMinChildren],
        minChildren: 2,
        children: [
          {
            name: 'expr',
            validators: [isString, mustNotBeEmpty],
          },
          {
            name: '',
            validators: [mustMatchOnlyOneKey, isString, mustNotBeEmpty],
            keyPattern: /data(\.\$)?$/,
          },
        ],
      },
    ];
  } else if (
    (match = new RegExp(actionTypes.httpActionName).exec(ActionName) !== null)
  ) {
    rules = [
      {
        name: 'Parameters',
        validators: [anyOf(isOptional, isObject)],
      },
    ];
  } else {
    return [];
  }
  return rules;
}

/**
 * Validates the Action staet object against the rules.
 * @param {Object} state State object
 * @returns {[boolean, ...string[]]} [result, ...errors]
 */
function actionStateValidator(state) {
  const propertyRules = propertiesRules(state);
  if (!propertyRules.length) {
    return [false, `ActionName: ${state.ActionName} is not supported`];
  } else {
    return validateState([...rules, ...propertyRules], state);
  }
}

module.exports = actionStateValidator;

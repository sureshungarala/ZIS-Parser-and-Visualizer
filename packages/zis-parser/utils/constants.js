const ruleOperators = {
  allOf: 'AllOf',
  or: 'Or',
  xor: 'Xor',
};

const dataOperators = {
  all: 'All',
  some: 'Some',
};

const choiceOperators = {
  and: 'And',
  not: 'Not',
  or: 'Or',
};

const flowStateTypes = {
  action: 'Action',
  choice: 'Choice',
  fail: 'Fail',
  map: 'Map',
  pass: 'Pass',
  succeed: 'Succeed',
  wait: 'Wait',
};

// keys are used elsewhere. Caution when changing.
const actionTypes = {
  builtInActionName: 'zis:common:action:(.*)',
  transformActionName: 'zis:common:transform:Jq',
  httpActionName: 'zis:(.*):action:(.*)',
};

const builtInActionNames = {
  loadConfig: 'LoadConfig',
  pathConfig: 'PatchConfig',
  loadLinks: 'LoadLinks',
  createLink: 'CreateLink',
  deleteLink: 'DeleteLink',
  patchLink: 'PatchLink',
};

const comparisonOperators = {
  stringEquals: 'StringEquals',
  stringLessThan: 'StringLessThan',
  stringGreaterThan: 'StringGreaterThan',
  stringLessThanEquals: 'StringLessThanEquals',
  stringGreaterThanEquals: 'StringGreaterThanEquals',
  numericEquals: 'NumericEquals',
  numericLessThan: 'NumericLessThan',
  numericGreaterThan: 'NumericGreaterThan',
  numericLessThanEquals: 'NumericLessThanEquals',
  numericGreaterThanEquals: 'NumericGreaterThanEquals',
  booleanEquals: 'BooleanEquals',
  timestampEquals: 'TimestampEquals',
  timestampLessThan: 'TimestampLessThan',
  timestampGreaterThan: 'TimestampGreaterThan',
  timestampLessThanEquals: 'TimestampLessThanEquals',
  timestampGreaterThanEquals: 'TimestampGreaterThanEquals',
  isPresent: 'IsPresent',
  isNull: 'IsNull',
};

const pathComparisonOperators = {
  StringEqualsPath: 'StringEqualsPath',
  NumericEqualsPath: 'NumericEqualsPath',
  NumericLessThanPath: 'NumericLessThanPath',
  NumericGreaterThanPath: 'NumericGreaterThanPath',
  NumericLessThanEqualsPath: 'NumericLessThanEqualsPath',
  NumericLessThanEqualsPath: 'NumericLessThanEqualsPath',
  BooleanEqualsPath: 'BooleanEqualsPath',
};

module.exports = {
  actionTypes,
  flowStateTypes,
  ruleOperators,
  dataOperators,
  choiceOperators,
  comparisonOperators,
  pathComparisonOperators,
  builtInActionNames,
};

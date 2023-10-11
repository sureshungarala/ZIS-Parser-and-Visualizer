// type for rule object, not to be directly used in code
const ruleType = {
  // value of rule operators constants
  execution: String,
  //
  options: Array,
  // for plain rules, rule operators & data Operators
  children: Array,
  // required for few validators
  value: String,
  validators: Array,
};

module.exports = { ruleType };

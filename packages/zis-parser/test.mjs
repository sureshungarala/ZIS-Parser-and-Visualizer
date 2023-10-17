import * as json from './bundle.json' assert { type: 'json' };

import ZisValidator from './zisValidator.js';

// console.log('json', json.default, typeof json.default, Object.keys(json.default));
const validator = new ZisValidator(json.default);
console.log(validator.validate());
// console.log(validator.constructStatesFlow());
const statesFlow = validator.constructStatesFlow();
console.log('statesFlow ', statesFlow);
function printStatesFlow(statesFlow) {
  console.group('------------statesFlow------------');
  statesFlow.forEach((state) => {
    if (Array.isArray(state)) {
      printStatesFlow(state);
    } else {
      console.log(state);
    }
  });
  console.log('----------------------------------');
  console.groupEnd();
}
// printStatesFlow(statesFlow);

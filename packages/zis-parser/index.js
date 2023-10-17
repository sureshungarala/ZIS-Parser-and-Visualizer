const zisValidator = require('./zisValidator.js');

const scaffoldValidator = require('./bundleScaffold/scaffoldValidator.js');
const jobSpecValidator = require('./bundleScaffold/jobSpecValidator.js');
const flowValidator = require('./bundleScaffold/flowValidator.js');

const actionStateValidator = require('./flowStates/actionStateValidator.js');
const choiceStateValidator = require('./flowStates/choiceStateValidator.js');
const mapStateValidator = require('./flowStates/mapStateValidator.js');
const succeedStateValidator = require('./flowStates/succeedStateValidator.js');
const failStateValidator = require('./flowStates/failStateValidator.js');
const waitStateValidator = require('./flowStates/waitStateValidator.js');
const passStateValidator = require('./flowStates/passStateValidator.js');

module.exports = {
  ZISValidator: zisValidator,
  validators: {
    scaffoldValidator,
    jobSpecValidator,
    flowValidator,
    actionStateValidator,
    choiceStateValidator,
    mapStateValidator,
    succeedStateValidator,
    failStateValidator,
    waitStateValidator,
    passStateValidator,
  },
};

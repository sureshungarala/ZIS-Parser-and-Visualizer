# Amazon State Language Parser for ZIS bundle

This package contains a parser for the Amazon State Language (ASL) that is used in the [ZIS](https://developer.zendesk.com/documentation/integration-services/) bundle.

## Usage

```js
// ES6
import ZISValidator from 'zis-parser';

// commonjs
const ZISValidator = require('zis-parser').default;

// bundle is a JSON object that contains the ZIS bundle
const validator = new ZISValidator(bundle);

// validates the bundle and returns the result and errors
const [result, ...errors] = validator.validate();

// constructs the states flow and returns the paths/relations between states
const statePaths = validator.constructStatesFlow();
```

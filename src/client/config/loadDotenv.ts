// workaround for dotenv not working well with ES6-style imports
// tslint:disable-next-line: no-var-requires
const dotenv = require('dotenv');
import path from 'path';

const _dotenvPath = path.join(__dirname, '..', '..', '..', '.env');

// workaround for dotenv not working well with ES6-style imports
// tslint:disable-next-line: no-unsafe-any
dotenv.config({
  path: _dotenvPath,
});

export default {};

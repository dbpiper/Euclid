import path from 'path';

const _dotenvPath = path.join(__dirname, '..', '.env');

require('dotenv').config({
  path: _dotenvPath,
});

export default {};

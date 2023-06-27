require('dotenv').config();

const PORT = process.env.PORT || 3003;

let MONGODB_URI;
switch (process.env.NODE_ENV) {
  case 'production':
    MONGODB_URI = process.env.MONGODB_URI;
    break;
  case 'development':
    MONGODB_URI = process.env.DEV_MONGODB_URI;
    break;
  case 'test':
    MONGODB_URI = process.env.TEST_MONGODB_URI;
    break;
  default:
    MONGODB_URI = process.env.TEST_MONGODB_URI;
}

module.exports = {
  PORT,
  MONGODB_URI,
};

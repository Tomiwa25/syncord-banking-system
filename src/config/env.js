require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  nibss: {
    baseUrl: process.env.NIBSS_BASE_URL,
    apikey: process.env.NIBSS_API_KEY,
    apisecret: process.env.NIBSS_API_SECRET,
  },
  NIBSS_API_BASE_URL: process.env.NIBSS_BASE_URL,
  NIBSS_API_KEY: process.env.NIBSS_API_KEY,
  NIBSS_API_SECRET: process.env.NIBSS_API_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
};

module.exports = env;


require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

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
};

module.exports = env;


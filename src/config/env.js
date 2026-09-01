require('dotenv').config();

const env = {
  port: process.env.PORT || 8000,
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  nibss: {
    baseUrl: process.env.BASE_URL,
    apikey: process.env.API_KEY,
    apisecret: process.env.API_SECRET
  }
}

module.exports = env;


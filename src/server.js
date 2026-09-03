const app = require('./app');
const env = require('./config/env');
const connectDatabase = require('./config/database');

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
    console.log(`Environment: ${env.NODE_ENV}`);
  } catch (error) {
    console.error('Failure starting the server:', error.message);

    process.exit(1);
  }
};

startServer();


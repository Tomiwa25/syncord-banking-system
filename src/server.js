const app = require('./app');
const config = require('./config');
const connectDb = require('./config/db');
const logger = require('./utils/logger');

async function start() {
  try {
    await connectDb();
    app.listen(config.port, () => {
      logger.info(`Server running on /api/v1`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

start();

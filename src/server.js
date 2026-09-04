const app = require('./app');
const env = require('./config/env');
const connectDatabase = require('./config/database');

const startServer = async () => {
  try {
    await connectDatabase();

    const preferredPort = Number(process.env.PORT) || env.port || 5000;
    const fallbackPort = 5001;

    const server = app.listen(preferredPort, () => {
      console.log(`Server is running on port ${preferredPort}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.warn(`Port ${preferredPort} is busy, retrying on ${fallbackPort}`);
        app.listen(fallbackPort, () => {
          console.log(`Server is running on port ${fallbackPort}`);
        });
        return;
      }

      console.error('Server startup error:', error.message);
      process.exit(1);
    });

    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('Failure starting the server:', error.message);
    process.exit(1);
  }
};

startServer();


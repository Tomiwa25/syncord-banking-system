require('express-async-errors'); // must be required before routes are defined

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const customersRoutes = require('./routes/customers.routes');
const accountsRoutes = require('./routes/accounts.routes');
const transactionsRoutes = require('./routes/transactions.routes');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/accounts', accountsRoutes);
app.use('/api/v1/transactions', transactionsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

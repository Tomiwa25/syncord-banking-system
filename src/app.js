const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const customersRoutes = require('./routes/customers.routes');
const accountsRoutes = require('./routes/accounts.routes');
const transactionsRoutes = require('./routes/transactions.routes');


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))


app.get('/health', (req, res) => res.json({ 
  success: true,
  message: "Bank API is running"
 }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/accounts', accountsRoutes);
app.use('/api/v1/transactions', transactionsRoutes);

app.use(errorMiddleware);

module.exports = app;

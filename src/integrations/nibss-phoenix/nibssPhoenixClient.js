const axios = require('axios');
const config = require('../../config');
const logger = require('../../utils/logger');
const ApiError = require('../../utils/ApiError');

/**
 * Thin, isolated client around the NibssByPhoenix API
 * (https://nibssbyphoenix.onrender.com/api/docs/#/).
 *
 * WHY THIS EXISTS AS ITS OWN MODULE:
 * Every other module (customers, accounts, transactions) talks to NIBSS
 * only through this client, never directly via axios. That means once you
 * paste in the real OpenAPI spec, this is the ONLY file that needs to
 * change — endpoint paths, header names, payload field names, and response
 * shapes. Nothing in the domain modules should need to change.
 *
 * TODO (once the real spec is available):
 *  - Confirm exact endpoint paths (best-guess ones are marked below).
 *  - Confirm auth mechanism: static API key header vs OAuth2
 *    client-credentials vs signed request. Currently assumes a bearer
 *    API key + client-id header.
 *  - Confirm exact request/response field names in every method below.
 *  - Confirm the real error response shape so error mapping is accurate.
 */

const http = axios.create({
  baseURL: config.nibssPhoenix.baseUrl,
  timeout: config.nibssPhoenix.timeoutMs,
  headers: {
    'Content-Type': 'application/json',
    // TODO: confirm real header names from the spec.
    Authorization: `Bearer ${config.nibssPhoenix.apiKey}`,
    'X-Client-Id': config.nibssPhoenix.clientId,
  },
});

async function request(method, path, data) {
  try {
    const response = await http.request({ method, url: path, data });
    return response.data;
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      logger.error(`NibssByPhoenix timeout: ${method.toUpperCase()} ${path}`);
      throw new ApiError(504, 'NibssByPhoenix API timed out');
    }

    const status = err.response?.status || 502;
    const upstreamMessage = err.response?.data?.message;

    logger.error(
      `NibssByPhoenix call failed: ${method.toUpperCase()} ${path} -> ${status} ${JSON.stringify(
        err.response?.data,
      )}`,
    );

    throw new ApiError(
      status >= 400 && status < 500 ? status : 502,
      upstreamMessage || 'NibssByPhoenix API request failed',
    );
  }
}

module.exports = {
  // --- KYC / onboarding ------------------------------------------------

  // TODO: confirm actual path, e.g. POST /kyc/bvn/validate
  validateBvn: (bvn) => request('post', '/kyc/bvn/validate', { bvn }),

  // TODO: confirm actual path, e.g. POST /accounts/create
  createCustomerAccount: (payload) =>
    request('post', '/accounts/create', payload),

  // --- Account operations ------------------------------------------------

  // TODO: confirm actual path, e.g. POST /transfers/name-enquiry
  nameEnquiry: (accountNumber, bankCode) =>
    request('post', '/transfers/name-enquiry', { accountNumber, bankCode }),

  // TODO: confirm actual path, e.g. GET /accounts/{accountNumber}/balance
  balanceEnquiry: (accountNumber) =>
    request('get', `/accounts/${accountNumber}/balance`),

  // TODO: confirm actual path, e.g. GET /banks
  getBankList: () => request('get', '/banks'),

  // --- Core banking / transfers -------------------------------------------

  // TODO: confirm actual path, e.g. POST /transfers
  fundTransfer: (payload) => request('post', '/transfers', payload),

  // TODO: confirm actual path, e.g. GET /transfers/{reference}/status
  transactionStatusQuery: (reference) =>
    request('get', `/transfers/${reference}/status`),
};

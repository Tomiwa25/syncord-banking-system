const generateReference = (
  prefix = "TXN"
) => {
  const timestamp = Date.now();

  const random = Math.floor(Math.random() * 1000000);

  return `${prefix}-${timestamp}-${random}`;
};

module.exports = generateReference;

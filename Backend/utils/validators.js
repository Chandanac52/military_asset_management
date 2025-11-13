const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validateAssetQuantity = (quantity) => {
  return quantity > 0 && Number.isInteger(quantity);
};

const validateCost = (cost) => {
  return cost >= 0;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateAssetQuantity,
  validateCost
};
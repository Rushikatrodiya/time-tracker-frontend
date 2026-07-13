export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

export const formatCurrency = (amount, currencyCode) => {
  if (amount == null) return "Not Set";
  if (!currencyCode) return amount.toString();
  
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  return `${symbol}${amount}`;
};

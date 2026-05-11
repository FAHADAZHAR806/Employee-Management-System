export const calculateNetPay = (
  base: number,
  bonus: number,
  deductions: number,
) => {
  return base + bonus - deductions;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

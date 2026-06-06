export function formatCurrency(amount: number) {
  if (amount >= 10000000) return `Rs ${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(1)} L`;
  return `Rs ${amount.toLocaleString("en-IN")}`;
}

export function formatFees(min: number, max: number) {
  if (min === max) return formatCurrency(min);
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

export function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

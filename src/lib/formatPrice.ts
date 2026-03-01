/**
 * Format a price in Thai Baht (THB).
 * Outputs a clear, unambiguous format: "฿1,234 THB"
 *
 * @param amount - The numeric amount to format
 * @param showDecimals - Whether to show 2 decimal places (default: true)
 * @returns Formatted string like "฿1,234.00 THB" or "฿1,234 THB"
 */
export function formatTHB(amount: number, showDecimals = true): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return `฿${formatted} THB`;
}

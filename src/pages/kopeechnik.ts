export function formatCurrency(value: number | string) {
  value = Number(value)

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)
}

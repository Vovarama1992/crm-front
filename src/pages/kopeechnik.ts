export function formatCurrency(value: number | string) {
  value = Number(value)
  const rubles = Math.floor(value) // Целая часть (рубли)
  const kopecks = Math.round((value - rubles) * 100) // Дробная часть (копейки)

  return `${rubles} рублей ${kopecks === 0 ? 0 : kopecks} копеек`
}

export function formatCurrency(value: number) {
  // Приводим значение к двум знакам после запятой
  const rubles = Math.floor(value) // Целая часть (рубли)
  const kopecks = Math.round((value - rubles) * 100) // Дробная часть (копейки)

  return `${rubles} рублей ${kopecks === 0 ? 0 : kopecks} копеек`
}

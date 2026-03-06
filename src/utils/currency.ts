const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

export function formatCurrency(value: number) {
  return moneyFormatter.format(value || 0)
}

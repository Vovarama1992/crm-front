export type DepartureDto = {
  arrival_date: string
  comment: string
  counterparty_name: string
  departure_date: string
  destination: '' | 'Возврат от клиента' | 'Возврат поставщику' | 'До клиента' | 'До нас'
  final_amount: null | number
  manager: string
  number: number
  specific_destination: 'до двери' | 'до терминала'
  tracking_number: null | number
  transport_company: string
}

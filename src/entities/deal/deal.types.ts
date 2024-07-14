export type DealDto = {
  closingDate: string
  comment: string
  counterparty: string
  dealVolume: number
  inn: number
  lossReason: 'дорого' | 'другое' | 'недоработал' | 'нет раппорта' | 'пустомеля' | null
  marginInRubles: number
  requestNumber: number
  stage:
    | 'выставлен счет'
    | 'отправлено КП'
    | 'проигран'
    | 'работа с возражениями(бюрократия)'
    | 'сделка закрыта'
    | 'счет оплачен'
  turnoverInRubles: number
}

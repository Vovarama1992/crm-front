export type ConnectionDto = {
  id: number
  name_connection: string
}

type AccessDto = {
  connection: number
  shop: number
}
export type AfterAccessDto = {
  api_key: string
  client_id: string
  connection: number
  id: number
  shop: number
}
export type AccessOzonDto = {
  api_key: string
  client_id: string
} & AccessDto

export type AccessWildberriesDto = {
  token: string
  token_name: string
} & AccessDto

export type AccessAvitoDto = {
  client_id: string
  client_secret: string
} & AccessDto

export type ShopConnectionListDto = {
  access_to: number[]
  exp: string
  id: number
  token_name: string
} & AccessDto

export type CommonAccessDto = (AccessAvitoDto | AccessOzonDto | AccessWildberriesDto) & AccessDto

type Range = {
  date_from: number
  date_to: number
}
type From = {
  date_from: number
}
export type AccessToReport = From | Range

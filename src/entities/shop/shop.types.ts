export type CreateShopDto = {
  name: string
  owner: number
}

type AccessToConnectionsCategories = {
  id_category: number
  name_category: string
}

type AccessToConnectionsTypesData = {
  category: AccessToConnectionsCategories
  id_type_data: number
  name_type_data: string
  subcategory: AccessToConnectionsSubcategories | null
}

type AccessToConnectionsSubcategories = {
  category: {
    id_category: number
    name_category: string
  }[]
  id_subcategory: number
  name_subcategory: string
}

type AccessToConnections = {
  categories: AccessToConnectionsCategories[]
  exp: string
  id_access_to_connections: number
  id_connection: number
  id_shop: number
  name_connection: string
  name_shop: string
  subcategories: AccessToConnectionsSubcategories[]
  types_data: AccessToConnectionsTypesData[]
}

export type ShopDto = {
  access_to_connections: AccessToConnections[]
  id_personal_office: number
  id_shop: number
  in_archived: boolean
  name_shop: string
  owner: number
  time_create: string
  time_update: string
}

export type UpdateShopDto = {
  id: number
  name: string
}

export type InitialShopState = {
  currentOffice: string
}

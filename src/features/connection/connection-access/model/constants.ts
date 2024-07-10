export const CONNECTIONS = {
  AVITO: '4',
  OZON: '5',
  WILDBERRIES: '6',
} as const

export const CONNECTION_FIELDS = {
  [CONNECTIONS.AVITO]: {
    id: 'Client ID',
    token: 'Client secret',
  },
  [CONNECTIONS.OZON]: {
    id: 'Client ID',
    token: 'API key',
  },
  [CONNECTIONS.WILDBERRIES]: {
    id: 'Token name',
    token: 'Token',
  },
} as const

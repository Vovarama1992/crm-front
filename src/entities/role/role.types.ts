export type PermissionDto = {
  change: boolean
  'create/add': boolean
  delete: boolean
  read: boolean
}

export type CreateRoleParams = {
  data: {
    Basic: {
      connection: PermissionDto
      invite: boolean
      role: PermissionDto
      shop: PermissionDto
    }
    Name: string
    shop: Record<string, PermissionDto>
    template: Record<string, PermissionDto>
  }
  personal_office_id: string
}

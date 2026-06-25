export type Resource = 'projects' | 'tasks' | 'members' | 'billing' | 'settings'

export type Action =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'archive'
  | 'assign'
  | 'invite'
  | 'remove'
  | 'update_role'
  | 'update'
  | 'download_invoices'

export interface Permission {
  resource: Resource
  action: Action
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isDefault: boolean
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatarInitials: string
  avatarColor: string
  roleIds: string[]
}

export interface PermissionGroup {
  resource: Resource
  actions: Action[]
}

export interface EffectivePermission extends Permission {
  grantedBy: string[]
}

export interface UserDetail extends User {
  roles: Role[]
  effectivePermissions: EffectivePermission[]
}

export type ActivityType =
  | 'role_created'
  | 'role_updated'
  | 'role_deleted'
  | 'role_assigned'
  | 'role_removed'

export interface Activity {
  id: string
  type: ActivityType
  targetName: string
  userName?: string
  timestamp: string
}

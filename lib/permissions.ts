import { PermissionGroup, Permission, Role, EffectivePermission } from './types'

export const PERMISSION_MATRIX: PermissionGroup[] = [
  { resource: 'projects', actions: ['view', 'create', 'edit', 'delete', 'archive'] },
  { resource: 'tasks', actions: ['view', 'create', 'edit', 'delete', 'assign'] },
  { resource: 'members', actions: ['view', 'invite', 'remove', 'update_role'] },
  { resource: 'billing', actions: ['view', 'update', 'download_invoices'] },
  { resource: 'settings', actions: ['view', 'update'] },
]

export const ALL_ACTIONS = Array.from(
  new Set(PERMISSION_MATRIX.flatMap((group) => group.actions))
)

export function resolveEffectivePermissions(
  roles: Role[]
): EffectivePermission[] {
  const map = new Map<string, EffectivePermission>()
  for (const role of roles) {
    for (const perm of role.permissions) {
      const key = `${perm.resource}:${perm.action}`
      const existing = map.get(key)
      if (existing) {
        existing.grantedBy.push(role.name)
      } else {
        map.set(key, { ...perm, grantedBy: [role.name] })
      }
    }
  }
  return Array.from(map.values())
}

export function isActionAvailableForResource(
  resource: Permission['resource'],
  action: Permission['action']
): boolean {
  const group = PERMISSION_MATRIX.find((g) => g.resource === resource)
  return group ? group.actions.includes(action) : false
}

import { Role, User, Activity } from './types'

interface Store {
  roles: Role[]
  users: User[]
  activities: Activity[]
}

function createStore(): Store {
  const roles: Role[] = [
    {
      id: 'role-admin',
      name: 'Admin',
      description: 'Full access to all resources and actions',
      isDefault: true,
      createdAt: '2024-01-15T09:00:00Z',
      permissions: [
        { resource: 'projects', action: 'view' },
        { resource: 'projects', action: 'create' },
        { resource: 'projects', action: 'edit' },
        { resource: 'projects', action: 'delete' },
        { resource: 'projects', action: 'archive' },
        { resource: 'tasks', action: 'view' },
        { resource: 'tasks', action: 'create' },
        { resource: 'tasks', action: 'edit' },
        { resource: 'tasks', action: 'delete' },
        { resource: 'tasks', action: 'assign' },
        { resource: 'members', action: 'view' },
        { resource: 'members', action: 'invite' },
        { resource: 'members', action: 'remove' },
        { resource: 'members', action: 'update_role' },
        { resource: 'billing', action: 'view' },
        { resource: 'billing', action: 'update' },
        { resource: 'billing', action: 'download_invoices' },
        { resource: 'settings', action: 'view' },
        { resource: 'settings', action: 'update' },
      ],
    },
    {
      id: 'role-member',
      name: 'Member',
      description: 'Can manage projects and tasks, view members',
      isDefault: true,
      createdAt: '2024-01-15T09:00:00Z',
      permissions: [
        { resource: 'projects', action: 'view' },
        { resource: 'projects', action: 'create' },
        { resource: 'projects', action: 'edit' },
        { resource: 'tasks', action: 'view' },
        { resource: 'tasks', action: 'create' },
        { resource: 'tasks', action: 'edit' },
        { resource: 'tasks', action: 'assign' },
        { resource: 'members', action: 'view' },
      ],
    },
    {
      id: 'role-viewer',
      name: 'Viewer',
      description: 'Read-only access to projects, tasks, and members',
      isDefault: true,
      createdAt: '2024-01-15T09:00:00Z',
      permissions: [
        { resource: 'projects', action: 'view' },
        { resource: 'tasks', action: 'view' },
        { resource: 'members', action: 'view' },
      ],
    },
    {
      id: 'role-contractor',
      name: 'Contractor',
      description: 'Can view and edit projects, manage assigned tasks',
      isDefault: false,
      createdAt: '2024-02-01T10:30:00Z',
      permissions: [
        { resource: 'projects', action: 'view' },
        { resource: 'projects', action: 'edit' },
        { resource: 'tasks', action: 'view' },
        { resource: 'tasks', action: 'edit' },
        { resource: 'tasks', action: 'assign' },
      ],
    },
  ]

  const users: User[] = [
    {
      id: 'user-priya',
      name: 'Priya Sharma',
      email: 'priya@workbench.io',
      avatarInitials: 'PS',
      avatarColor: 'bg-violet-500',
      roleIds: ['role-admin'],
    },
    {
      id: 'user-marcus',
      name: 'Marcus Webb',
      email: 'marcus@workbench.io',
      avatarInitials: 'MW',
      avatarColor: 'bg-blue-500',
      roleIds: ['role-member', 'role-contractor'],
    },
    {
      id: 'user-zoe',
      name: 'Zoe Nakamura',
      email: 'zoe@workbench.io',
      avatarInitials: 'ZN',
      avatarColor: 'bg-emerald-500',
      roleIds: ['role-viewer'],
    },
    {
      id: 'user-daniel',
      name: 'Daniel Osei',
      email: 'daniel@workbench.io',
      avatarInitials: 'DO',
      avatarColor: 'bg-amber-500',
      roleIds: ['role-member'],
    },
  ]

  const activities: Activity[] = []

  return { roles, users, activities }
}

const store = createStore()

export function getRoles(): Role[] {
  return store.roles
}

export function getRoleById(id: string): Role | undefined {
  return store.roles.find((r) => r.id === id)
}

export function createRole(role: Omit<Role, 'id' | 'createdAt' | 'isDefault'>): Role {
  const newRole: Role = {
    ...role,
    id: `role-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    isDefault: false,
    createdAt: new Date().toISOString(),
  }
  store.roles.push(newRole)
  return newRole
}

export function updateRole(
  id: string,
  updates: Partial<Pick<Role, 'name' | 'description' | 'permissions'>>
): Role | undefined {
  const role = store.roles.find((r) => r.id === id)
  if (!role) return undefined
  if (updates.name !== undefined) role.name = updates.name
  if (updates.description !== undefined) role.description = updates.description
  if (updates.permissions !== undefined) role.permissions = updates.permissions
  return role
}

export function deleteRole(id: string): { success: boolean; error?: string } {
  const role = store.roles.find((r) => r.id === id)
  if (!role) return { success: false, error: 'Role not found' }
  if (role.isDefault) return { success: false, error: 'Default roles cannot be deleted' }

  for (const user of store.users) {
    user.roleIds = user.roleIds.filter((rid) => rid !== id)
  }

  store.roles = store.roles.filter((r) => r.id !== id)
  return { success: true }
}

export function isRoleNameTaken(name: string, excludeId?: string): boolean {
  return store.roles.some(
    (r) => r.name.toLowerCase() === name.toLowerCase() && r.id !== excludeId
  )
}

export function getUsers(): User[] {
  return store.users
}

export function getUserById(id: string): User | undefined {
  return store.users.find((u) => u.id === id)
}

export function assignRoleToUser(
  userId: string,
  roleId: string
): { success: boolean; error?: string } {
  const user = store.users.find((u) => u.id === userId)
  if (!user) return { success: false, error: 'User not found' }

  const role = store.roles.find((r) => r.id === roleId)
  if (!role) return { success: false, error: 'Role not found' }

  if (user.roleIds.includes(roleId)) {
    return { success: false, error: 'Role already assigned' }
  }

  user.roleIds.push(roleId)
  return { success: true }
}

export function unassignRoleFromUser(
  userId: string,
  roleId: string
): { success: boolean; error?: string } {
  const user = store.users.find((u) => u.id === userId)
  if (!user) return { success: false, error: 'User not found' }

  if (!user.roleIds.includes(roleId)) {
    return { success: false, error: 'Role not assigned to user' }
  }

  user.roleIds = user.roleIds.filter((rid) => rid !== roleId)
  return { success: true }
}

export function getActivities(): Activity[] {
  return [...store.activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export function logActivity(activity: Omit<Activity, 'id' | 'timestamp'>) {
  store.activities.push({
    ...activity,
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  })
}

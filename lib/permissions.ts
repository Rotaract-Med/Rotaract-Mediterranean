export type UserRole = "admin" | "journalist" | "media_team" | "member"

export const permissions = {
  articles: {
    view: ["admin", "journalist", "member", "media_team"],
    create: ["admin", "journalist"],
    edit: ["admin", "journalist"],
    delete: ["admin", "journalist"],
  },
  team: {
    view: ["admin"],
    create: ["admin"],
    edit: ["admin"],
    delete: ["admin"],
  },
  media: {
    view: ["admin", "media_team", "journalist"],
    create: ["admin", "media_team"],
    edit: ["admin", "media_team"],
    delete: ["admin", "media_team"],
  },
  hero_slides: {
    view: ["admin", "media_team"],
    create: ["admin", "media_team"],
    edit: ["admin", "media_team"],
    delete: ["admin", "media_team"],
  },
  awards: {
    view: ["admin", "media_team"],
    create: ["admin", "media_team"],
    edit: ["admin", "media_team"],
    delete: ["admin", "media_team"],
  },
  users: {
    view: ["admin"],
    create: ["admin"],
    edit: ["admin"],
    delete: ["admin"],
  },
}

export function hasPermission(userRole: UserRole, resource: keyof typeof permissions, action: string): boolean {
  const resourcePermissions = permissions[resource]
  if (!resourcePermissions) return false

  const allowedRoles = resourcePermissions[action as keyof typeof resourcePermissions]
  return allowedRoles ? allowedRoles.includes(userRole) : false
}

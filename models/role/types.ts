import { ROLE_STATUS, USER_ROLES } from "./Role"

export type RoleStatus = typeof ROLE_STATUS[keyof typeof ROLE_STATUS]
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

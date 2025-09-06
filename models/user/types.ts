import { USER_ROLES } from "../role/Role";

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

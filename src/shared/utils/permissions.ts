import type { AdminPermission } from '@/api/types'

/** True when the admin holds every permission in `required` (spec 3.3 — server re-checks regardless). */
export function hasPermission(
  granted: AdminPermission[],
  required: AdminPermission | AdminPermission[],
): boolean {
  const requiredList = Array.isArray(required) ? required : [required]
  return requiredList.every((permission) => granted.includes(permission))
}

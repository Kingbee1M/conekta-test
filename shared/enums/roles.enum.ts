export enum RoleEnum {
  CUSTOMER = 'customer',
  LISTER = 'lister',
  ARTISAN = 'artisan',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface RoleBadgeConfig {
  label: string;
  styles: string;
}

export const ROLE_BADGE_MAP: Record<RoleEnum, RoleBadgeConfig> = {
  [RoleEnum.CUSTOMER]: {
    label: 'Customer',
    styles: 'bg-gray-50 text-gray-700 border-gray-200',
  },
  [RoleEnum.LISTER]: {
    label: 'Lister',
    styles: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  [RoleEnum.ARTISAN]: {
    label: 'Artisan',
    styles: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  [RoleEnum.ADMIN]: {
    label: 'Admin',
    styles: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [RoleEnum.SUPER_ADMIN]: {
    label: 'Super Admin',
    styles: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};


export function getRoleBadgeConfig(role?: string | RoleEnum): RoleBadgeConfig {
  if (!role) {
    return { label: 'Staff', styles: 'bg-gray-50 text-gray-600 border-gray-200' };
  }

  const normalized = String(role).toLowerCase() as RoleEnum;

  if (normalized in ROLE_BADGE_MAP) {
    return ROLE_BADGE_MAP[normalized];
  }

  return {
    label: String(role).replace(/_/g, ' '),
    styles: 'bg-gray-50 text-gray-600 border-gray-200',
  };
}
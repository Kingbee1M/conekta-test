export enum ListingStatusEnum {
  DRAFT = 'draft',
  DEACTIVATED = 'deactivated',
  ACTIVE = 'active',
  OCCUPIED = 'occupied',
  SOLD = 'sold',
}

export const ListingStatusLabels: Record<ListingStatusEnum, string> = {
  [ListingStatusEnum.DRAFT]: 'Draft',
  [ListingStatusEnum.DEACTIVATED]: 'Deactivated',
  [ListingStatusEnum.ACTIVE]: 'Active',
  [ListingStatusEnum.OCCUPIED]: 'Occupied',
  [ListingStatusEnum.SOLD]: 'Sold',
};
export enum PropertyFilter {
  ALL = 'all',
  AVAILABLE = 'available',
  SOLD = 'sold',
  DEACTIVATED = 'deactivated',
  RENTED = 'rented'
}

export interface filterTypes {
  filter: PropertyFilter;
}
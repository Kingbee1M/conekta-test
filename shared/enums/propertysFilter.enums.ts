export enum PropertyCategoryFilter {
  ALL = 'ALL',
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  SHORT_LET = 'SHORT_LET',
  LAND = 'LAND',
}

export interface filterTypes {
  filter: PropertyCategoryFilter;
}
export enum DocumentTypeEnum {
  NATIONAL_ID = 'national_id',
  INTERNATIONAL_PASSPORT = 'international_passport',
  DRIVERS_LICENSE = 'drivers_license',
  VOTERS_CARD = 'voters_card',
  RESIDENCE_PERMIT = 'residence_permit',
  CAC_CERTIFICATE = 'cac_certificate',
  TAX_CLEARANCE = 'tax_clearance',
  MEMORANDUM_ARTICLES = 'memorandum_articles',
  UTILITY_BILL = 'utility_bill',
  BUSINESS_LICENSE = 'business_license',
  OTHER = 'other',
}

export const DocumentTypeLabels: Record<DocumentTypeEnum, string> = {
  [DocumentTypeEnum.NATIONAL_ID]: 'National ID',
  [DocumentTypeEnum.INTERNATIONAL_PASSPORT]: 'International Passport',
  [DocumentTypeEnum.DRIVERS_LICENSE]: "Driver's License",
  [DocumentTypeEnum.VOTERS_CARD]: "Voter's Card",
  [DocumentTypeEnum.RESIDENCE_PERMIT]: 'Residence Permit',
  [DocumentTypeEnum.CAC_CERTIFICATE]: 'CAC Certificate',
  [DocumentTypeEnum.TAX_CLEARANCE]: 'Tax Clearance Certificate',
  [DocumentTypeEnum.MEMORANDUM_ARTICLES]: 'Memorandum & Articles of Association',
  [DocumentTypeEnum.UTILITY_BILL]: 'Utility Bill',
  [DocumentTypeEnum.BUSINESS_LICENSE]: 'Business License / Permit',
  [DocumentTypeEnum.OTHER]: 'Other',
};
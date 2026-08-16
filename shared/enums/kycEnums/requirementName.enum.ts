export enum RequirementNameEnum {
  IDENTITY = 'identity',
  PROOF_OF_ADDRESS = 'proof_of_address',
  CAC_CERTIFICATE = 'cac_certificate',
  TAX_CLEARANCE = 'tax_clearance',
  MEMORANDUM_ARTICLES = 'memorandum_articles',
}

export const RequirementNameLabels: Record<RequirementNameEnum, string> = {
  [RequirementNameEnum.IDENTITY]: 'Identity',
  [RequirementNameEnum.PROOF_OF_ADDRESS]: 'Proof of Address',
  [RequirementNameEnum.CAC_CERTIFICATE]: 'CAC Certificate',
  [RequirementNameEnum.TAX_CLEARANCE]: 'Tax Clearance Certificate',
  [RequirementNameEnum.MEMORANDUM_ARTICLES]: 'Memorandum & Articles of Association',
};
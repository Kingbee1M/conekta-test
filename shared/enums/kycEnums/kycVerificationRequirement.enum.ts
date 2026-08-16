export enum KYCVerificationRequirementCategoryEnum {
  PERSONAL_INFORMATION = 'personal_information',
  IDENTITY_VERIFICATION = 'identity_verification',
  BUSINESS_VERIFICATION = 'business_verification',
}

export const KYCVerificationRequirementCategoryLabels: Record<KYCVerificationRequirementCategoryEnum, string> = {
  [KYCVerificationRequirementCategoryEnum.PERSONAL_INFORMATION]: 'Personal Information',
  [KYCVerificationRequirementCategoryEnum.IDENTITY_VERIFICATION]: 'Identity Verification',
  [KYCVerificationRequirementCategoryEnum.BUSINESS_VERIFICATION]: 'Business Verification',
};
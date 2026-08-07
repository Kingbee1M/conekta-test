export enum VerificationStatusEnum {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export const VerificationStatusLabels: Record<VerificationStatusEnum, string> = {
  [VerificationStatusEnum.PENDING]: 'Pending',
  [VerificationStatusEnum.IN_REVIEW]: 'In Review',
  [VerificationStatusEnum.VERIFIED]: 'Verified',
  [VerificationStatusEnum.REJECTED]: 'Rejected',
};
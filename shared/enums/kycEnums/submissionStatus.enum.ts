export enum SubmissionStatusEnum {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  CHANGES_REQUESTED = 'changes_requested',
}

// Display labels mapping for UI rendering
export const SubmissionStatusLabels: Record<SubmissionStatusEnum, string> = {
  [SubmissionStatusEnum.NOT_STARTED]: 'Not Started',
  [SubmissionStatusEnum.IN_PROGRESS]: 'In Progress',
  [SubmissionStatusEnum.PENDING_REVIEW]: 'Pending Review',
  [SubmissionStatusEnum.APPROVED]: 'Approved',
  [SubmissionStatusEnum.CHANGES_REQUESTED]: 'Changes Requested',
};
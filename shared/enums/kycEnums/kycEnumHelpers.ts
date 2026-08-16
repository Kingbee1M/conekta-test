import { DocumentTypeEnum, DocumentTypeLabels } from './documentType.enum';
import { DocumentSideEnum, DocumentSideLabels } from './documentSide.enum';
import { RequirementNameEnum, RequirementNameLabels } from './requirementName.enum';
import { SubmissionStatusEnum, SubmissionStatusLabels } from './submissionStatus.enum';
import { KYCVerificationRequirementCategoryEnum, KYCVerificationRequirementCategoryLabels } from './kycVerificationRequirement.enum';

/**
 * Get all document type options with user-friendly labels
 * Returns an array of label strings (not enum values)
 */
export const getDocumentTypeOptions = (): string[] => {
  return Object.values(DocumentTypeEnum).map(
    (value) => DocumentTypeLabels[value]
  );
};

/**
 * Get all document side options with user-friendly labels
 */
export const getDocumentSideOptions = (): string[] => {
  return Object.values(DocumentSideEnum).map(
    (value) => DocumentSideLabels[value]
  );
};

/**
 * Get all requirement name options with user-friendly labels
 */
export const getRequirementNameOptions = (): string[] => {
  return Object.values(RequirementNameEnum).map(
    (value) => RequirementNameLabels[value]
  );
};

/**
 * Get all submission status options with user-friendly labels
 */
export const getSubmissionStatusOptions = (): string[] => {
  return Object.values(SubmissionStatusEnum).map(
    (value) => SubmissionStatusLabels[value]
  );
};

/**
 * Get all KYC category options with user-friendly labels
 */
export const getKycCategoryOptions = (): string[] => {
  return Object.values(KYCVerificationRequirementCategoryEnum).map(
    (value) => KYCVerificationRequirementCategoryLabels[value]
  );
};

/**
 * Convert a display label back to its enum value
 * Returns null if label not found
 */
export const documentTypeFromLabel = (label: string): DocumentTypeEnum | null => {
  const entry = Object.entries(DocumentTypeLabels).find(([_, v]) => v === label);
  return entry ? (entry[0] as DocumentTypeEnum) : null;
};

export const documentSideFromLabel = (label: string): DocumentSideEnum | null => {
  const entry = Object.entries(DocumentSideLabels).find(([_, v]) => v === label);
  return entry ? (entry[0] as DocumentSideEnum) : null;
};

export const requirementNameFromLabel = (label: string): RequirementNameEnum | null => {
  const entry = Object.entries(RequirementNameLabels).find(([_, v]) => v === label);
  return entry ? (entry[0] as RequirementNameEnum) : null;
};

export const submissionStatusFromLabel = (label: string): SubmissionStatusEnum | null => {
  const entry = Object.entries(SubmissionStatusLabels).find(([_, v]) => v === label);
  return entry ? (entry[0] as SubmissionStatusEnum) : null;
};

export const kycCategoryFromLabel = (label: string): KYCVerificationRequirementCategoryEnum | null => {
  const entry = Object.entries(KYCVerificationRequirementCategoryLabels).find(([_, v]) => v === label);
  return entry ? (entry[0] as KYCVerificationRequirementCategoryEnum) : null;
};

/**
 * Get the display label for any enum value
 */
export const getEnumLabel = (
  value: DocumentTypeEnum | DocumentSideEnum | RequirementNameEnum | SubmissionStatusEnum | KYCVerificationRequirementCategoryEnum,
  type: 'documentType' | 'documentSide' | 'requirementName' | 'submissionStatus' | 'kycCategory'
): string => {
  switch (type) {
    case 'documentType':
      return DocumentTypeLabels[value as DocumentTypeEnum] || value;
    case 'documentSide':
      return DocumentSideLabels[value as DocumentSideEnum] || value;
    case 'requirementName':
      return RequirementNameLabels[value as RequirementNameEnum] || value;
    case 'submissionStatus':
      return SubmissionStatusLabels[value as SubmissionStatusEnum] || value;
    case 'kycCategory':
      return KYCVerificationRequirementCategoryLabels[value as KYCVerificationRequirementCategoryEnum] || value;
    default:
      return value;
  }
};

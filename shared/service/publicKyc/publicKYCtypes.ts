import { DocumentSideEnum } from "../../enums/kycEnums/documentSide.enum";
import { DocumentTypeEnum } from "../../enums/kycEnums/documentType.enum";
import { KYCVerificationRequirementCategoryEnum } from "../../enums/kycEnums/kycVerificationRequirement.enum";
import { RequirementNameEnum } from "../../enums/kycEnums/requirementName.enum";
import { SubmissionStatusEnum } from "../../enums/kycEnums/submissionStatus.enum";


export interface KycDocument {
  document_uuid?: string;
  document_type: DocumentTypeEnum;
  document_side: DocumentSideEnum;
  media_uuid: string;
}

export interface KycRequirement {
  requirement_uuid: string;
  category: KYCVerificationRequirementCategoryEnum;
  name: RequirementNameEnum;
  description: string;
  order: number;
  enabled: boolean;
}

export interface KycRequirementSubmission {
  submission_uuid: string;
  status: SubmissionStatusEnum;
  documents: KycDocument[];
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  review_notes: string | null;
}

export interface KycRequirementItem {
  requirement: KycRequirement;
  submission: KycRequirementSubmission | null;
}

export interface KycProfileReview {
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export interface KycProfileData {
  kyc_profile_uuid: string;
  status: SubmissionStatusEnum;
  role: string;
  submitted_at: string | null;
  review: KycProfileReview | null;
  requirements: KycRequirementItem[];
}

export interface SubmitKycDocumentsRequest {
  requirement_name: RequirementNameEnum;
  documents: KycDocument[];
}

export interface SubmitKycDocumentsResponse {
  requirement_uuid: string;
  requirement_name: RequirementNameEnum;
  submission: KycRequirementSubmission;
}
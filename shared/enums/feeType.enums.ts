export enum FeeTypeEnum {
  SERVICE_CHARGE = "service_charge",
  AGENCY_FEE = "agency_fee",
  LEGAL_FEE = "legal_fee",
  CAUTION_DEPOSIT = "caution_deposit",
  SURVEY_FEE = "survey_fee",
}

export const FEE_TYPE_OPTIONS = [
  { value: FeeTypeEnum.SERVICE_CHARGE, label: "Service Charge" },
  { value: FeeTypeEnum.AGENCY_FEE, label: "Agency Fee" },
  { value: FeeTypeEnum.LEGAL_FEE, label: "Legal Fee" },
  { value: FeeTypeEnum.CAUTION_DEPOSIT, label: "Caution Deposit" },
  { value: FeeTypeEnum.SURVEY_FEE, label: "Survey Fee" },
];
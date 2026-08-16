export enum DocumentSideEnum {
  FRONT = 'front',
  BACK = 'back',
  OTHER = 'other',
}

export const DocumentSideLabels: Record<DocumentSideEnum, string> = {
  [DocumentSideEnum.FRONT]: 'Front',
  [DocumentSideEnum.BACK]: 'Back',
  [DocumentSideEnum.OTHER]: 'Other',
};
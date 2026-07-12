export enum PaymentFrequencyEnum {
  ONE_OFF = 'one_off',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export const paymentFrequencyOptions = [
  { label: 'One-Off', value: PaymentFrequencyEnum.ONE_OFF },
  { label: 'Monthly', value: PaymentFrequencyEnum.MONTHLY },
  { label: 'Quarterly', value: PaymentFrequencyEnum.QUARTERLY },
  { label: 'Yearly', value: PaymentFrequencyEnum.YEARLY },
];
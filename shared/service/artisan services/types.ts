export enum ArtisanServiceEnum {
  PLUMBER = 'plumber',
  PAINTER = 'painter',
  CARPENTER = 'carpenter',
  ELECTRICIAN = 'electrician'
}

export interface Artisan {
  id: string;
  name: string;
  service: ArtisanServiceEnum;
  rating: number;
  reviewCount: number;
  location: string;
  jobsCompleted: number;
  skills: string[];
  hourlyRate: number;
  isVerified: boolean;
}
export type ProfileTab = 'dashboard' | 'transactions' | 'liked' | 'comments' | 'support' | 'Become a Lister';

export interface TenantProfileData {
  name: string;
  email: string;
  avatarInitials: string;
  isVerified: boolean;
}

export interface HomeOverviewData {
  title: string;
  address: string;
  status: 'Active' | 'Pending' | 'Expired';
  rentPaidMonths: number;
  totalRentMonths: number;
  nextPaymentDue: string;
  rentAmountNumeric: number;
}

export interface TransactionItem {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'rental' | 'property' | 'artisan';
}

export interface LikedListing {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  likedAt: string;
}

export interface ListingComment {
  id: string;
  listingTitle: string;
  comment: string;
  date: string;
  status: 'Published' | 'Awaiting reply';
}
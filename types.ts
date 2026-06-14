import { StaticImageData } from 'next/image';

export interface signupTypes {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    role: string;
}

export type loginTypes = {
    email: string;
    password: string;
}

export type errorType = {
    error: string;
    success: boolean; // Changed to boolean to match your logic
}

export type usertype = {
    landlord_id: string
    name: string;
    email: string;
    avatar?: string;
    address: string;
    phone: string;
    role: string;  
 }

 export type productType = {
    house_id: string;
    name: string;
    location: string;
    price: number;
    description: string;
    image: string;
    landlord_id: string;
 }

export type userInfoType = {
    user: usertype
    product: productType[]
}

export interface FlatUserData {
  uuid?: string;
  email?: string;
  roles?: string[];
  active_role?: string;
  profile?: {
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
}


export type SortOption = 'Newest' | 'Price: Low to High' | 'Price: High to Low' | 'Most Popular';

export interface PropertyData {
  id: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  rating: number; // e.g., 7
  price: number;   // e.g., 150000
  imageUrl: StaticImageData;
  created_at: string; // Optional: ISO date string for sorting by newest
}
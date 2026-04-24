export type signupTypes = {
    name: string;
    email: string;
    password: string;
    phone: string,
    role: string
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

// types.ts
// export type SignupResult = 
//   | { success: true; data: any } 
//   | { success: false; error: string };

// export type userData = {

//   uuid: string,
//   email: string,
//   profile: Profile
//   roles: string [customer, lister]
// }

// export type Profile = {
//     first_name: string,
//     last_name: string,
//     phone_number: string
// }

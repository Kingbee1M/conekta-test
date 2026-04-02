export type signupTypes = {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export type loginTypes = {
    email: string;
    password: string;
}

export type errorType = {
    error: string,
    success: string
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
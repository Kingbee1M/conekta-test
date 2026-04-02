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
import { setUserInfo } from '@/shared/store/authSlice';
import { handleSecureAuth } from '@/shared/cookie.action';
import { AppDispatch } from '@/shared/store/store';
import { signupTypes } from '@/types';
import { loginTypes } from '@/types';
import { errorType } from '@/types';

export const loginUser = (credentials: loginTypes) => async (dispatch: AppDispatch) => {
  try {
     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    console.log(data)

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || 'Login failed. Please check your credentials.' 
      };
    }

    await handleSecureAuth({ 
      accessToken: data.data.tokens.access.token
    });

    dispatch(setUserInfo({
      email: data.email,
      name: data.name,
      id: '',
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
      avatar: '',
      role: '',
      store: null
    }));

    return { success: true };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error };
  }
};

export const signupUser = (frontendData: signupTypes) => async () => {
  try {
    const [first_name, ...lastNames] = frontendData.name.trim().split(/\s+/);
    const last_name = lastNames.join(" ") || " ";

    const apiPayload = {
      first_name,
      last_name,
      email: frontendData.email,
      phone_number: frontendData.phone,
      password: frontendData.password,
      role: frontendData.role 
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return { success: true, data };

  } catch (error: unknown) {
    // 1. Define a default error object using your type
    const errorResponse: errorType = {
      success: false,
      error: "An unknown error occurred"
    };

    // 2. Check if the error is a standard Error object
    if (error instanceof Error) {
      errorResponse.error = error.message;
    } 
    // 3. Handle cases where the backend sends a specific object
    else if (typeof error === 'object' && error !== null && 'message' in error) {
       errorResponse.error = String((error as { message: string }).message);
    }

    return errorResponse;
  }
};
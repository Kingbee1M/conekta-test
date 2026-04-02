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

export const signupUser = (credentials: signupTypes) => async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server did not return JSON. Check if the backend is running.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return { success: true, data };

  } catch (error: unknown) {
    const err = error as errorType; 
    return { 
      success: err.success, 
      error: err.error || "An unknown error occurred" 
    };
  }
};
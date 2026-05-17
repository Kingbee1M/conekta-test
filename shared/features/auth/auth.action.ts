import { setUserInfo } from '@/shared/store/authSlice';
import { AppDispatch } from '@/shared/store/store';
import { signupTypes } from '@/types';
import { loginTypes } from '@/types';
import { errorType } from '@/types';
import { use } from 'react';

export const loginUser = (credentials: loginTypes) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', // Sends/receives cookies
    });

    const result = await response.json();
    console.log("Login Response:", result);
    if (response.ok || result.status_code === 201) {
      const userData = result.data || result.user;

      if (userData) {
        dispatch(setUserInfo(userData));
      }

      return { success: true, message: result.message };
    }

    return {
      success: false,
      message: result.message || 'Login failed. Please check your credentials.'
    };

  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
};


export const signupUser = (userData: signupTypes) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include', // Important if your backend sets a session/cookie immediately
    });

    const result = await response.json();
    console.log("Signup Response:", result);

    // Backend standard for "Created" is 201
    console.log(result)
    if (response.ok || result.status_code === 201) {
      
      // If your backend logs the user in immediately after signup:
      const user = result.data || result.user;
      console.log(user)
    }

    // Handle errors (e.g., email already exists)
    return {
      success: true,
      message: result.message 
    };

  } catch (error) {
    console.error("Signup Error:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred during signup." 
    };
  }
};
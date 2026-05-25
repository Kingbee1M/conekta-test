import { setUserInfo } from '@/shared/store/authSlice';
import { AppDispatch } from '@/shared/store/store';
import { signupTypes } from '@/types';
import { loginTypes } from '@/types';

export const loginUser = (credentials: loginTypes) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
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
      message: result.message || 'sucess'
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
      credentials: 'include',
    });

    const result = await response.json();
    console.log("Signup Response Check:", result);

    // ✅ FIX 1: Trust the backend's explicit success boolean flag
    if (result.success === true) {
      const user = result.data || result.user;
      
      if (user) {
        dispatch(setUserInfo(user));
      }

      // Return a true success object back to onSubmit
      return {
        success: true,
        message: result.message || "Account created successfully!"
      };
    }

    // ✅ FIX 2: If result.success is false (e.g. Email already in use), return success: false
    return {
      success: false,
      message: result.message || "Signup failed. Please try again."
    };

  } catch (error) {
    console.error("Signup Error:", error);
    return { 
      success: false, 
      message: "An unexpected network error occurred during signup." 
    };
  }
};
import { clearUserInfo } from '@/shared/store/authSlice';
import { AppDispatch } from '@/shared/store/store';
import { executeCoreRequest, ApiResponse } from '@/lib/api'; 
import { signupTypes, loginTypes } from '@/types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';


interface AuthApiResponse extends ApiResponse {
  success?: boolean;
}


function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const rtkError = error as FetchBaseQueryError;
    if (rtkError.data && typeof rtkError.data === 'object') {
      const dataPayload = rtkError.data as Record<string, unknown>;
      if (typeof dataPayload.message === 'string') return dataPayload.message;
    }
    const nativeError = error as Error;
    if (typeof nativeError.message === 'string') return nativeError.message;
  }
  return "An unexpected error occurred.";
}


export const loginUser = (credentials: loginTypes) => async () => {
  try {
    const result = await executeCoreRequest<AuthApiResponse>({
      url: '/auth/login/',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: credentials,
    });

    console.log("Login Response via Bouncer:", result);

    if (result.code === 200 || result.code === 201) {
      return { success: true, message: result.message };
    }

    return {
      success: false,
      message: result.message || 'Login failed.'
    };

  } catch (error: unknown) {
    console.error("Login Error via Bouncer:", error);
    return { 
      success: false, 
      message: getErrorMessage(error)
    };
  }
};


export const signupUser = (userData: signupTypes) => async () => {
  try {
    const result = await executeCoreRequest<AuthApiResponse>({
      url: '/auth/register/',
      method: 'POST',
      body: userData,
    });

    console.log("Signup Response via Bouncer:", result);

    if (result.success === true || result.status_code === 201) {
      return {
        success: true,
        message: result.message || "Account created successfully!"
      };
    }

    return {
      success: false,
      message: result.message || "Signup failed. Please try again."
    };

  } catch (error: unknown) {
    console.error("Signup Error via Bouncer:", error);
    return { 
      success: false, 
      message: getErrorMessage(error)
    };
  }
};


export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    const result = await executeCoreRequest<AuthApiResponse>({
      url: '/auth/logout/',
      method: 'POST',
    });
    console.log("Logout Response via Bouncer:", result);
    
  } catch (error) {
    console.error("Backend logout failed, forcing frontend state cleanup:", error);
  } finally {
    dispatch(clearUserInfo());

    if (typeof window !== 'undefined') {
      localStorage.removeItem('persist:root'); 
      window.location.href = '/log-in'; 
    }
  }
};
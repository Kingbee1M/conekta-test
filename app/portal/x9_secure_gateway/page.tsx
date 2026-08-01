'use client';

import { useState, use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { useFormik } from 'formik';
import { z } from 'zod';
import { LuLock, LuMail, LuEye, LuEyeOff, LuShieldAlert } from 'react-icons/lu';

import { loginUser } from '@/shared/features/auth/auth.action';
import { useToast } from '@/app/components/ui/ToastProvider';
import { useAppDispatch } from '@/lib/hooks';

// 🛑 FORCE DYNAMIC RENDERING FOR PRODUCTION 🛑
export const dynamic = 'force-dynamic';

enum RoleEnum {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

interface Props {
  searchParams: Promise<{ key?: string }>;
}

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
  portal: z.nativeEnum(RoleEnum, {
    error: 'Please select a valid portal',
  }),
});

export default function SecretAdminLoginPage({ searchParams }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const resolvedParams = use(searchParams);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Validate Secret Key
  if (resolvedParams?.key !== 'launch-2026-secure') {
    notFound();
  }

  // ... rest of your formik and component code remains unchanged

  const formik = useFormik({
    initialValues: {
      portal: RoleEnum.ADMIN,
      email: '',
      password: '',
    },
    validate: (values) => {
      const result = loginSchema.safeParse(values);
      if (result.success) return {};

      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setAuthError(null);

        const result = await dispatch(
          loginUser({
            email: values.email,
            password: values.password,
            portal: RoleEnum.ADMIN, // Explicitly guaranteed
          })
        );

        if (result?.success) {
          addToast({
            title: 'Authentication Successful',
            description: result.message || 'Redirecting to secure dashboard...',
            variant: 'success',
            duration: 3000,
          });

          router.replace('/loading-dashboard');
        } else {
          const errorMsg = result?.message || 'Access Denied: Invalid root authority credentials.';
          setAuthError(errorMsg);
          addToast({
            title: 'Authentication Failed',
            description: errorMsg,
            variant: 'error',
            duration: 4000,
          });
        }
      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : 'An unexpected cryptographic exception occurred.';
        setAuthError(errorMsg);
        addToast({
          title: 'System Error',
          description: errorMsg,
          variant: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50/50 px-4 select-none selection:bg-emerald-500/10">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-xl shadow-gray-200/50 relative overflow-hidden">
        
        {/* Accent top border strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#00AC72] to-transparent" />

        {/* Brandless Admin Header Context */}
        <div className="flex flex-col text-left mb-6">
          <div className="flex items-center gap-2 text-[#00AC72] text-xs tracking-widest uppercase mb-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00AC72] animate-pulse" />
            Root Gateway System
          </div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">Admin Authority</h1>
          <p className="text-xs text-gray-400 mt-1">Authorized operations personnel only. System access actions are strictly monitored.</p>
        </div>

        {/* Error Feedback Strip */}
        {authError && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 p-3 rounded-xl mb-5 text-left text-xs font-semibold text-red-600">
            <LuShieldAlert className="text-base shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Input Interactive Form Stack */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col text-left">

          {/* Email Field */}
          <div className="outerDiv mb-4 w-full">
            <label className="text-xs font-semibold" htmlFor="email">Email</label>
            <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}>
              <LuMail />
              <input 
                type="email" 
                id="email" 
                {...formik.getFieldProps('email')} 
                placeholder="companyemail@conekta.com" 
                className="w-full outline-none" 
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="outerDiv mb-4 w-full">
            <label className="text-xs font-semibold" htmlFor="password">Password</label>
            <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}`}>
              <LuLock />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                {...formik.getFieldProps('password')} 
                placeholder="••••••••" 
                className="w-full outline-none" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-[#00AC72] hover:bg-[#009663] text-white font-bold text-xs py-3 rounded-xl transition-colors mt-2 shadow-md shadow-emerald-700/10 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Authenticate Access'
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-gray-400 mt-8 select-none">
          SECURE LOGISTICS ID: V1.0-LEKKI
        </div>
      </div>
    </div>
  );
}
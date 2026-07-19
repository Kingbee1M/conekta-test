'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useFormik } from 'formik';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { LuLock, LuMail, LuEye, LuEyeOff, LuShieldAlert } from 'react-icons/lu';

enum RoleEnum {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin'
}

interface Props {
  searchParams: Promise<{ key?: string }>;
}

// 1. Zod v4 Compatible Schema Definition
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  portal: z.nativeEnum(RoleEnum, {
    error: "Please select a valid portal"
  })
});

export default function SecretAdminLoginPage({ searchParams }: Props) {
  const router = useRouter();
  const resolvedParams = use(searchParams);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (resolvedParams.key !== 'launch-2026-secure') {
    notFound();
  }

  // 2. Formik Initialization Hook with clean v4 Zod mapping (.issues)
  const formik = useFormik({
    initialValues: {
      portal: RoleEnum.SUPER_ADMIN,
      email: '',
      password: '',
    },
    validate: (values) => {
      const result = loginSchema.safeParse(values);
      if (result.success) return {};

      const errors: Record<string, string> = {};
      
      // Zod v4 standard uses .issues instead of .errors
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
        console.log(`Verifying target authority: ${values.portal}`, values.email);
        
        const mockSuccess = true; 
        
        if (mockSuccess) {
          document.cookie = "isLoggedIn=true; path=/; max-age=86400; SameSite=Lax";
          router.replace('/loading-dashboard');
        } else {
          setAuthError('Access Denied: Invalid root authority credentials.');
        }
      } catch (error: unknown) {
        // Safe type guarding to satisfy ESLint no-explicit-any rules
        if (error && typeof error === 'object' && 'data' in error) {
          const apiErr = error as { data: { message?: string } };
          setAuthError(apiErr.data.message || 'An unexpected cryptographic exception occurred.');
        } else if (error instanceof Error) {
          setAuthError(error.message);
        } else {
          setAuthError('An unexpected cryptographic exception occurred.');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50/50 px-4 select-none selection:bg-emerald-500/10">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-xl shadow-gray-200/50 relative overflow-hidden">
        
        {/* Subtle professional accent top border strip */}
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

        {/* 3. Slider Selection Toggle Container with Animated Framer Motion Backdrop */}
        <div className="relative flex p-1 bg-gray-100 rounded-xl mb-6 border border-gray-200/40">
          <div className="absolute inset-y-1 left-1 right-1 pointer-events-none grid grid-cols-2">
            <motion.div
              className="h-full bg-white rounded-lg shadow-xs"
              initial={false}
              animate={{
                x: formik.values.portal === RoleEnum.SUPER_ADMIN ? '100%' : '0%'
              }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          </div>

          <button
            type="button"
            onClick={() => formik.setFieldValue('portal', RoleEnum.ADMIN)}
            className={`w-full relative z-10 text-center py-2 text-xs font-bold transition-colors duration-200 cursor-pointer ${
              formik.values.portal === RoleEnum.ADMIN ? 'text-gray-800' : 'text-gray-400'
            }`}
          >
            Standard Admin
          </button>
          <button
            type="button"
            onClick={() => formik.setFieldValue('portal', RoleEnum.SUPER_ADMIN)}
            className={`w-full relative z-10 text-center py-2 text-xs font-bold transition-colors duration-200 cursor-pointer ${
              formik.values.portal === RoleEnum.SUPER_ADMIN ? 'text-gray-800' : 'text-gray-400'
            }`}
          >
            Super Admin
          </button>
        </div>

        {/* Error Feedback Strip */}
        {authError && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 p-3 rounded-xl mb-5 text-left text-xs font-semibold text-red-600">
            <LuShieldAlert className="text-base shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Input Interactive Form Stack */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 text-left">
          
          {/* Email Row Area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Root Identifier</label>
            <div className="relative flex items-center">
              <LuMail className="absolute left-3.5 text-gray-400 text-sm" />
              <input
                type="email"
                name="email"
                placeholder="root@system.io"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full text-xs text-gray-700 bg-white border pl-10 pr-4 py-3 rounded-xl outline-none transition-all ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#00AC72] focus:ring-1 focus:ring-[#00AC72]/20'
                }`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <span className="text-[10px] font-bold text-red-500 mt-0.5">{formik.errors.email}</span>
            )}
          </div>

          {/* Password Row Area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Security Access Token</label>
            <div className="relative flex items-center">
              <LuLock className="absolute left-3.5 text-gray-400 text-sm" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full text-xs text-gray-700 bg-white border pl-10 pr-10 py-3 rounded-xl outline-none transition-all ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#00AC72] focus:ring-1 focus:ring-[#00AC72]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-sm"
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <span className="text-[10px] font-bold text-red-500 mt-0.5">{formik.errors.password}</span>
            )}
          </div>

          {/* Core Action Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-[#00AC72] hover:bg-[#009663] text-white font-bold text-xs py-3 rounded-xl transition-colors mt-4 shadow-md shadow-emerald-700/10 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Authenticate Access'
            )}
          </button>
        </form>

        {/* Minimal Footer Signature Note */}
        <div className="text-center text-[10px] text-gray-400 mt-8 select-none">
          SECURE LOGISTICS ID: V1.0-LEKKI
        </div>
      </div>
    </div>
  );
}
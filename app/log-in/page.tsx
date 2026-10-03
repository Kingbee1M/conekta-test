'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { loginUser } from '@/shared/features/auth/auth.action';
import { useToast } from '../components/ui/ToastProvider';
import { useFormik } from 'formik';
import { z } from 'zod';
import Image from 'next/image';
import logo from '@/public/png/logofinal.png';
import { CiMail, CiLock } from 'react-icons/ci';
import Link from 'next/link';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useState } from 'react';
import { FiEyeOff, FiEye } from 'react-icons/fi';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Loader } from 'lucide-react';
import { PortalDial } from '../components/ui/PortalDial';
import { AnimatePresence, motion } from 'framer-motion';
import type { CSSProperties } from 'react';

const PORTAL_VISUALS = {
  [RoleEnum.CUSTOMER]: {
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    title: 'Find a place\nthat feels like home.',
    description: 'Your next chapter starts with the right space.',
    color: '#00AC72',
  },
  [RoleEnum.LISTER]: {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
    title: 'A better way\nto manage property.',
    description: 'Bring your listings, tenants, and property tools together.',
    color: '#2563EB',
  },
  [RoleEnum.ARTISAN]: {
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    title: 'Your skills can\ntake you further.',
    description: 'Connect your craft with people who need your expertise.',
    color: '#D97706',
  },
};

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  portal: z.nativeEnum(RoleEnum, { error: 'Please select a valid portal' }),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const { addToast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      portal: RoleEnum.CUSTOMER,
    },
    validate: (values) => {
      const result = loginSchema.safeParse(values);
      if (result.success) return {};

      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await dispatch(loginUser(values));

        if (result.success) {
          addToast({
            title: 'Success',
            description: 'Welcome back!',
            variant: 'success',
            duration: 3000,
          });

          setTimeout(() => {
            if (callbackUrl) {
              router.replace(
                `/loading-dashboard?callbackUrl=${encodeURIComponent(
                  callbackUrl
                )}&targetRole=${values.portal}`
              );
            } else {
              router.replace(`/loading-dashboard?targetRole=${values.portal}`);
            }
          }, 2000);
        } else {
          addToast({
            title: 'Login Failed',
            description: result.message || 'Invalid credentials',
            variant: 'error',
            duration: 5000,
          });
          setSubmitting(false);
        }
      } catch (error) {
        console.error('Submission crash:', error);
        setSubmitting(false);
      }
    },
  });

  const portalVisual = PORTAL_VISUALS[formik.values.portal as keyof typeof PORTAL_VISUALS] ?? PORTAL_VISUALS[RoleEnum.CUSTOMER];

  return (
    <section className="login-layout" style={{ '--active-portal-color': portalVisual.color } as CSSProperties}>
      <aside className="login-visual" aria-label="Conekta portal introduction">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={formik.values.portal}
            className="login-visual-scene"
            initial={{ opacity: 0, scale: 1.035, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.99, x: -12 }}
            transition={{ duration: 0.42, ease: 'easeOut' }}
          >
            <Image src={portalVisual.image} alt="" fill priority sizes="(max-width: 900px) 100vw, 48vw" className="login-visual-image" />
            <div className="login-visual-shade" />
            <div className="login-visual-copy">
              <Image src={logo} width={120} height={60} alt="Conekta" className="mb-8 w-32 brightness-0 invert" />
              <h2>{portalVisual.title}</h2>
              <p>{portalVisual.description}</p>
              <span className="login-visual-tag">{formik.values.portal} portal</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </aside>

      <main className="login-main">
        <div className="login-portal-column">
          <PortalDial
            value={formik.values.portal}
            onChange={(role) => formik.setFieldValue('portal', role)}
          />
          {formik.touched.portal && formik.errors.portal && (
            <span className="mt-2 block text-center text-xs text-red-500">{formik.errors.portal}</span>
          )}
        </div>
      <form
        onSubmit={formik.handleSubmit}
        className="login-form"
      >
        <Image src={logo} width={100} height={100} alt="logo" className="w-30" />
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
        <p className="mb-2 text-gray-500 text-sm text-center">
          Sign in to your Conekta account
        </p>

        {/* Email Field */}
        <div className="outerDiv mb-4 w-full">
          <label className="text-xs font-semibold" htmlFor="email">
            Email
          </label>
          <div
            className={`inputDiv flex items-center border p-2 rounded gap-2 ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          >
            <CiMail />
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              placeholder="email@example.com"
              className="w-full outline-none"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <span className="text-[10px] text-red-500 mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="outerDiv mb-4 w-full">
          <label className="text-xs font-semibold" htmlFor="password">
            Password
          </label>
          <div
            className={`inputDiv flex items-center border p-2 rounded gap-2 ${
              formik.touched.password && formik.errors.password
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          >
            <CiLock />
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="password"
              {...formik.getFieldProps('password')}
              placeholder="••••••••"
              className="w-full outline-none"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <span className="text-[10px] text-red-500 mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full my-3 bg-[#00AC72] text-white px-3 py-2 rounded-lg font-semibold group border border-transparent hover:bg-white hover:border-[#008f5d] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {formik.isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin group-hover:text-primary-green" />
              <span className="group-hover:text-primary-green text-white">
                Signing in...
              </span>
            </>
          ) : (
            <span className="text-white group-hover:text-primary-green!">
              Sign in
            </span>
          )}
        </button>

        <div className="w-full flex items-center gap-2 my-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-400">Or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="flex justify-between w-full my-3 gap-3">
          <button
            type="button"
            className="flex items-center gap-2 border border-gray-300 py-3 flex-1 justify-center rounded-xl text-xs font-bold hover:bg-gray-50"
          >
            <FaGoogle className="text-red-500" />
            Google
          </button>
          <button
            type="button"
            className="flex items-center gap-2 border border-gray-300 py-3 flex-1 justify-center rounded-xl text-xs font-bold hover:bg-gray-50"
          >
            <FaFacebook className="text-blue-600" />
            Facebook
          </button>
        </div>

        <p className="mt-5">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="text-sm text-primary-green hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
      </main>
    </section>
  );
}

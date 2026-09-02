'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage, FormikProps } from 'formik';
import * as Zod from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { FiX, FiUser, FiMail, FiPhone, FiLock, FiCalendar, FiGlobe, FiMapPin } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/shared/store/store';
import { createAdminUser, resetCreateAdminState } from '@/shared/store/adminUsersSlice';
import { RoleEnum, ROLE_BADGE_MAP } from '@/shared/enums/roles.enum';
import { CreateAdminUserPayload } from '@/shared/service/admin/types/adminUsersTypes';
import CustomSelect from '../ui/CustomSelect';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';

// Helper to sanitize optional empty string values
const optionalString = Zod.string()
  .trim()
  .optional()
  .transform((val) => (val === '' ? undefined : val));

// Restricted roles for admin creation
const ALLOWED_ADMIN_ROLES = [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN] as const;

// Zod schema definitions with restricted roles validation
const adminSchema = Zod.object({
  first_name: Zod.string({ message: 'First name is required' })
    .trim()
    .min(2, 'First name must be at least 2 characters'),
  middle_name: optionalString,
  last_name: Zod.string({ message: 'Last name is required' })
    .trim()
    .min(2, 'Last name must be at least 2 characters'),
  email: Zod.string({ message: 'Email address is required' })
    .trim()
    .email('Please enter a valid email address'),
  phone_number: Zod.string({ message: 'Phone number is required' })
    .trim()
    .min(8, 'Phone number must be at least 8 digits'),
  role: Zod.enum([RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN], {
    message: 'Please select a valid admin role (Admin or Super Admin)',
  }),
  password: Zod.string({ message: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
  date_of_birth: optionalString,
  nationality: optionalString,
  country: optionalString,
  state: optionalString,
  lga: optionalString,
  address: optionalString,
  postal_code: optionalString,
});

interface AddAdminModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Convert ALLOWED_ADMIN_ROLES into styled JSX options using ROLE_BADGE_MAP
const ROLE_OPTIONS = ALLOWED_ADMIN_ROLES.map((role) => {
  const badge = ROLE_BADGE_MAP[role];
  return {
    value: role,
    label: typeof badge === 'object' && badge !== null ? badge.label : (badge ?? role),
  };
});

// Map NigeriaStateEnum into select options using Object.values
const STATE_OPTIONS = Object.values(NigeriaStateEnum).map((value) => ({
  value,
  label: value,
}));

export default function AddAdminModalPortal({ isOpen, onClose }: AddAdminModalPortalProps) {
  const dispatch = useAppDispatch();
  const { session } = useAppSelector((state: RootState) => state.auth);
  const { createLoading, createError, createSuccess } = useAppSelector(
    (state: RootState) => state.adminUsers
  );

  // Strict DOM Access Guard: Must be logged in as SUPER_ADMIN
  const isSuperAdmin = session?.active_role === RoleEnum.SUPER_ADMIN;

  useEffect(() => {
    if (createSuccess) {
      dispatch(resetCreateAdminState());
      onClose();
    }
  }, [createSuccess, dispatch, onClose]);

  const handleClose = () => {
    dispatch(resetCreateAdminState());
    onClose();
  };

  if (!isSuperAdmin || typeof window === 'undefined' || !isOpen) return null;

  const initialValues: CreateAdminUserPayload = {
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: RoleEnum.ADMIN,
    password: '',
    date_of_birth: '',
    nationality: '',
    country: 'Nigeria',
    state: '',
    lga: '',
    address: '',
    postal_code: '',
  };

  const handleSubmit = (values: CreateAdminUserPayload) => {
    const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== '' && value !== undefined) {
        acc[key as keyof CreateAdminUserPayload] = value;
      }
      return acc;
    }, {} as CreateAdminUserPayload);

    dispatch(createAdminUser(cleanedValues));
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={
              createError
                ? {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: [0, -8, 8, -6, 6, -3, 3, 0],
                  }
                : { opacity: 1, scale: 1, y: 0, x: 0 }
            }
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="text-base font-bold text-gray-900">Provision New Admin</h3>
                <p className="text-xs text-gray-500">Create a new internal admin or super admin account</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Global Error Banner */}
            {createError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                {createError}
              </div>
            )}

            {/* Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={toFormikValidationSchema(adminSchema)}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue, setFieldTouched }: FormikProps<CreateAdminUserPayload>) => {
                // Dynamically extract LGA options based on selected State value
                const lgaOptions = values.state && NIGERIA_LGA_MAP[values.state as NigeriaStateEnum]
                  ? NIGERIA_LGA_MAP[values.state as NigeriaStateEnum].map((lga) => ({
                      value: lga,
                      label: lga,
                    }))
                  : [];

                return (
                  <Form className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Name Fields Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                          <Field
                            name="first_name"
                            type="text"
                            placeholder="John"
                            className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none transition-all ${
                              touched.first_name && errors.first_name
                                ? 'input-error border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-200 focus:ring-2 focus:ring-primary-green focus:border-transparent'
                            }`}
                          />
                        </div>
                        <ErrorMessage name="first_name" component="div" className="text-[10px] text-red-500 mt-0.5 font-medium" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Middle Name</label>
                        <Field
                          name="middle_name"
                          type="text"
                          placeholder="Edward"
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="last_name"
                          type="text"
                          placeholder="Doe"
                          className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition-all ${
                            touched.last_name && errors.last_name
                              ? 'input-error border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                              : 'border-gray-200 focus:ring-2 focus:ring-primary-green focus:border-transparent'
                          }`}
                        />
                        <ErrorMessage name="last_name" component="div" className="text-[10px] text-red-500 mt-0.5 font-medium" />
                      </div>
                    </div>

                    {/* Contact Details Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                          <Field
                            name="email"
                            type="email"
                            placeholder="admin@example.com"
                            className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none transition-all ${
                              touched.email && errors.email
                                ? 'input-error border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-200 focus:ring-2 focus:ring-primary-green focus:border-transparent'
                            }`}
                          />
                        </div>
                        <ErrorMessage name="email" component="div" className="text-[10px] text-red-500 mt-0.5 font-medium" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                          <Field
                            name="phone_number"
                            type="tel"
                            placeholder="+234 800 000 0000"
                            className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none transition-all ${
                              touched.phone_number && errors.phone_number
                                ? 'input-error border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-200 focus:ring-2 focus:ring-primary-green focus:border-transparent'
                            }`}
                          />
                        </div>
                        <ErrorMessage name="phone_number" component="div" className="text-[10px] text-red-500 mt-0.5 font-medium" />
                      </div>
                    </div>

                    {/* Role & Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Assigned Role <span className="text-red-500">*</span>
                        </label>
                        <CustomSelect
                          variant="boxed"
                          options={ROLE_OPTIONS}
                          selected={values.role}
                          defaultValue="Select Role"
                          onChange={(value) => {
                            setFieldValue('role', value);
                            setFieldTouched('role', true, false);
                          }}
                          className={
                            touched.role && errors.role ? 'rounded-xl ring-2 ring-red-500' : ''
                          }
                        />
                        <ErrorMessage name="role" component="div" className="text-[10px] text-red-500 mt-0.5 font-medium" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                          <Field
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className={`w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none transition-all ${
                              touched.password && errors.password
                                ? 'input-error border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-200 focus:ring-2 focus:ring-primary-green focus:border-transparent'
                            }`}
                          />
                        </div>
                        <ErrorMessage name="password" component="div" className="text-[10px] text-red-500 mt-0.5 font-medium" />
                      </div>
                    </div>

                    {/* Optional Details Divider */}
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Optional Personal Information
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                          <Field
                            name="date_of_birth"
                            type="date"
                            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nationality</label>
                        <div className="relative">
                          <FiGlobe className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                          <Field
                            name="nationality"
                            type="text"
                            placeholder="Nigerian"
                            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address & Region Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
                        <Field
                          name="country"
                          type="text"
                          placeholder="Nigeria"
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Dynamic State CustomSelect */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                        <CustomSelect
                          variant="boxed"
                          options={STATE_OPTIONS}
                          selected={values.state || ''}
                          defaultValue="Select State"
                          onChange={(value) => {
                            setFieldValue('state', value);
                            setFieldValue('lga', '');
                            setFieldTouched('state', true, false);
                          }}
                        />
                      </div>

                      {/* Dynamic LGA CustomSelect */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">LGA</label>
                        <CustomSelect
                          variant="boxed"
                          options={lgaOptions}
                          selected={values.lga || ''}
                          defaultValue={values.state ? 'Select LGA' : 'Select State First'}
                          disabled={!values.state}
                          onChange={(value) => {
                            setFieldValue('lga', value);
                            setFieldTouched('lga', true, false);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Residential Address</label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <Field
                          name="address"
                          type="text"
                          placeholder="123 Commercial Avenue"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={createLoading}
                        className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createLoading}
                        style={{ backgroundColor: 'var(--color-primary-green, #1b5e32)' }}
                        className="px-5 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {createLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating...</span>
                          </>
                        ) : (
                          'Create Admin'
                        )}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
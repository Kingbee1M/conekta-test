"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup"; // Using Yup for Formik array validation, or use your Zod schema parsed
import Image from "next/image";
import logo from '../../public/svg/logo-enhanced.svg';
import Link from "next/link";
import { useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";

export default function VerifyEmail() {
  const router = useRouter();
  // Array of refs to hold references to the 6 input elements
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formik = useFormik({
    initialValues: {
      otp: ["", "", "", "", "", ""],
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .of(Yup.string().required(""))
        .length(6, "Must be exactly 6 digits"),
    }),
    onSubmit: async (values) => {
      const otpCode = values.otp.join("");
      console.log("Submitting OTP Code:", otpCode);
      // Add your dispatch action / verification API call here
    },
  });

  // Handle number input and automatic forward focus
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    // Only accept numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...formik.values.otp];
    // Keep only the last character entered if they type over an existing one
    const currentCharacter = value.slice(-1);
    newOtp[index] = currentCharacter;
    
    formik.setFieldValue("otp", newOtp);

    // If character is entered, move focus to the next box
    if (currentCharacter && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace deleting and returning focus backward
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!formik.values.otp[index] && index > 0) {
        // If current box is empty, move back and clear previous box
        const newOtp = [...formik.values.otp];
        newOtp[index - 1] = "";
        formik.setFieldValue("otp", newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Just clear the current box
        const newOtp = [...formik.values.otp];
        newOtp[index] = "";
        formik.setFieldValue("otp", newOtp);
      }
    }
  };

  // Handle pasting a full 6-digit code (e.g., 123456)
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Validate that the pasted text is exactly 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      formik.setFieldValue("otp", digits);
      // Focus the last input box
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <section className="flex py-16 flex-col justify-center min-h-screen items-center gap-7 bg-linear-to-br from-[#EDFDF5] via-[#EDFDF5] to-white">
      <form 
        onSubmit={formik.handleSubmit} 
        className="py-6 px-7 w-full max-w-md items-center border-gray-200 rounded-2xl border border-solid bg-white flex flex-col gap-5 shadow-xs"
      >
        <Image src={logo} width={100} height={100} alt="logo" className="w-28 h-auto" />

        <div className="text-center flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            We have sent a 6-digit verification code to your email address.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full mt-2">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider block text-center">
            Verification Code
          </span>
          
          {/* 6 Digit Box Container */}
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {formik.values.otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                ref={(el) => { inputRefs.current[index] = el; }}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 border border-gray-300 rounded-xl text-center text-xl font-bold text-gray-800 focus:border-[#00AC72] focus:ring-2 focus:ring-[#00AC72]/20 outline-hidden transition-all"
              />
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          className="w-full mt-4 bg-[#00AC72] text-white px-3 py-3 rounded-xl font-semibold hover:bg-[#008f5d] border border-transparent transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {formik.isSubmitting ? "Verifying your account..." : "Verify"}
        </button>
        
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/get-started" className="font-semibold text-[#00AC72] hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </section>
  );
}
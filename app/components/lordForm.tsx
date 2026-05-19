'use client'
import Link from "next/link";
import { MdOutlinePersonOutline } from "react-icons/md";
import { CiMail, CiLock} from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { FiEyeOff, FiEye } from "react-icons/fi";
import logo from '../../public/svg/logo-enhanced.svg'
import Image from "next/image";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { FormikErrors, FormikTouched } from 'formik';


interface SignupFormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role?: string;
}

interface AuthFormProps {
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    confirmPassword: string;
    setConfirmPassword: (val: string) => void;
    name: string;
    setName: (val: string) => void;
    phone: string;
    setPhone: (val: string) => void;
    onSubmit: () => void;
    role?: string | null;
    setThemeColor: (color: string) => void;
    errors: FormikErrors<SignupFormValues>;
    touched: FormikTouched<SignupFormValues>;
    isLoading: boolean;
    setFieldTouched: (field: string, isTouched: boolean) => void;
}

export default function TenantForm({ 
    name, setName, email, setEmail, password, setPassword, phone, setPhone, onSubmit, confirmPassword, setConfirmPassword,
    setThemeColor, errors, touched, isLoading, setFieldTouched
    }: AuthFormProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

    useEffect(() => {
        setThemeColor('#2171FF');
    }, [setThemeColor]);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }} 
            className="w-full max-w-md rounded-2xl bg-white md:bg-gray-400 p-1 shadow-sm relative group overflow-clip"
        >
            <div className="absolute inset-x-0 -bottom-full h-full bg-[#2171FF] z-10 transition-all duration-700 ease-in-out group-hover:bottom-0" />

            <div className="w-full h-full bg-white rounded-[calc(1rem-2px)] flex flex-col justify-center items-center gap-4 py-8 px-6 relative z-20">
                <Image src={logo} width={100} height={100} alt="logo" />
                <h2 className="text-3xl font-bold text-[#2171FF]">Create Account</h2>
                <p className="text-gray-500 text-sm">Sign up as Renter / Buyer</p>
                <Link href='/get-started' className="text-[#2171FF] text-sm hover:underline">Change role</Link>

                {/* Full Name */}
                <div className="outerDiv w-full">
                    <label htmlFor="full_name">Full Name</label>
                    <div className={`inputDiv ${errors?.name && touched?.name ? 'border-red-500' : ''}`}>
                        <MdOutlinePersonOutline />
                        <input 
                            className="inputTag" 
                            id="full_name" 
                            placeholder="Full Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            onBlur={() => setFieldTouched('name', true)}
                        />
                    </div>
                    {errors?.name && touched?.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="outerDiv w-full">
                    <label htmlFor="email">Email Address</label>
                    <div className={`inputDiv ${errors?.email && touched?.email ? 'border-red-500' : ''}`}>
                        <CiMail />
                        <input 
                            className="inputTag" 
                            id="email" 
                            placeholder="You@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            onBlur={() => setFieldTouched('email', true)}
                        />
                    </div>
                    {errors?.email && touched?.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="outerDiv w-full">
                    <label htmlFor="phone">Phone number</label>
                    <div className={`inputDiv ${errors?.phone && touched?.phone ? 'border-red-500' : ''}`}>
                        <FiPhone />
                        <input 
                            className="inputTag" 
                            id="phone" 
                            placeholder="+234 800 000 0000" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            onBlur={() => setFieldTouched('phone', true)}
                        />
                    </div>
                    {errors?.phone && touched?.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div className="outerDiv w-full">
                    <label htmlFor="password">Password</label>
                    <div className={`inputDiv ${errors?.password && touched?.password ? 'border-red-500' : ''}`}>
                        <CiLock />
                        <input 
                            className="inputTag" 
                            id="password" 
                            type={isPasswordVisible ? "text" : "password"} 
                            placeholder="Create a strong password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            onBlur={() => setFieldTouched('password', true)}
                        />
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                            {isPasswordVisible ? <FiEye /> : <FiEyeOff />}
                        </button>
                    </div>
                    {errors?.password && touched?.password && <p className="text-red-500 text-[10px] mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="outerDiv w-full">
                    <label htmlFor="conPass">Confirm Password</label>
                    <div className={`inputDiv ${errors?.confirmPassword && touched?.confirmPassword ? 'border-red-500' : ''}`}>
                        <CiLock />
                        <input 
                            className={`inputTag`} 
                            type={isConfirmPasswordVisible ? "text" : "password"} 
                            id="conPass" 
                            placeholder="Confirm your password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            onBlur={() => setFieldTouched('confirmPassword', true)}
                        />
                        <button type="button" onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                            {isConfirmPasswordVisible ? <FiEye /> : <FiEyeOff />}
                        </button>
                    </div>
                    {errors?.confirmPassword && touched?.confirmPassword && <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="w-full flex gap-3 items-center text-sm font-semibold my-3">
                    <Checkbox />
                    <p>I agree to the <span className="text-primary-green">Terms of Service</span> and <span className="text-primary-green">Privacy Policy</span></p>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#2171FF] text-white p-3 rounded-lg font-semibold hover:bg-white hover:text-[#008f5d] border-[0.5px] hover:border-[#008f5d] transition-colors cursor-pointer flex justify-center items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>

                <div className="w-full flex items-center gap-2 my-2">
                    <hr className="flex-1 md:w-full border-gray-500" />
                    <span className="w-fit text-center text-sm">Or continue with</span>
                    <hr className="flex-1 md:w-full border-gray-500" />
                </div>

                <div className="flex justify-evenly md:justify-between w-full my-3">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer border border-gray-500 py-3 w-[45%] justify-center rounded-xl text-xs md:text-sm font-bold px-3"><FaGoogle />Google</Link>
                    <Link href="/" className="flex items-center gap-2 cursor-pointer border border-gray-500 py-3 w-[45%] justify-center rounded-xl text-xs md:text-sm font-bold px-3"><FaFacebook />Facebook</Link>
                </div>

                <p className="text-sm">
                    Already have an account? <Link href='/log-in' className="font-semibold text-primary-green">Sign in</Link>
                </p>
            </div>
        </form>
    );
}
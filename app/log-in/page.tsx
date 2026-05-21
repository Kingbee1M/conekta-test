'use client'
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/hooks"
import { loginUser } from "@/shared/features/auth/auth.action"
import { useToast } from "../components/ui/ToastProvider"
import { useFormik } from "formik"
import { z } from "zod"
import Image from "next/image"
import logo from '../../public/svg/logo-enhanced.svg'
import { CiMail, CiLock } from "react-icons/ci"
import Link from "next/link"
import { FaGoogle, FaFacebook } from "react-icons/fa"
import { useState } from "react"
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useStore } from "react-redux" // 1. Import useStore from react-redux
import { RootState } from "@/shared/store/store"
// 1. Zod Schema
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
    portal: z.string().min(1, "Please select a portal")
})

export default function Login() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { addToast } = useToast();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const store = useStore<RootState>(); // 2. Initialize the store instance hook
    // 2. Formik with manual validation
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            portal: "customer"
        },
        validate: (values) => {
            const result = loginSchema.safeParse(values);
            if (result.success) return {};

            // Flatten the Zod errors into a simple object { field: "message" }
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    errors[issue.path[0] as string] = issue.message;
                }
            });
            return errors;
        },
        onSubmit: async (values) => {
    const result = await dispatch(loginUser(values));
    
    if (result.success) {
        addToast({ 
            title: "Success", 
            description: "Welcome back!", 
            variant: "success", 
            duration: 3000 
        });
        
        // Push straight to the intermediate loading route wrapper
        setTimeout(() => {
            router.push('/loading-dashboard');
        }, 2000);
    } else {
        addToast({ 
            title: "Login Failed", 
            description: result.message || "Invalid credentials", 
            variant: "error", 
            duration: 5000 
        });
    }
}
    });

    return (
        <section className="flex py-16 flex-col justify-center min-h-screen items-center gap-7 bg-linear-to-br from-[#EDFDF5] via-[#EDFDF5] to-white">
            <form onSubmit={formik.handleSubmit} className="py-5 px-7 w-full max-w-95 items-center border-gray-300 rounded-lg border-2 border-solid bg-white flex flex-col gap-1">
                <Image src={logo} width={100} height={100} alt="logo" className="w-30" />
                {/* #2E975EB2
                #FFFFFFB2 */}
                <h1 className="font-bold text-xl mt-2">Welcome Back</h1>
                <p className="mb-5 text-gray-500 text-sm text-center">Sign in to your Conekta account</p>

                {/* Styled Portal Selector */}
                <div className="w-full mb-6">
                    <label className="text-xs font-semibold mb-2 block text-gray-700">Select Portal</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                        {['customer', 'lister'].map((option) => (
                            <label 
                                key={option}
                                className={`flex-1 text-center py-2 rounded-lg cursor-pointer transition-all text-sm font-medium capitalize
                                    ${formik.values.portal === option ? 'bg-white text-[#00AC72] shadow-sm' : 'text-gray-500'}`}
                            >
                                <input 
                                    type="radio"
                                    name="portal"
                                    className="hidden"
                                    checked={formik.values.portal === option}
                                    onChange={() => formik.setFieldValue('portal', option)}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Email Field */}
                <div className="outerDiv mb-4 w-full">
                    <label className="text-xs font-semibold" htmlFor="email">Email</label>
                    <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}>
                        <CiMail/>
                        <input type="email" id="email" {...formik.getFieldProps('email')} placeholder="email@example.com" className="w-full outline-none" />
                    </div>
                    {formik.touched.email && formik.errors.email && <span className="text-[10px] text-red-500 mt-1">{formik.errors.email}</span>}
                </div>

                {/* Password Field */}
                <div className="outerDiv mb-4 w-full">
                    <label className="text-xs font-semibold" htmlFor="password">Password</label>
                    <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}`}>
                        <CiLock/>
                        <input type={isPasswordVisible ? "text" : "password"}  id="password" {...formik.getFieldProps('password')} placeholder="••••••••" className="w-full outline-none" />
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                            {isPasswordVisible ? <FiEye /> : <FiEyeOff />}
                        </button>
                    </div>
                    {formik.touched.password && formik.errors.password && <span className="text-[10px] text-red-500 mt-1">{formik.errors.password}</span>}
                </div>

                <button 
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full my-3 bg-[#00AC72] text-white px-3 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#008f5d] border border-transparent hover:border-[#008f5d] transition-all disabled:opacity-50"
                >
                    {formik.isSubmitting ? "Signing in..." : "Sign in"}
                </button>

                <div className="w-full flex items-center gap-2 my-2">
                    <hr className="flex-1 border-gray-300"/><span className="text-sm text-gray-400">Or</span><hr className="flex-1 border-gray-300"/>
                </div>

                <div className="flex justify-between w-full my-3 gap-3">
                    <button type="button" className="flex items-center gap-2 border border-gray-300 py-3 flex-1 justify-center rounded-xl text-xs font-bold hover:bg-gray-50"><FaGoogle className="text-red-500"/>Google</button>
                    <button type="button" className="flex items-center gap-2 border border-gray-300 py-3 flex-1 justify-center rounded-xl text-xs font-bold hover:bg-gray-50"><FaFacebook className="text-blue-600"/>Facebook</button>
                </div>
                
            <p className="mt-5">Don&apos;t have an account? <Link href="/get-started" className="text-sm text-tertiary-green">Create one</Link></p>
            </form>
        </section>
    )
}
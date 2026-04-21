'use client'
import Link from "next/link";
import { MdOutlinePersonOutline } from "react-icons/md";
import { CiMail, CiLock} from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { FiEyeOff, FiEye } from "react-icons/fi";
import logo from '../../public/svg/logo-enhanced.svg'
import Image from "next/image";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle, FaFacebook } from "react-icons/fa";


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
}

export default function TenantForm({ 
    name, setName, email, setEmail, password, setPassword, phone, setPhone, onSubmit, confirmPassword, setConfirmPassword,
    setThemeColor // Destructure the new function
    }: AuthFormProps) {

    useEffect(() => {
        setThemeColor('#FE5D00'); // Tenant's green
    }, [setThemeColor]);
    return (
        <div className="w-full max-w-md rounded-2xl bg-gray-400 p-1 shadow-sm relative group overflow-clip">
            
            <div className="absolute inset-x-0 -bottom-full h-full bg-[#FE5D00] z-10 
            transition-all duration-700 ease-in-out 
            group-hover:bottom-0"/>


            <div className="w-full h-full bg-white rounded-[calc(1rem-2px)] flex flex-col justify-center items-center gap-2 py-8 px-6 relative z-20">
                <Image src={logo} width={100} height={100} alt="logo" />
                <h2 className="text-3xl font-bold text-[#FE5D00]">Create Account</h2>
                <p className="text-gray-500 text-sm">Sign up as Artisan</p>
                <Link href='/get-started' className="text-[#FE5D00] text-sm hover:underline">Change role</Link>
                
                <div className="outerDiv">
                    <label htmlFor="full_name">Full Name</label>
                    <div className="inputDiv">
                        <MdOutlinePersonOutline/>
                        <input className="inputTag" id="full_name" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    
                </div>
                
                <div className="outerDiv">
                    <label htmlFor="email">Email Address</label>
                    <div className="inputDiv">
                        <CiMail/>
                        <input className="inputTag" id="email" placeholder="You@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    
                </div>
    
                <div className="outerDiv">
                    <label htmlFor="phone">Phone number</label>
                    <div className="inputDiv">
                        <FiPhone/>
                        <input className="inputTag" id="phone" type="text" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    
                </div>
    
                <div className="outerDiv" tabIndex={-1}>
                    <label htmlFor="password">Password</label>
                    <div className="inputDiv">
                        <CiLock/>
                        <input className="inputTag" id="password" type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button>
    
                        </button>
                    </div>
                    
                </div>
    
                <div className="outerDiv">
                    <label htmlFor="conPass">Confirm Password</label>
                    <div className="inputDiv">
                        <CiLock/>
                        <input className="inputTag" type="password" id="conPass" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button>
    
                        </button>
                    </div>
                    
                </div>

                
                <div className="w-full flex gap-3 items-center text-sm font-semibold my-3">
                    <Checkbox/>
                    <p>I agree to the <span className="text-[#FE5D00]">Terms of Service</span> and <span className="text-[#FE5D00]">Privacy Policy</span></p>
                </div>
                
                <button onClick={onSubmit} className="w-full bg-[#FE5D00] text-white p-3 rounded-lg font-semibold hover:bg-[white] hover:text-[#FE5D00] border-[0.5px] hover:border-[#FE5D00] transition-colors cursor-pointer">
                    Create Account
                </button>

                <div className="w-full flex items-center gap-2 my-2">
                    <hr className="flex-1 md:w-full border-gray-500"/>
                    <span className="w-fit text-center text-sm">Or continue with</span>
                    <hr className="flex-1 md:w-full border-gray-500"/>
                </div>
                    

                <div className="flex justify-evenly md:justify-between w-full my-3">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer border border-gray-500 py-3 w-[45%] justify-center rounded-xl text-xs md:text-sm font-bold px-3"><FaGoogle/>Google</Link>
                    <Link href="/" className="flex items-center gap-2 cursor-pointer border border-gray-500 py-3 w-[45%] justify-center rounded-xl text-xs md:text-sm font-bold px-3"><FaFacebook/>Facebook</Link>
                </div>

                <p className="text-sm">
                    Already have an account? <Link href='/log-in' className="font-semibold text-[#FE5D00]">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
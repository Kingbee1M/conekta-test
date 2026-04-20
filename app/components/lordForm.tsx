'use client'
import Link from "next/link";
import { MdOutlinePersonOutline } from "react-icons/md";
import { CiMail } from "react-icons/ci";
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
    name: string;
    setName: (val: string) => void;
    onSubmit: () => void;
    role?: string | null;
    setThemeColor: (color: string) => void;
}

export default function TenantForm({ 
    name, setName, email, setEmail, password, setPassword, onSubmit, 
    setThemeColor
    }: AuthFormProps) {

    useEffect(() => {
        setThemeColor('#2171FF');
    }, [setThemeColor]);
    return (
        <div className="w-full max-w-md rounded-2xl bg-gray-400 p-1 shadow-sm relative group overflow-clip">
            
            <div className="absolute inset-x-0 -bottom-full h-full bg-[#2171FF] z-10 
            transition-all duration-700 ease-in-out 
            group-hover:bottom-0"/>


        <div className="w-full h-full bg-white rounded-[calc(1rem-2px)] flex flex-col justify-center items-center gap-2 py-8 px-6 relative z-20">
            <Image src={logo} width={100} height={100} alt="logo" />
            <h2 className="text-3xl font-bold text-[#2171FF]">Create Account</h2>
            <p className="text-gray-500 text-sm">Sign up as Property Owner</p>
            <Link href='/get-started' className="text-[#2171FF] text-sm hover:underline">Change role</Link>
            
            <div className="outerDiv">
                <label htmlFor="full_name">Full Name</label>
                <div className="inputDiv">
                    <MdOutlinePersonOutline/>
                    <input className="inputTag" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                
            </div>
            
            <div className="outerDiv">
                <label htmlFor="">Email Address</label>
                <div className="inputDiv">
                    <CiMail/>
                    <input className="inputTag" placeholder="You@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                
            </div>

            <div className="outerDiv">
                <label htmlFor="">Phone number</label>
                <div className="inputDiv">
                    <FiPhone/>
                    <input className="inputTag" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                
            </div>

            <div className="outerDiv">
                <label htmlFor="">Password</label>
                <div className="inputDiv">
                    <input className="inputTag" type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button>

                    </button>
                </div>
                
            </div>

            <div className="outerDiv">
                <label htmlFor="">Confirm Password</label>
                <div className="inputDiv">
                    <input className="inputTag" placeholder="Confirm your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button>

                    </button>
                </div>
                
            </div>

            
            <div className="w-full flex gap-3 items-center text-sm font-semibold my-3">
                <Checkbox/>
                <p>I agree to the <span className="text-[#2171FF]">Terms of Service</span> and <span className="text-[#2171FF]">Privacy Policy</span></p>
            </div>
            

            <button onClick={onSubmit} className="w-full bg-[#2171FF] text-white p-3 rounded-lg font-semibold hover:bg-[white] hover:text-[#2171FF] hover:border-[0.5px] hover:border-[#2171FF] transition-colors cursor-pointer">
                Create Account
            </button>

            <div className="w-full flex items-center gap-2">
                    <hr className="w-full border-gray-500"/>
                    <span className="w-full text-center text-sm">Or continue with</span>
                    <hr className="w-full border-gray-500"/>
            </div>
                

                <div className="flex justify-between w-full my-5">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer border border-gray-500 py-3 px-7"><FaGoogle/> Sign Google</Link>
                    <Link href="/" className="flex items-center gap-2 cursor-pointer border border-gray-500 py-3 px-7"><FaFacebook/> Sign Facebook</Link>
                </div>

                <p className="text-sm">
                    Already have an account? <span className="font-semibold text-[#2171FF]">Sign in</span>
                </p>

            </div>
        </div>
    );
}
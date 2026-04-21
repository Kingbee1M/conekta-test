'use client'
import { useState } from "react"
import { loginUser } from "@/shared/features/auth/auth.action"
import { useAppDispatch } from "@/lib/hooks"
import { loginTypes } from "@/types"
import { useRouter } from "next/navigation"
import { useToast } from "../components/ui/ToastProvider"
import Image from "next/image"
import logo from '../../public/svg/logo-enhanced.svg'
import { CiMail, CiLock} from "react-icons/ci";
import Link from "next/link"
import { FaGoogle, FaFacebook } from "react-icons/fa";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// await delay(5000);
export default function Login() {
    
    const [email, setEmail] = useState("")
    const [password, setPassword]= useState("")

    const dispatch = useAppDispatch();
    const router = useRouter()
    const { addToast } = useToast();

    
    const handleSubmit = async () => {
        
        console.log('burron Pressed')
        const formData: loginTypes = { email, password };
        const result = await dispatch(loginUser(formData));
        console.log(result)
        
        if (result.success) {
            addToast({
                title: "Login Failed",
                description: "Logging in",
                variant: "success",
                duration: 5000
            });
            
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000)
        }
        else {
        addToast({
            title: "Login Failed",
            description: result.message || "Invalid credentials",
            variant: "error",
            duration: 5000
        });
        }
    };
    
    return (
        <section className="flex flex-col justify-center min-h-screen items-center gap-7 bg-linear-to-br from-[#EDFDF5] via-[#EDFDF5] h-screen  to-white">

            <form 
            onSubmit={handleSubmit}
            className="py-5 px-7 w-full min-h-[50vh] overflow-y-auto max-w-90 items-center border-gray-300 rounded-lg border-2 border-solid bg-white flex flex-col gap-1">
                
                <Image src={logo} width={100} height={100} alt="logo" className="w-30" />

                <h1>Welcome Back</h1>

                <p className="mb-5">Sign in to your Conekta account</p>

                
                <div className="outerDiv mb-4">
                    <label className="text-xs" htmlFor="email">Email</label>
                    <div className="inputDiv">
                        <CiMail/>
                        <input type="text" id="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="textInput" />
                    </div>
                </div>

                <div className="outerDiv mb-4">
                    <label className="text-xs" htmlFor="password">Password</label>
                    <div className="inputDiv">
                        <CiLock/>
                        <input type="text" id="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                </div>
                
                
                <button 
                type="submit"
                className="w-full my-3 bg-[#00AC72] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[white] hover:text-[#008f5d] border-[0.5px] hover:border-[#008f5d] transition-colors cursor-pointer">
                    Sign in
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
            </form>
            
        </section>
    )
}
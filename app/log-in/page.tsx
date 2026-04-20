'use client'
import { useState } from "react"
import { loginUser } from "@/shared/features/auth/auth.action"
import { useAppDispatch } from "@/lib/hooks"
import { loginTypes } from "@/types"
import { useRouter } from "next/navigation"
import { useToast } from "../components/ui/ToastProvider"
import Image from "next/image"
import logo from '../../public/svg/logo-enhanced.svg'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
await delay(5000);
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
        <section className="flex flex-col justify-center items-center gap-7 bg-linear-to-br from-[#EDFDF5] via-[#EDFDF5] h-screen  to-white">

            <form className="p-5 w-full max-w-120 items-center border-gray-300 rounded-lg border-2 border-solid bg-white flex flex-col gap-4">
                
                <Image src={logo} width={100} height={100} alt="logo" className="w-30" />

                <h1>Welcome Back</h1>

                <p>Sign in to your Conekta account</p>

                

                <div className="outerDiv">
                    <label>Email</label>
                    <div className="inputDiv">
                        <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="textInput" />
                    </div>
                </div>

                <div className="outerDiv">
                    <label>Password</label>
                    <div className="inputDiv">
                        <input type="text" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                </div>
                
                
                <button 
                    className="bg-blue-500 p-2 text-white" 
                    onClick={()=>handleSubmit()}
                >
                    Submit
                </button>
            </form>
            
        </section>
    )
}
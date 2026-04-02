'use client'
import { useState } from "react"
import { loginUser } from "@/shared/features/auth/auth.action"
import { useAppDispatch } from "@/lib/hooks"
import { loginTypes } from "@/types"
import { useRouter } from "next/navigation"
import { useToast } from "../components/ui/ToastProvider"

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
        <div className="flex flex-col items-center gap-7">
            login

            <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="text" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button 
                className="bg-blue-500 p-2 text-white" 
                onClick={()=>handleSubmit()}
            >
                Submit
            </button>
        </div>
    )
}
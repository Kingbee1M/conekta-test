'use client'
import { useState } from "react"
import { signupUser } from "@/shared/features/auth/auth.action"
import { useAppDispatch } from "@/lib/hooks"
import { signupTypes } from "@/types"

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState('');
    
    const dispatch = useAppDispatch();

    const handleFormSubmit = async () => {
        const userData: signupTypes = {
            name: name,
            email: email,
            password: password
        };

        const result = await dispatch(signupUser(userData));
        
        if (result.success) {
            window.location.href = '/dashboard';
        } else {
            console.log(result);
            //setError(result.error);
        }
    };

    return (
        <div className="flex flex-col items-center gap-7">
            <h1>Sign Up</h1>

            {error && <p className="text-red-500">{error}</p>}

            {/* Use 'e.target.value' to capture what the user types */}
            <input 
                type="text" 
                placeholder="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
            <input 
                type="email" 
                placeholder="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            
            {/* Call the function directly on click */}
            <button 
                className="bg-blue-500 p-2 text-white" 
                onClick={handleFormSubmit}
            >
                Submit
            </button>
        </div>
    )
}
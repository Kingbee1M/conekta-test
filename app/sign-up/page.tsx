'use client'
import { useState } from "react"
import { signupUser } from "@/shared/features/auth/auth.action"
import { useAppDispatch } from "@/lib/hooks"
import { signupTypes } from "@/types"
import { useSearchParams } from "next/navigation"
import TenantForm from "../components/ternantForm"
import LordForm from "../components/lordForm"
import ArtisanForm from "../components/artisanForm"
import InvestorForm from "../components/investorForm"

interface AuthFormProps {
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    name: string;
    setName: (val: string) => void;
    onSubmit: () => void;
    role?: string | null;
}

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState('');

    const searchParams = useSearchParams();
    const role = searchParams.get('role');
    
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

    const renderForm = () => {
    switch (role) {
        case 'lord':
        return <LordForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} name={name} setName={setName} onSubmit={handleFormSubmit} />;
        case 'artisan':
        return <ArtisanForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} name={name} setName={setName} onSubmit={handleFormSubmit} />;
        case 'inestor':
        return <InvestorForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} name={name} setName={setName} onSubmit={handleFormSubmit} />;
        default:
        return <TenantForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} name={name} setName={setName} onSubmit={handleFormSubmit} />;
    }
}

    return (
        <section className="min-h-screen flex items-center justify-center">
            {renderForm()}
        </section>
    )
}
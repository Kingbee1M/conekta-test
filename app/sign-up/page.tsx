'use client'
import { useState, useEffect } from "react"
import { signupUser } from "@/shared/features/auth/auth.action"
import { useAppDispatch } from "@/lib/hooks"
import { signupTypes } from "@/types"
import { useSearchParams } from "next/navigation"
import TenantForm from "../components/ternantForm"
import LordForm from "../components/lordForm"
import ArtisanForm from "../components/artisanForm"
import InvestorForm from "../components/investorForm"
import { motion, useMotionValue, useSpring } from "framer-motion"

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

    //mouse tracking
    // 1. Setup Motion Values for X and Y
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 2. Smooth out the movement with a Spring
    const springConfig = { damping: 25, stiffness: 150 };
    const shadowX = useSpring(mouseX, springConfig);
    const shadowY = useSpring(mouseY, springConfig);

    // 3. Update mouse coordinates on move
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // mouse tracking ends

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
        case 'landlord':
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
        <section className="min-h-screen h-full flex items-center justify-center bg-linear-to-br from-[#ECFDF5] to-white">
            {/* 4. THE MOUSE TRACKING BACKGROUND BLOBS */}
            <motion.div 
                className="pointer-events-none absolute z-0 opacity-50"
                style={{
                    x: shadowX,
                    y: shadowY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            >
                {/* Large Green Glow */}
                <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-r from-[#00AC72] to-[#2476FF] blur-[120px]" />
            </motion.div>

            {/* Subtle Grid Pattern (Optional, but looks pro with mouse tracking) */}
            <div className="absolute inset-0 z-0 opacity-[0.03] [background-image:linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:40px_40px]" />

            {/* 5. THE FORM (Needs z-10 to stay above the blobs) */}
            <div className="z-10 w-full flex justify-center">
                {renderForm()}
            </div>
            
        </section>
    )
}
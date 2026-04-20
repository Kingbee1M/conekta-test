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


export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [themeColor, setThemeColor] = useState("#00AC72");

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
            console.log('hey')
        } else {
            console.log(result);
            //setError(result.error);
        }
    };

    const renderForm = () => {
    // 1. This object contains everything the children need
    const auth = {
        email, setEmail, password, setPassword, name, setName, 
        onSubmit: handleFormSubmit,
        setThemeColor // The "Shooter"
    };

    switch (role) {
        case 'landlord':
            return <LordForm {...auth} />; // Use the spread operator (...)
        case 'artisan':
            return <ArtisanForm {...auth} />;
        case 'investor': // Fixed typo "inestor"
            return <InvestorForm {...auth} />;
        default:
            return <TenantForm {...auth} />; // Pass 'auth', not 'AuthFormProps'
    }
}

    return (
        <section className="min-h-screen h-full flex items-center justify-center bg-white py-10">
            
            <motion.div 
    className="pointer-events-none absolute z-0 opacity-50"
    style={{
        x: shadowX,
        y: shadowY,
        translateX: "-50%",
        translateY: "-50%",
    }}
>
    <div 
        className="h-125 w-125 rounded-full blur-[120px] transition-colors duration-700" 
        style={{ backgroundColor: themeColor }} // Use the state here!
    />
</motion.div>



            
            <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]" />

            
            <div className="z-10 w-full flex justify-center">
                {renderForm()}
            </div>
            
        </section>
    )
}
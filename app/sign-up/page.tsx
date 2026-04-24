'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from "react"
import { signupUser } from "@/shared/features/auth/auth.action"
import { useAppDispatch } from "@/lib/hooks"
import { signupTypes } from "@/types"
import { useSearchParams } from "next/navigation"
import TenantForm from "../components/ternantForm"
import LordForm from "../components/lordForm"
import ArtisanForm from "../components/artisanForm"
import InvestorForm from "../components/investorForm"
import {motion, useAnimation, useMotionValue, useSpring, PanInfo} from "framer-motion"
import { IoChatbubble } from "react-icons/io5";
import { useRouter } from 'next/router'

export default function SignUp() {
    const HelpPortal = dynamic(() => import('../components/ui/helpPortal'), { 
    ssr: false 
})

    const router = useRouter()
    const helpButtonControls = useAnimation();

    // We type the 'info' parameter as PanInfo, and 'event' as PointerEvent | MouseEvent | TouchEvent
    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent, 
        info: PanInfo
    ) => {
        const screenWidth = window.innerWidth;
        
        // 'info.point.x' is the absolute position on the screen
        const finalX = info.point.x;

        if (finalX < screenWidth / 2) {
            // Snap to the left
            // We calculate the distance to move left based on screen width
            helpButtonControls.start({ 
                x: -(screenWidth - 80), 
                transition: { type: "spring", stiffness: 250, damping: 25 } 
            });
        } else {
            // Snap back to the original right-5 position
            helpButtonControls.start({ 
                x: 0, 
                transition: { type: "spring", stiffness: 250, damping: 25 } 
            });
        }
    };

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [themeColor, setThemeColor] = useState("#00AC72");
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
    // 1. Prevent duplicate submissions
    if (isLoading) return;
    
    setIsLoading(true);

    const userData: signupTypes = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        role: role || 'lister' // Ensure this matches the API "lister" requirement
    };

    // 2. Await the action result
    const result = await dispatch(signupUser(userData));
    
    setIsLoading(false);

    if (result.success) {
        // 3. Handle Success
        // Assuming you have a toast library or just using alert for now
        alert('Registration successful! Please check your email to verify your account.');
        
        // Redirect to the login or a "check your email" page
        router.push('/log-in'); 
    } else {
        // 4. Handle Error
        // This 'result.error' is the message we caught in the action's catch block
        // alert(result.error || 'Something went wrong. Please try again.');
        // console.error('Signup failed:', result.error);
    }
};

    const renderForm = () => {
    // 1. This object contains everything the children need
    const auth = {
        email, setEmail, password, setPassword, name, setName, phone, setPhone, confirmPassword, setConfirmPassword,
        onSubmit: handleFormSubmit,
        setThemeColor // The "Shooter"
    };

    switch (role) {
        case 'landlord':
            return <LordForm {...auth} />; 
        case 'artisan':
            return <ArtisanForm {...auth} />;
        case 'investor':
            return <InvestorForm {...auth} />;
        default:
            return <TenantForm {...auth} />;
    }
}

    return (
    <section className="min-h-screen h-full flex items-center justify-center bg-white py-10">
        
        {/* 1. DYNAMIC MOUSE-TRACKING BLOB */}
        {/* This is the large colorful circle that follows your cursor. 
            It uses the 'themeColor' state to change colors based on the active form. */}
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
                className="h-125 w-125 rounded-full blur-[120px] transition-colors duration-700 hidden md:flex" 
                style={{ backgroundColor: themeColor }}
            />
        </motion.div>

        {/* 2. BACKGROUND GRID PATTERN */}
        {/* This creates that subtle "blueprint" or "graph paper" look. 
            The opacity is very low (0.03) so it doesn't distract from the form. */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]" />

        {/* 3. THE FORM CONTAINER */}
        {/* This renders the specific form (Tenant, Lord, Artisan, etc.) 
            based on the 'role' parameter in your URL. */}
        <div className="z-10 w-full flex justify-center">
            {renderForm()}
        </div>

        {/* 4. HELP PORTAL MODAL */}
        {/* This is the dimmed overlay that appears when 'isHelpOpen' is true. */}
        <HelpPortal 
            isOpen={isHelpOpen} 
            onClose={() => setIsHelpOpen(false)} 
            themeColor={themeColor} 
        />

        {/* 5. FLOATING HELP TRIGGER BUTTON */}
        {/* The chat bubble icon at the bottom right. 
            The color and border will match the current theme color. */}
        <motion.button 
            drag // Allows movement in all directions
            // Keep the constraints so they don't drag it behind the header or off the bottom
            dragConstraints={{ left: -(window.innerWidth - 80), right: 0, top: -600, bottom: 0 }}
            animate={helpButtonControls}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-15 right-5 w-fit cursor-pointer z-30 touch-none" 
            onClick={() => setIsHelpOpen(!isHelpOpen)}
        >
            <IoChatbubble className="text-6xl md:text-7xl" style={{color: themeColor}}/>
            <span className="absolute top-4 md:top-5 right-1 text-[10px] md:text-xs text-white font-bold select-none">
                Need help?
            </span>
        </motion.button>
        
    </section>
)
}
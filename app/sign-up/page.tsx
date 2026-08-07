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
import {motion, useAnimation, useMotionValue, useSpring, PanInfo} from "framer-motion"
import { IoChatbubble } from "react-icons/io5";
import { useRouter } from 'next/navigation'
import { useFormik } from "formik"
import { z } from "zod"
import { useToast } from '../components/ui/ToastProvider'
import { RoleEnum } from '@/shared/enums/roles.enum'

export default function SignUp() {
    const HelpPortal = dynamic(() => import('../components/ui/helpPortal'), { 
        ssr: false 
    })

    const router = useRouter()
    const helpButtonControls = useAnimation();

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent, 
        info: PanInfo
    ) => {
        const screenWidth = window.innerWidth;
        const finalX = info.point.x;

        if (finalX < screenWidth / 2) {
            helpButtonControls.start({ 
                x: -(screenWidth - 80), 
                transition: { type: "spring", stiffness: 250, damping: 25 } 
            });
        } else {
            helpButtonControls.start({ 
                x: 0, 
                transition: { type: "spring", stiffness: 250, damping: 25 } 
            });
        }
    };

    const [themeColor, setThemeColor] = useState("#00AC72");
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const searchParams = useSearchParams();
    
    // Parse the query parameter string cleanly into a valid RoleEnum or fallback
    const rawRoleParam = searchParams.get('role');
    const role: RoleEnum = Object.values(RoleEnum).includes(rawRoleParam as RoleEnum)
        ? (rawRoleParam as RoleEnum)
        : RoleEnum.LISTER; // Default fallback matches formik context definition
    
    const dispatch = useAppDispatch();
    const { addToast } = useToast()

    // Mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const shadowX = useSpring(mouseX, springConfig);
    const shadowY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Helper to split "First Last" into { first_name, last_name }
    const splitFullName = (fullName: string) => {
        const parts = fullName.trim().split(/\s+/);
        return {
            first_name: parts[0] || "",
            last_name: parts.slice(1).join(" ") || ""
        };
    };

    // Zod Schema
    const signupSchema = z.object({
        name: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email format"),
        phone: z.string().min(10, "Invalid phone number"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
        role: z.nativeEnum(RoleEnum)
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: role
        },
        validate: (values) => {
            const result = signupSchema.safeParse(values);
            if (result.success) return {};
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
            });
            return errors;
        },
        onSubmit: async (values) => {
            const { first_name, last_name } = splitFullName(values.name);
            
            const payload = {
                first_name,
                last_name,
                email: values.email,
                phone_number: values.phone,
                password: values.password,
                role: values.role
            };

            const result = await dispatch(signupUser(payload as signupTypes));
            
            if (result.success) {
                addToast({ 
                    title: "Success!", 
                    description: "Account created successfully.", 
                    variant: "success" 
                });
                router.push('/log-in'); 
            } else {
                addToast({ 
                    title: "Signup Failed", 
                    description: result.message || "Something went wrong.", 
                    variant: "error" 
                });
            }
        }
    });

    // Automatically update Formik's internal role tracking if URL search params change
    useEffect(() => {
        formik.setFieldValue('role', role);
    }, [role]);

    const authProps = {
        name: formik.values.name,
        email: formik.values.email,
        phone: formik.values.phone,
        password: formik.values.password,
        confirmPassword: formik.values.confirmPassword,
        
        setName: (val: string) => formik.setFieldValue('name', val),
        setEmail: (val: string) => formik.setFieldValue('email', val),
        setPhone: (val: string) => formik.setFieldValue('phone', val),
        setPassword: (val: string) => formik.setFieldValue('password', val),
        setConfirmPassword: (val: string) => formik.setFieldValue('confirmPassword', val),
        
        errors: formik.errors,
        touched: formik.touched,
        
        onSubmit: formik.handleSubmit,
        isLoading: formik.isSubmitting,
        setThemeColor,
        setFieldTouched: formik.setFieldTouched,
    };

    const renderForm = () => {
        switch (role) {
            case RoleEnum.LISTER:
                return <LordForm {...authProps} />; 
            case RoleEnum.ARTISAN:
                return <ArtisanForm {...authProps} />;
            case RoleEnum.CUSTOMER:
            default:
                return <TenantForm {...authProps} />;
        }
    }

    return (
        <section className="min-h-screen h-full flex items-center justify-center bg-white py-10">
            
            {/* 1. DYNAMIC MOUSE-TRACKING BLOB */}
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
            <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]" />

            {/* 3. THE FORM CONTAINER */}
            <div className="z-10 w-full flex justify-center">
                {renderForm()}
            </div>

            {/* 4. HELP PORTAL MODAL */}
            <HelpPortal 
                isOpen={isHelpOpen} 
                onClose={() => setIsHelpOpen(false)} 
                themeColor={themeColor} 
            />

            {/* 5. FLOATING HELP TRIGGER BUTTON */}
            <motion.button 
                drag
                dragConstraints={{ left: -(window.innerWidth - 80), right: 0, top: -600, bottom: 0 }}
                animate={helpButtonControls}
                onDragEnd={handleDragEnd}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-15 right-5 w-fit cursor-pointer z-30 touch-none" 
                onClick={() => setIsHelpOpen(!isHelpOpen)}
            >
                <IoChatbubble className="text-6xl md:text-7xl" style={{color: themeColor}}/>
                <span className="absolute top-5 md:top-7 right-1 md:right-2 text-[9px] md:text-[10px] text-white font-bold select-none">
                    Need help?
                </span>
            </motion.button>
            
        </section>
    )
}
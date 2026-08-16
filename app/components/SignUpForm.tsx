'use client'

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { signupUser } from "@/shared/features/auth/auth.action"
import { useAppDispatch } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { useFormik } from "formik"
import { z } from "zod"
import { useToast } from "../components/ui/ToastProvider"
import { motion, useAnimation, useMotionValue, useSpring, PanInfo } from "framer-motion"
import { IoChatbubble } from "react-icons/io5"
import { MdOutlinePersonOutline, MdOutlineLocationOn, MdOutlineMap } from "react-icons/md"
import { CiMail, CiLock } from "react-icons/ci"
import { FiPhone, FiEyeOff, FiEye } from "react-icons/fi"
import { FaGoogle, FaFacebook } from "react-icons/fa"
import { Checkbox } from "@/components/ui/checkbox"
import logo from "../../public/svg/logo-enhanced.svg"
import Image from "next/image"
import Link from "next/link"
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from "@/shared/enums/nigeriaRegions.enums"
import CustomSelect from "./ui/CustomSelect"
import { signupTypes } from "@/types"

const HelpPortal = dynamic(() => import("../components/ui/helpPortal"), { ssr: false })

const signupSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export default function SignUpForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  // Floating Help Button Drag Controller
  const helpButtonControls = useAnimation()
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const screenWidth = window.innerWidth
    if (info.point.x < screenWidth / 2) {
      helpButtonControls.start({ x: -(screenWidth - 80), transition: { type: "spring", stiffness: 250, damping: 25 } })
    } else {
      helpButtonControls.start({ x: 0, transition: { type: "spring", stiffness: 250, damping: 25 } })
    }
  }

  // Mouse Glow Tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 150 }
  const shadowX = useSpring(mouseX, springConfig)
  const shadowY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const splitFullName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    return {
      first_name: parts[0] || "",
      last_name: parts.slice(1).join(" ") || "",
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      state: "",
      lga: "",
    },
    validate: (values) => {
      const result = signupSchema.safeParse(values)
      if (result.success) return {}
      const errors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) errors[issue.path[0] as string] = issue.message
      })
      return errors
    },
    onSubmit: async (values) => {
      const { first_name, last_name } = splitFullName(values.name)

      const payload = {
        first_name,
        last_name,
        email: values.email,
        phone_number: values.phone,
        password: values.password,
        address: values.address,
        state: values.state,
        lga: values.lga,
      }

      const result = await dispatch(signupUser(payload as signupTypes))

      if (result.success) {
        addToast({ title: "Success!", description: "Account created successfully.", variant: "success" })
        router.push("/log-in")
      } else {
        addToast({ title: "Signup Failed", description: result.message || "Something went wrong.", variant: "error" })
      }
    },
  })

  // State Options Array
  const stateOptions = Object.values(NigeriaStateEnum)

  // Dynamic LGA Options based on Selected State
  const lgaOptions = formik.values.state
    ? NIGERIA_LGA_MAP[formik.values.state as NigeriaStateEnum] || []
    : []

  const handleStateChange = (selectedState: string) => {
    formik.setFieldValue("state", selectedState)
    formik.setFieldValue("lga", "") // Reset LGA when State changes
    formik.setFieldTouched("state", true, false)
  }

  const handleLgaChange = (selectedLga: string) => {
    formik.setFieldValue("lga", selectedLga)
    formik.setFieldTouched("lga", true, false)
  }

  return (
    <>
      {/* Interactive Mouse Blob */}
      <motion.div
        className="pointer-events-none absolute z-0 opacity-40 hidden md:block"
        style={{
          x: shadowX,
          y: shadowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="h-112 w-md rounded-full bg-primary-green blur-[120px]" />
      </motion.div>

      {/* Main Form Container */}
      <div className="z-10 w-full max-w-lg px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit()
          }}
          className="w-full rounded-2xl bg-gray-100 p-1 shadow-xl relative group overflow-hidden"
        >
          <div className="absolute inset-x-0 -bottom-full h-full bg-primary-green z-10 transition-all duration-700 ease-in-out group-hover:bottom-0" />

          <div className="w-full h-full bg-white rounded-[calc(1rem-2px)] flex flex-col justify-center items-center gap-4 py-8 px-6 sm:px-8 relative z-20">
            <Image src={logo} width={110} height={110} alt="Conekta Logo" priority />
            
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-extrabold text-primary-green tracking-tight">Create Account</h2>
              <p className="text-gray-500 text-sm font-medium">Join us to start exploring properties</p>
            </div>

            {/* Full Name */}
            <div className="outerDiv w-full">
              <label htmlFor="full_name">Full Name</label>
              <div className={`inputDiv ${formik.errors.name && formik.touched.name ? "border-red-500" : ""}`}>
                <MdOutlinePersonOutline />
                <input
                  className="inputTag"
                  id="full_name"
                  placeholder="John Doe"
                  {...formik.getFieldProps("name")}
                />
              </div>
              {formik.errors.name && formik.touched.name && (
                <p className="text-red-500 text-[10px] mt-1">{formik.errors.name}</p>
              )}
            </div>

            {/* Email & Phone Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="outerDiv w-full">
                <label htmlFor="email">Email Address</label>
                <div className={`inputDiv ${formik.errors.email && formik.touched.email ? "border-red-500" : ""}`}>
                  <CiMail />
                  <input
                    className="inputTag"
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...formik.getFieldProps("email")}
                  />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <p className="text-red-500 text-[10px] mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div className="outerDiv w-full">
                <label htmlFor="phone">Phone Number</label>
                <div className={`inputDiv ${formik.errors.phone && formik.touched.phone ? "border-red-500" : ""}`}>
                  <FiPhone />
                  <input
                    className="inputTag"
                    id="phone"
                    placeholder="+234 800 000 0000"
                    {...formik.getFieldProps("phone")}
                  />
                </div>
                {formik.errors.phone && formik.touched.phone && (
                  <p className="text-red-500 text-[10px] mt-1">{formik.errors.phone}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="outerDiv w-full">
              <label htmlFor="address">Street Address</label>
              <div className={`inputDiv ${formik.errors.address && formik.touched.address ? "border-red-500" : ""}`}>
                <MdOutlineLocationOn />
                <input
                  className="inputTag"
                  id="address"
                  placeholder="123 Commercial Avenue"
                  {...formik.getFieldProps("address")}
                />
              </div>
              {formik.errors.address && formik.touched.address && (
                <p className="text-red-500 text-[10px] mt-1">{formik.errors.address}</p>
              )}
            </div>

            {/* State & LGA Custom Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {/* State Select */}
              <div className="outerDiv w-full">
                <label htmlFor="state">State</label>
                <div className={`inputDiv ${formik.errors.state && formik.touched.state ? "border-red-500" : ""}`}>
                  <MdOutlineMap className="shrink-0" />
                  <CustomSelect
                    options={stateOptions}
                    selected={formik.values.state}
                    onChange={handleStateChange}
                    defaultValue="Select State"
                    variant="flat"
                  />
                </div>
                {formik.errors.state && formik.touched.state && (
                  <p className="text-red-500 text-[10px] mt-1">{formik.errors.state}</p>
                )}
              </div>

              {/* LGA Select */}
              <div className="outerDiv w-full">
                <label htmlFor="lga">LGA</label>
                <div className={`inputDiv ${formik.errors.lga && formik.touched.lga ? "border-red-500" : ""}`}>
                  <MdOutlineMap className="shrink-0" />
                  <CustomSelect
                    options={lgaOptions}
                    selected={formik.values.lga}
                    onChange={handleLgaChange}
                    defaultValue={formik.values.state ? "Select LGA" : "Select State first"}
                    variant="flat"
                  />
                </div>
                {formik.errors.lga && formik.touched.lga && (
                  <p className="text-red-500 text-[10px] mt-1">{formik.errors.lga}</p>
                )}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="outerDiv w-full">
                <label htmlFor="password">Password</label>
                <div className={`inputDiv ${formik.errors.password && formik.touched.password ? "border-red-500" : ""}`}>
                  <CiLock />
                  <input
                    className="inputTag"
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
                    {...formik.getFieldProps("password")}
                  />
                  <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
                {formik.errors.password && formik.touched.password && (
                  <p className="text-red-500 text-[10px] mt-1">{formik.errors.password}</p>
                )}
              </div>

              <div className="outerDiv w-full">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`inputDiv ${formik.errors.confirmPassword && formik.touched.confirmPassword ? "border-red-500" : ""}`}>
                  <CiLock />
                  <input
                    className="inputTag"
                    id="confirmPassword"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
                    {...formik.getFieldProps("confirmPassword")}
                  />
                  <button type="button" onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                    {isConfirmPasswordVisible ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
                {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                  <p className="text-red-500 text-[10px] mt-1">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="w-full flex gap-3 items-center text-xs sm:text-sm font-semibold my-1">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="cursor-pointer">
                I agree to the <span className="text-primary-green">Terms of Service</span> and{" "}
                <span className="text-primary-green">Privacy Policy</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-primary-green text-white p-3 rounded-lg font-semibold hover:bg-white hover:text-primary-green border border-primary-green transition-colors cursor-pointer flex justify-center items-center gap-2 shadow-sm mt-1"
            >
              {formik.isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Social Divider */}
            <div className="w-full flex items-center gap-2 my-1">
              <hr className="flex-1 border-gray-200" />
              <span className="text-center text-xs text-gray-500 font-medium">Or continue with</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Social Logins */}
            <div className="flex justify-between gap-3 w-full">
              <Link
                href="/"
                className="flex items-center gap-2 border border-gray-300 py-2.5 w-1/2 justify-center rounded-xl text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="text-red-500" /> Google
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 border border-gray-300 py-2.5 w-1/2 justify-center rounded-xl text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaFacebook className="text-blue-600" /> Facebook
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <Link href="/log-in" className="font-bold text-primary-green hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Floating Help Widgets */}
      <HelpPortal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} themeColor="var(--color-primary-green, #2a8545)" />

      <motion.button
        drag
        dragConstraints={{ left: -(typeof window !== "undefined" ? window.innerWidth - 80 : 300), right: 0, top: -600, bottom: 0 }}
        animate={helpButtonControls}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-12 right-5 w-fit cursor-pointer z-30 touch-none"
        onClick={() => setIsHelpOpen(!isHelpOpen)}
      >
        <IoChatbubble className="text-6xl md:text-7xl text-primary-green drop-shadow-md" />
        <span className="absolute top-5 md:top-7 right-1 md:right-2 text-[9px] md:text-[10px] text-white font-bold select-none">
          Need help?
        </span>
      </motion.button>
    </>
  )
}
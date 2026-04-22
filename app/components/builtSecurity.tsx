'use client'
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdOutlineShield } from "react-icons/md";
import { PiBuildingsBold } from "react-icons/pi";
import Image from "next/image";
import secure from '../../public/webp/trust.webp'
import { motion } from 'framer-motion'
import useOnceInView from "@/lib/hooks";

export default function BuiltSecurity() {
    const [isImageHovered, setIsImageHovered] = useState(false);
    const { ref, isInView } = useOnceInView();

    const feats = [
        { icon: <FaCheck />, title: 'Verified Listings', desc: 'All properties and artisans are thoroughly vetted and verified.' },
        { icon: <MdOutlineShield />, title: 'Secure Payments', desc: 'Bank-grade encryption for all transactions and personal data.' },
        { icon: <PiBuildingsBold />, title: 'Legal Compliance', desc: 'All documentation and processes follow Nigerian property laws.' },
    ]

    return (
        <section className="px-5 w-full flex flex-col my-16 gap-8 overflow-x-clip">

            <h2 className="text-2xl lg:text-left lg:text-3xl font-bold">Built on Trust & Security</h2>
                <p className="text-center w-full text-xs md:text-sm lg:text-left">We prioritize your safety with verified listings, secure payments, and transparent processes.</p>
           <div className="grid grid-cols-1 grid-rows-1 gap-y-10 lg:grid-cols-2 gap-5 mt-5 items-center w-full">
            <div className="flex flex-col items-center lg:items-start gap-7 w-full">
                {feats.map((feat, index) => (
                    <motion.div
                        key={feat.title}
                        className="flex items-center gap-3 bg-white p-4 rounded-md relative overflow-hidden cursor-pointer"
                        initial={{ y: 50, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{
                            y: -5,
                            scale: 1.01,
                            boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
                            transition: { type: "spring", stiffness: 400, damping: 17 }
                        }}
                    >
                        <p className="p-3 bg-[#D0FAE5] text-tertiary-green rounded-md text-base z-10">{feat.icon}</p>
                        <div className="z-10">
                            <h3 className="font-semibold text-base">{feat.title}</h3>
                            <p className="md:text-sm text-gray-600 text-xs">{feat.desc}</p>
                        </div>

                        {/* the Animated Bar */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-green-500"
                            initial={{ width: 0 }}
                            animate={isImageHovered ? { width: "100%" } : { width: 0 }}
                            transition={{ 
                                duration: 0.6, 
                                delay: index * 0.1,
                                ease: "easeInOut" 
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* the Image Container with Mouse Watchers */}
            <motion.div
                ref={ref}
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
                initial={{ opacity: 0, x: 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.8 }}
                className="w-full cursor-pointer"
            >
                <Image 
                    src={secure} 
                    alt="security" 
                    width={600} 
                    height={600} 
                    className="w-full rounded-2xl shadow-2xl shadow-black/20"
                />
            </motion.div>
            </div>
        </section>
    )
}
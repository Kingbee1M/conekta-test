'use client'

import Link from "next/link"
import { GoArrowRight } from "react-icons/go";
import { FiHome } from "react-icons/fi";
import { LuPiggyBank } from "react-icons/lu";
import { GrLineChart } from "react-icons/gr";
import { LuHammer } from "react-icons/lu";
import { motion } from "framer-motion";
import useOnceInView from "@/lib/hooks";

export default function EverythingYou() {
    const { ref, isInView } = useOnceInView();
    const needs = [
        {icon: <FiHome/> , color: '#D0FAE5', text: '#009966',title: 'Find Your Home', desc: 'Browse thousands of properties with advanced filters and virtual tours.', link: 'find-property', linkName: 'Explore Properties'},
        {icon: <LuPiggyBank/> , color: '#DBEAFE', text: '#155DFC',title: 'Flexible Payments', desc: 'Rent-to-own, rent now pay later, or pay in installments - you choose.', link: 'find-property', linkName: 'View Options'},
        {icon: <GrLineChart/> , color: '#F3E8FF', text: '#9810FA',title: 'Invest & Earn', desc: 'Start fractional real estate investing from as low as ₦500,000', link: 'find-property', linkName: 'Start Investing'},
        {icon: <LuHammer/> , color: '#FFEDD4', text: '#F54900',title: 'Trusted Artisans', desc: 'Connect with verified plumbers, electricians, and home service providers.', link: 'find-property', linkName: 'Find Artisans'},
    ]
    return (
        <section className="flex flex-col items-center w-full gap-6 px-5">
            <h2 className="text-xl lg:text-3xl text-center">Everything You Need in One Platform</h2>
            <p className="text-sm lg:text-base">From property discovery to management, we&apos;ve built a complete ecosystem for your housing needs.</p>

            <div className="grid grid-cols-2 grid-rows-2 w-full justify-between lg:grid-cols-[repeat(4,280px)] lg:grid-rows-1 gap-5 mt-10">
                {needs.map((need, index) => (
                    <motion.div
                    ref={ref}
                    key={index}
                    initial={{y: 50, opacity: 0}}
                    animate={isInView ? {y: 0, opacity: 1}: {}}
                    transition={{duration: 0.8, delay:1*index/2, ease: 'easeInOut'}}
                    className="relative overflow-clip group w-fit flex flex-col items-start justify-between gap-3 border-2 border-[#E5E5E5] hover:border-none rounded-lg px-4 py-3 lg:py-9 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
                        <div className="absolute left-0 -top-70 h-70 w-0 border-2 border-x-primary-green group-hover:translate-y-70 duration-200 group-hover:delay-0 ease-in-out delay-300" />
                        <div className="absolute bottom-0 -left-70 h-0 w-70 border-2 border-y-primary-green group-hover:translate-x-70 duration-200 ease-in-out group-hover:delay-100 delay-200" />
                        <div className="absolute right-0 -bottom-70 h-70 w-0 border-2 border-x-primary-green group-hover:-translate-y-70 duration-200 ease-in-out group-hover:delay-200 delay-100"  />
                        <div className="absolute top-0 -right-70 h-0 w-70 border-2 border-y-primary-green group-hover:-translate-x-70 duration-200 ease-in-out group-hover:delay-300 delay-0" />

                        <p className='p-3 text-2xl rounded-lg' style={{backgroundColor: need.color, color: need.text}}>{need.icon}</p>
                        <h3 className="">{need.title}</h3>
                        <p className="w-full text-[10px] lg:text-sm text-gray-600">{need.desc}</p>
                        <Link href={need.link} className="text-[10px] lg:text-base flex gap-2 items-center text-primary-green hover:text-primary-green-hover hover:underline">{need.linkName} <GoArrowRight/></Link>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
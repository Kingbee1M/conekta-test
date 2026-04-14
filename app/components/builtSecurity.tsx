'use client'
import { FaCheck } from "react-icons/fa";
import { MdOutlineShield } from "react-icons/md";
import { PiBuildingsBold } from "react-icons/pi";
import Image from "next/image";
import secure from '../../public/webp/trust.webp'
import { motion} from 'framer-motion'
import useOnceInView from "@/lib/hooks";

export default  function BuiltSecurity() {
    const feats = [
            {icon: <FaCheck/>,title: 'Verified Listings', desc: 'All properties and artisans are thoroughly vetted and verified.'},
            {icon: <MdOutlineShield/>,title: 'Secure Payments', desc: 'Bank-grade encryption for all transactions and personal data.'},
            {icon: <PiBuildingsBold/>,title: 'Legal Compliance', desc: 'All documentation and processes follow Nigerian property laws.'},
    ]

    const {ref, isInView} = useOnceInView();
    return (
        <section className="px-5 grid grid-cols-1 grid-rows-1 gap-y-10 lg:grid-cols-2 gap-5 mt-12 items-center w-full">
            <div className="flex flex-col items-center lg:items-start gap-7 w-full">
                <h2 className=" text-2xl lg:text-left lg:text-4xl">Built on Trust & Security</h2>
                <p className=" text-center w-full lg:text-left ">We prioritize your safety with verified listings, secure payments, and transparent processes.</p>

                {feats.map((feat) => (
                <div key={feat.title} className="flex items-center gap-3">
                    <p className="p-3 bg-[#D0FAE5] text-tertiary-green rounded-md text-xl">{feat.icon}</p>
                    <div>
                        <h3 className="font-semibold">{feat.title}</h3>
                        <p>{feat.desc}</p>
                    </div>
                </div>
            ))} 
            </div>
            
            <motion.div 
            ref={ref}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            initial={{opacity: 0, x: 100}}
            animate={isInView ? {opacity: 1, x: 0} : {}}
            transition={{duration: 1, ease: 'easeInOut', delay: 0}}
            className="w-full">
                <Image src={secure} alt="security" width={400} height={400} className="w-full lg:w-full rounded-xl shadow-md  shadow-[#282828]"/>
            </motion.div>
        </section>
    )
}
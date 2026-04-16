'use client'
import { FiHome } from "react-icons/fi";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { GrLineChart } from "react-icons/gr";
import { LuHammer } from "react-icons/lu";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
import { useState } from "react";
import { StaticImageData } from "next/image";
import tenantImg from '../../public/webp/ternant.webp'
import landlordImg from '../../public/webp/landlord.webp'
import investorImg from '../../public/webp/investor.webp'
import artisanImg from '../../public/webp/artisan.webp'

export default function GetStarted () {
    const [activeBg, setActiveBg] = useState<StaticImageData | null>(null);

    const options = [
        {icon: <FiHome/>, title: 'Renter / Buyer', desc: 'Find your perfect home with flexible payment options', points: ['Browse Properties', 'Virtual Tours', 'Flexible Payments', 'Property Management',], link: '/sign-up', role: 'ternant', image: tenantImg},
        {icon:  <TbBuildingSkyscraper/>, title: 'Property Owner / Developer', desc: 'List and manage your properties efficiently', points: ['List Properties','Tenant Management','Analytics Dashboard','Secure Payments',], link: '/sign-up', role: 'landlord', image: landlordImg},
        {icon:  <GrLineChart/>, title: 'Fractional Investor', desc: 'Start investing in real estate from ₦500,000', points: ['Browse Investments', 'Portfolio Tracking', 'Monthly Returns', 'Low Entry Cost',], link: '/sign-up', role: 'investor', image: investorImg},
        {icon:  <LuHammer/>, title: 'Artisan / Service Provider', desc: 'Connect with property owners and renters', points: ['Get Job Requests', 'Build Portfolio', 'Secure Payments', 'Customer Reviews',], link: '/sign-up', role: 'artisan', image: artisanImg},
    ]
    return (
        <section className="relative w-full min-h-screen py-20 flex justify-center items-center overflow-hidden bg-[#ECFDF5]">
            
           {/* 2. STATIC GRADIENT (The Default) */}
            <div className="absolute inset-0 bg-linear-to-br from-[#ECFDF5] to-white z-0" />

            {/* 3. DYNAMIC IMAGE LAYER */}
            {options.map((opt) => (
                <div 
                    key={`bg-${opt.role}`}
                    className="absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out bg-cover bg-center"
                    style={{ 
                        backgroundImage: `url(${opt.image.src})`,
                        opacity: activeBg?.src === opt.image.src ? 1 : 0 
                    }}
                />
            ))}

            {/* 4. SHADING OVERLAY (Makes text pop) */}
            <div 
                className="absolute inset-0 z-20 transition-opacity duration-500 bg-black/40 backdrop-blur-[2px]"
                style={{ opacity: activeBg ? 1 : 0 }}
            />


            <div className="grid grid-cols-2 grid-rows-2 gap-4 z-30">
                {options.map((opt, index)=> {
                    const ternant = index === 0;
                    const lord = index === 1;
                    const investor = index === 2;
                    return(
                    <div key={opt.role}
                        onMouseEnter={() => setActiveBg(opt.image)}
                        onMouseLeave={() => setActiveBg(null)} 
                    className={`max-w-150 shadow-md py-5 px-9 rounded-xl bg-white flex flex-col gap-5 relative overflow-clip group border-2 
                    ${ternant ? 'border-[#00ac738c] hover:border-[#00AC72]' : lord ? 'border-[#2476FF8c] hover:border-[#2476FF]' : investor ? 'border-[#9E25FE8c] hover:border-[#9E25FE]' : 'border-[#FC58008c] hover:border-[#FC5800]'}`}>
                        <span className={`w-12 h-12 text-white flex justify-center items-center text-2xl rounded-xl
                        ${ternant ? 'bg-[#00AC72]' : lord ? 'bg-[#2476FF]' : investor ? 'bg-[#9E25FE]' : 'bg-[#FC5800]'}`}>{opt.icon}</span>
                        <h2 className="text-xl">{opt.title}</h2>
                        <p>{opt.desc}</p>
                        <ul className="space-y-2 mb-6">
                            {opt.points.map((point, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#00BC7D]" />
                                {point}
                            </li>
                            ))}
                        </ul>

                        <hr className="border-gray-200 border-[0.5px] w-full"/>

                        <Link 
                        href={`${opt.link}?role=${opt.role}`} 
                        className="text-primary-green hover:text-primary-green-hover flex items-center gap-2"
                        >
                        Get started <GoArrowRight/>
                        </Link>
                    </div>
                )})}
            </div>

        </section>
    )
}
'use client'
import Image from "next/image"
import building from '@/public/svg/build.svg'
import { LuHouse } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { IoPersonOutline } from "react-icons/io5";

export default function ListerHero () {
    const herodata = [
        {title: 'Total Properties', count: '14', icon: <><LuHouse/></>},
        {title: 'New Leads', count: '8', icon: <><GoPeople/></>},
        {title: 'Profile Score', count: '85%', icon: <><IoPersonOutline/></>},
    ]

    return (
        <div className="w-full p-5 md:p-6 flex flex-col justify-end gap-5 text-white relative overflow-hidden rounded-2xl bg-linear-to-r from-[#24764a] to-[#01a273]">
            {/* Text Section: full width on mobile, 70% on desktop to prevent image overlap */}
            <div className="w-full md:w-[70%] flex flex-col gap-2 relative z-10">
                <h1 className="text-white text-2xl md:text-3xl font-semibold">My Lister Workspace</h1>
                <p className="text-white text-xs md:text-sm w-full md:w-2/3 opacity-90">
                    An Intelligent overview of your property portfolio and profile metrics
                </p>
            </div>

            {/* Stats Row: Stacks vertically or wraps on mobile, flex row on desktop */}
            <div className="w-full flex flex-col sm:flex-row flex-wrap md:flex-nowrap gap-3 relative z-10">
                {herodata.map ((hero, index) => (
                    <div key={index} className="flex items-center gap-2.5 bg-white/10 p-2 rounded-lg flex-1 min-w-[140px]">
                        <div className="p-2 bg-white/30 rounded-md text-sm">
                            {hero.icon}
                        </div>

                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] md:text-[11px] leading-tight text-white/80">{hero.title}</span>
                            <span className="text-xs md:text-sm font-bold text-white mt-0.5">{hero.count}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Background Image: Scaled down and opacity lowered on mobile so it doesn't collide with text */}
            <Image 
                src={building} 
                alt="building" 
                height={10} 
                width={10} 
                className="w-[45%] sm:w-[35%] md:w-[40%] lg:w-[30%] absolute -right-10 md:-right-20 -top-5 opacity-20 md:opacity-100 pointer-events-none transition-opacity duration-300" 
            />
        </div>
    )
}
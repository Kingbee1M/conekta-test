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
        <div className="w-full p-5 flex flex-col justify-end gap-4 text-white shadow-md shadow-black relative overflow-hidden rounded-2xl bg-linear-to-r from-[#144228d1] to-[#25744989]">
            <div className="w-[70%] flex flex-col gap-2">
                <h1 className="text-white text-3xl">My Lister Workspace</h1>
                <p className="text-white text-sm w-2/3">An Intelegent overview of your property portfolio and profile metrics</p>
            </div>

            <div className="w-full flex gap-4 ">
                {herodata.map ((hero, index) => (
                    <div key={index} className="flex gap-1.5 bg-white/10 p-2 rounded-md">
                        <div className="p-2 bg-white/30 rounded-md">
                            {hero.icon}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[11px] text-white">{hero.title}</span>
                            <span className="text-[11px] text-white">{hero.count}</span>
                        </div>
                    </div>
                ))}
            </div>
            
        <Image src={building} alt="building" height={10} width={10} className="w-90 absolute -right-20 -top-10" />
        </div>
    )
}
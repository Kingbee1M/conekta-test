import { IoGridOutline } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { BiBuildings } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { TbCurrencyNaira } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import logo from '@/public/svg/logo-white.svg'
import Image from "next/image";
import Link from "next/link";
export default function AdminSideNav () {
    const sideNav = [
        {title: 'Dashboard', link: '/Admin-dashboard', icon: IoGridOutline, isLocked: false},
        {title: 'Admin', link: '/admin-users', icon: RiAdminFill, isLocked: true},
        {title: 'Realtors', link: '/lister-users', icon: FaUserTie, isLocked: true},
        {title: 'Custmers', link: '/admin-users', icon: BsPeopleFill, isLocked: true},
        {title: 'Properties', link: '/listings', icon: BiBuildings, isLocked: true},
        {title: 'Artisans', link: '/Artisan-users', icon: RiAdminFill, isLocked: true},
        {title: 'Transactions', link: '/Artisan-users', icon: TbCurrencyNaira, isLocked: true},
        {title: 'Verification', link: '/verification', icon: FaCheck, isLocked: false},
    ]
    return (
        <aside className="bg-smooth-green w-full h-full flex flex-col justify-between items-center">
            <div>
                <Image src={logo} alt="logo" width={100} height={100} className="w-10" />
                
                <ul>
                   {sideNav.map((nav, index)=> (
                    <li key={index}>
                        <Link href={nav.link}><nav.icon /> {nav.title}</Link>
                    </li>
                    ))}  
                </ul>
                
            </div>
        </aside>
    )
}
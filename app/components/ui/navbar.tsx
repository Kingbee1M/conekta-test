'use client'
import Image from "next/image"
import logo from '../../../public/svg/logo-enhanced.svg'
import Link from "next/link"
import { IoMdMenu, IoMdClose} from "react-icons/io";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdPersonOutline } from "react-icons/md";


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const navs = [
        { title: 'Find Property', link: '/find-property' },
        { title: 'Artisans', link: '/artisans' },
        { title: 'Invest', link: '/invest' },
        { title: 'List Property', link: '/list-property' },
    ]
    return (
        <nav className=" w-screen fixed top-0 left-0 z-40 flex justify-center">
        <section className={`
        w-full max-w-360
        flex flex-col lg:flex-row lg:items-center lg:justify-between
        transition-all duration-300 ease-in-out
        pr-5 bg-white border-y border-gray-200 border-solid lg:py-8
        ${isOpen ? 'h-64' : 'h-12'} 
        overflow-hidden
        `}>
            <div className='w-full lg:w-1/3 flex justify-between items-center'>
                <Link href='/'>
                    <Image src={logo} alt='logo' width={20} height={20} className='w-20 lg:w-20' priority />
                </Link>
                <button onClick={()=>setIsOpen(!isOpen)} className={`inline lg:hidden text-2xl  transition-transform duration-500 ease-in-out
                 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>{isOpen? (<IoMdClose/>) : (<IoMdMenu/>)}</button>
            </div>
            
            <ul className=
            {`${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
            lg:opacity-100 lg:pointer-events-auto 
            transition-opacity w-2/3 flex flex-col lg:flex-row justify-start gap-3 px-7 lg:px-0 lg:gap-5 mt-1 lg:mt-0
            `}>
                {navs.map((nav, index) => (
                    <li key={index} className=''>
                        <Link href={nav.link}
                        className={`font-inter cursor-pointer hover:text-primary-green-hover text-xs lg-text-base
                        ${pathname === nav.link ? 'text-primary-green' : ''}`}>
                            {nav.title}
                        </Link> 
                    </li>
                ))}
            </ul>
            
            <div className="flex items-center px-7 lg:px-0 gap-3 mt-4 lg:mt-0">
                <Link href={'/notification'} className="relative w-fit p-2 hover:bg-gray-200 cursor-pointer rounded-md">
                <div className="bg-red h-1 w-1 rounded-full absolute top-1 right-1 bg-red-500 "/>
                    <IoIosNotificationsOutline className="text-md" />
                </Link>
                
                <Link href={'/profile'} className="relative w-fit p-2 hover:bg-gray-200 cursor-pointer rounded-md">
                <div className="bg-red h-1 w-1 rounded-full absolute top-1 right-1 bg-red-500"/>
                    <MdPersonOutline className="text-md cursor-pointer" />
                </Link>
                
            </div>
        </section>
        </nav>
    )
}
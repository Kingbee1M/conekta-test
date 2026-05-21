import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import Link from 'next/link';
import { IoChevronDownSharp } from "react-icons/io5";


export default function ListerTopBar () {
    const { user } = useSelector((state: RootState) => state.auth);
    const currentName = user?.user?.profile?.full_name || '';
    const initial = currentName.trim().charAt(0).toUpperCase() || '?';
    const role = user?.active_role || '';
    const userSlug = currentName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters instead of encoding them
        .replace(/\s+/g, '-');  
    return (
        <header className='w-full hidden md:flex md:flex-row justify-between'>
            <p className='text-xl'>Good morning, <span className='text-tertiary-green'>{currentName}</span></p>

            <div className='flex items-center gap-5 text-xl'>
                <span className='border border-[#F0F0F0] px-4 py-1 rounded-l-full rounded-r-full flex gap-1 items-center text-base'>{role} <IoChevronDownSharp className='text-xs'/></span>
                <CiSearch />
                <Link href={`/lister/${userSlug}/inbox`}><IoIosNotificationsOutline /></Link>
                <div className='h-7 w-7 rounded-full bg-secondary-green flex justify-center items-center'>
                    <span className='text-tertiary-green'>{initial}</span>
                </div>
            </div>
        </header>
    )
}
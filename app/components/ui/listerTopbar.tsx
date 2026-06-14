import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import Link from 'next/link';
import { IoChevronDownSharp } from "react-icons/io5";
import { FlatUserData } from '@/types';


export default function ListerTopBar () {
    const { user } = useSelector((state: RootState) => state.auth);
    const typedUser = user as FlatUserData & { user?: FlatUserData } | null;
    const targetUserObj = typedUser?.user || typedUser;
    const firstName = targetUserObj?.profile?.first_name || '';
    const lastName = targetUserObj?.profile?.last_name || '';
    
    const currentName = firstName || lastName ? `${firstName} ${lastName}`.trim() : '';
    const initial = currentName.trim().charAt(0).toUpperCase() || '?';
    const role = user?.active_role || '';
    return (
        <header className='w-full hidden md:flex md:flex-row justify-between'>
            <p className='text-xl'>Good morning, <span className='text-tertiary-green'>{currentName}</span></p>

            <div className='flex items-center gap-5 text-xl'>
                <span className='border border-[#F0F0F0] px-4 py-1 rounded-l-full rounded-r-full flex gap-1 items-center text-base'>{role} <IoChevronDownSharp className='text-xs'/></span>
                <CiSearch />
                <Link href={`/lister/inbox`}><IoIosNotificationsOutline /></Link>
                <div className='h-7 w-7 rounded-full bg-secondary-green flex justify-center items-center'>
                    <span className='text-tertiary-green'>{initial}</span>
                </div>
            </div>
        </header>
    )
}
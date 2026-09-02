import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import Link from 'next/link';
import { IoChevronDownSharp } from "react-icons/io5";


export default function ListerTopBar () {
    const { listerProfile, session } = useSelector((state: RootState) => state.auth);
    const profileName = [listerProfile?.first_name, listerProfile?.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();
    const currentName = profileName || session?.user?.profile?.full_name || '';
    const nameParts = currentName.split(/\s+/).filter(Boolean);
    const initial = nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : currentName.charAt(0).toUpperCase() || '?';
    const role = session?.active_role || 'Lister';
    return (
        <header className='w-full hidden md:flex md:flex-row justify-between'>
            <p className='text-xl'>Good morning, <span className='text-tertiary-green'>{currentName}</span></p>

            <div className='flex items-center gap-5 text-xl'>
                <span className='border border-[#F0F0F0] px-4 py-1 rounded-l-full rounded-r-full flex gap-1 items-center text-base'>{role} <IoChevronDownSharp className='text-xs'/></span>
                <CiSearch />
                <Link href={`/inbox`}><IoIosNotificationsOutline /></Link>
                <Link href={'/my-profile'} className='h-10 w-10 rounded-full bg-secondary-green flex justify-center items-center'>
                    <span className='text-tertiary-green'>{initial}</span>
                </Link>
            </div>
        </header>
    )
}
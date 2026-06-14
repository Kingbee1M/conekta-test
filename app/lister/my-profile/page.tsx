'use client'
import { MdModeEdit } from "react-icons/md";
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { getNameInitials } from "@/lib/hooks";

export default function MyProfile () {
    const { user } = useSelector((state: RootState) => state.auth);
    console.log(user)
    return (
        <section className="w-full flex flex-col items-center gap-3 h-full">
            <div className="w-full flex flex-col md:flex-row justify-between items-start gap-2 md:gap-0 md:items-center">
                <div className="flex flex-col gap-1 ">
                    <h1 className="font-bold text-2xl">My Profile</h1>
                    <span>Manage your personal information</span>
                </div>

                <button className="bg-primary-green px-5 py-2 rounded-l-full rounded-r-full text-white flex gap-1 items-center">
                    <MdModeEdit />
                    Edit Profile
                </button>
            </div>


            <section>

                <div className="grid grid-cols-[300px_1fr] gap-3">
                    <div>

                    </div>
                </div>

            </section>
        </section>
    )
}
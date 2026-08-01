'use client'
import { useAppSelector } from "@/lib/hooks"


export default function Overview () {
     const { session } = useAppSelector((state) => state.auth);
    return (
        <section>
            <section>
                <div className="flex flex-col ">
                    <p>Good morning, {session?.user?.profile?.full_name}</p>
                    <p>Here&apos;s what&apos;s happening with your platform today</p> 
                </div>
                
            </section>
        </section>
    )
}
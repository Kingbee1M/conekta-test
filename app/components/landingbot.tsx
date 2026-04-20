import Link from "next/link"

export default function LandigBot() {
    return (
        <section className="bg-tertiary-green w-full py-16 flex flex-col items-center gap-7 mt-20">
            <h2 className="text-white text-2xl text-center lg:text-4xl">Ready to Start Your Housing Journey?</h2>
            <p className="text-[#d0fae5] text-xs lg:text-xl w-[65%] text-center">Join thousands of Nigerians who are finding, financing, and managing their dream homes with Conekta.</p>

            <div className="flex flex-col lg:flex-row gap-3">
                <Link href={'/sign-up'} className="text-primary-green px-5 py-3 bg-white rounded-lg cursor-pointer hover:bg-primary-green hover:text-white" >Get started for Free</Link>
                <Link href={'/find-property'} className="text-primary-green px-5 py-3 bg-white rounded-lg cursor-pointer hover:bg-primary-green hover:text-white">Browse Properties</Link>
            </div>

        </section>
    )
}
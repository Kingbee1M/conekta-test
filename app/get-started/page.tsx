import { FiHome } from "react-icons/fi";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { GrLineChart } from "react-icons/gr";
import { LuHammer } from "react-icons/lu";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";


export default function GetStarted () {
    const options = [
        {icon: <FiHome/>, title: 'Renter / Buyer', desc: 'Find your perfect home with flexible payment options', points: ['Browse Properties', 'Virtual Tours', 'Flexible Payments', 'Property Management',], link: '/sign-up', role: 'ternant', color: '#00AC72',},
        {icon:  <TbBuildingSkyscraper/>, title: 'Property Owner / Developer', desc: 'List and manage your properties efficiently', points: ['List Properties','Tenant Management','Analytics Dashboard','Secure Payments',], link: '/sign-up', role: 'lord', color: '#2476FF'},
        {icon:  <GrLineChart/>, title: 'Fractional Investor', desc: 'Start investing in real estate from ₦500,000', points: ['Browse Investments', 'Portfolio Tracking', 'Monthly Returns', 'Low Entry Cost',], link: '/sign-up', role: 'investor', color: '#9E25FE',},
        {icon:  <LuHammer/>, title: 'Artisan / Service Provider', desc: 'Connect with property owners and renters', points: ['Get Job Requests', 'Build Portfolio', 'Secure Payments', 'Customer Reviews',], link: '/sign-up', role: 'artisan', color: '#FC5800',},
    ]
    return (
        <section className="bg-linear-to-br from-[#ECFDF5] to-white w-full flex justify-center items-center min-h-screen py-20">

            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                {options.map((opt)=> (
                    <div key={opt.role} className="max-w-150 shadow-md py-5 px-9 rounded-xl bg-white flex flex-col gap-5 relative overflow-clip group border"  style={{borderColor: opt.color, }}>
                        <span className="w-12 h-12 text-white flex justify-center items-center text-2xl rounded-xl" style={{backgroundColor: opt.color}}>{opt.icon}</span>
                        <h2>{opt.title}</h2>
                        <p>{opt.desc}</p>
                        <ul className="space-y-2 mb-6">
                            {opt.points.map((point, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-green" />
                                {point}
                            </li>
                            ))}
                        </ul>
                        <Link 
                        href={`${opt.link}?role=${opt.role}`} 
                        className="text-primary-green hover:text-primary-green-hover flex items-center gap-2"
                        >
                        Get started <GoArrowRight/>
                        </Link>
                    </div>
                ))}
            </div>

        </section>
    )
}
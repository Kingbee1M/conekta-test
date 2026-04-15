import Link from "next/link";
import { MdOutlinePersonOutline } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { FiEyeOff, FiEye } from "react-icons/fi";
import logo from '../../public/svg/logo-enhanced.svg'
import Image from "next/image";

interface AuthFormProps {
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    name: string;
    setName: (val: string) => void;
    onSubmit: () => void;
    role?: string | null;
}

export default function TenantForm({ name, setName, email, setEmail, password, setPassword, onSubmit }: AuthFormProps) {
    return (
        <div className="w-full max-w-md rounded-2xl bg-gray-400 p-1 shadow-sm relative group overflow-clip">
            
            <div className="absolute inset-x-0 -bottom-full h-full bg-[#00AC72] z-10 
            transition-all duration-700 ease-in-out 
            group-hover:bottom-0"/>


        <div className="w-full h-full bg-white rounded-[calc(1rem-2px)] flex flex-col justify-center items-center gap-2 py-8 px-6 relative z-20">
            <Image src={logo} width={100} height={100} alt="logo" />
            <h2 className="text-3xl font-bold text-[#00AC72]">Create Account</h2>
            <p className="text-gray-500 text-sm">Sign up as Renter / Buyer</p>
            <Link href='/get-started' className="text-new-green text-sm hover:underline">Change role</Link>
            
            <div className="outerDiv">
                <label htmlFor="full_name">Full Name</label>
                <div className="inputDiv">
                    <MdOutlinePersonOutline/>
                    <input className="inputTag" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                
            </div>
            
            <div className="outerDiv">
                <label htmlFor="">Email Address</label>
                <div className="inputDiv">
                    <CiMail/>
                    <input className="inputTag" placeholder="You@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                
            </div>

            <div className="outerDiv">
                <label htmlFor="">Phone number</label>
                <div className="inputDiv">
                    <FiPhone/>
                    <input className="inputTag" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                
            </div>

            <div className="outerDiv">
                <label htmlFor="">Password</label>
                <div className="inputDiv">
                    <input className="inputTag" type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button>

                    </button>
                </div>
                
            </div>

            <div className="outerDiv">
                <label htmlFor="">Confirm Password</label>
                <div className="inputDiv">
                    <input className="inputTag" placeholder="Confirm your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button>

                    </button>
                </div>
                
            </div>

            <button onClick={onSubmit} className="bg-[#00AC72] text-white p-3 rounded-lg font-semibold hover:bg-[#008f5d] transition-colors">
                Join as Tenant
            </button>

            </div>
        </div>
    );
}
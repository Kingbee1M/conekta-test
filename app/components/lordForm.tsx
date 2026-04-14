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

export default function LordForm({ name, setName, email, setEmail, password, setPassword, onSubmit }: AuthFormProps) {
    return (
        <div className="flex flex-col gap-4 w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-[#FC58001A]">
            <h2 className="text-2xl font-bold text-[#FC5800]">Grow Your Business</h2>
            <p className="text-gray-500 text-sm">Connect with property owners who need your skills.</p>
            
            <input className="border p-3 rounded-lg" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            {/* You could add an extra field here for "Trade" (Plumber, Electrician, etc.) */}
            <input className="border p-3 rounded-lg" type="email" placeholder="Work Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="border p-3 rounded-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <button onClick={onSubmit} className="bg-[#FC5800] text-white p-3 rounded-lg font-semibold hover:bg-[#e64f00] transition-colors">
                Register as Artisan
            </button>
        </div>
    );
}
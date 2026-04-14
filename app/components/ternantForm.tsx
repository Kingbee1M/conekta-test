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
        <div className="flex flex-col gap-4 w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-[#ECFDF5]">
            <h2 className="text-2xl font-bold text-[#00AC72]">Find Your Next Home</h2>
            <p className="text-gray-500 text-sm">Create an account to start browsing properties.</p>
            
            <input className="border p-3 rounded-lg" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="border p-3 rounded-lg" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="border p-3 rounded-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <button onClick={onSubmit} className="bg-[#00AC72] text-white p-3 rounded-lg font-semibold hover:bg-[#008f5d] transition-colors">
                Join as Tenant
            </button>
        </div>
    );
}
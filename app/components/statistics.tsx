import Counter from "./ui/counterComp";

export default function Statistics () {
    const stats = [
    { number: 5000, suffix: '+', label: 'Properties' },
    { number: 20000, suffix: '+', label: 'Users' },
    { number: 500, suffix: '+', label: 'Artisans' },
    { number: 2, suffix: 'B+', prefix: '₦', label: 'Transactions' },
    ];
    return (
        <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-10 lg:py-20 bg-tertiary-green flex justify-center gap-10 px-2 lg:px-20 mt-10">
                {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                <Counter 
                    targetValue={stat.number} 
                    suffix={stat.suffix} 
                    prefix={stat.prefix} 
                />
                <p className="text-[#f1fcf5] opacity-80 text-base">{stat.label}</p>
                </div>
            ))}
            </section>
    )
}
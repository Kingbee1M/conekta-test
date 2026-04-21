import Counter from "./ui/counterComp";

export default function Statistics () {
    const stats = [
    { number: 5000, suffix: '+', label: 'Properties' },
    { number: 20000, suffix: '+', label: 'Users' },
    { number: 500, suffix: '+', label: 'Artisans' },
    { number: 2, suffix: 'B+', prefix: '₦', label: 'Transactions' },
    ];
    return (
        <section className="w-full py-10 md:py-20 bg-tertiary-green flex justify-around md:gap-10 px-2 md:px-20 my-10">
                {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                <Counter 
                    targetValue={stat.number} 
                    suffix={stat.suffix} 
                    prefix={stat.prefix} 
                />
                <p className="text-[#f1fcf5] opacity-80 text-[10px] md:text-base">{stat.label}</p>
                </div>
            ))}
            </section>
    )
}
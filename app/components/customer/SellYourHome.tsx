import Image from 'next/image';
import Link from 'next/link';
import { LuCheck } from 'react-icons/lu';

export function SellHomeHero() {
  return (
    <section className="w-full bg-slate-50/50 py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Content */}
        <div className="flex flex-col items-start space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            The Smarter Way <br />
            to Sell <span className="font-extrabold">Your Home</span>
          </h1>

          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl">
            Sell with confidence using smart technology, expert insights, and
            targeted marketing strategies designed to attract qualified buyers,
            increase visibility, and help you achieve the best possible outcome.
          </p>

          <ul className="space-y-3 pt-2">
            <li className="flex items-center gap-3 text-sm md:text-base font-medium text-slate-700">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200/80 text-slate-600 text-xs shrink-0">
                <LuCheck className="stroke-3" />
              </span>
              Targeted Marketing That Works
            </li>
            <li className="flex items-center gap-3 text-sm md:text-base font-medium text-slate-700">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200/80 text-slate-600 text-xs shrink-0">
                <LuCheck className="stroke-3" />
              </span>
              Maximize Property Exposure
            </li>
            <li className="flex items-center gap-3 text-sm md:text-base font-medium text-slate-700">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200/80 text-slate-600 text-xs shrink-0">
                <LuCheck className="stroke-3" />
              </span>
              Boost Property Visibility
            </li>
          </ul>

          <div className="pt-4">
            <Link
              href="/sell"
              className="inline-flex items-center justify-center bg-primary-green hover:bg-primary-green-hover text-white font-semibold text-sm md:text-base px-8 py-3.5 rounded-full shadow-2xs border border-slate-200/60 transition-all duration-200 active:scale-95"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-xs border border-slate-200/60 bg-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"
            alt="Modern Luxury House"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

export default SellHomeHero;
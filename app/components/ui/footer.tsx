import { CiLocationOn, CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import Image from "next/image";
import logo from '../../../public/svg/logo-enhanced.svg';
import Link from "next/link";

export default function Footer() {
  const links: Array<Record<string, Record<string, string>>> = [
    {
      'Quick Links': {
        'Find Property': '/discover',
        'List Property': '/list-property',
        'Invest': '/invest',
        'Find Artisans': '/artisans',
        'Help Center': '/help-center',
      },
    },
    {
      'Company': {
        'About Us': '/about',
        'How It Works': '/how-it-works',
        'Blog': '/blog',
        'Careers': '/careers',
        'Terms & Privacy': '/terms-privacy',
        'Contact Us': '/contact',
      },
    },
    {
      'Contact': {
        'Address': 'Lagos, Nigeria',
        'Phone': '+234 807 238 3942',
        'Email': 'info@useconekta.com',
      },
    },
  ];

  const getContactHref = (label: string, value: string) => {
    switch (label) {
      case 'Address':
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
      case 'Phone':
        return `tel:${value.replace(/\s+/g, '')}`;
      case 'Email':
        return `mailto:${value}`;
      default:
        return '#';
    }
  };

  return (
    <footer className="bg-[#101828] flex flex-col items-center w-full max-w-520 py-10 px-10">
      <div className="w-full max-w-[96%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="w-fit">
          <Image src={logo} alt="logo" width={20} height={20} className="w-20 lg:w-40 mb-5" priority />
          <h2 className="text-white text-sm">...driven by tech, defined by impact</h2>
        </div>

        {links.map((linkObj, index) => {
          const sectionTitle = Object.keys(linkObj)[0];
          const sectionLinks = Object.values(linkObj)[0];

          return (
            <div key={index} className="flex flex-col gap-4">
              <h3 className="font-bold text-lg text-primary-green">{sectionTitle}</h3>
              <ul className="flex flex-col gap-3">
                {Object.entries(sectionLinks).map(([label, value]) => (
                  <li key={label} className="text-gray-600 transition-colors text-sm">
                    {value.startsWith('/') ? (
                      <Link href={value} className="text-white hover:text-primary-green text-xs transition-colors">
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={getContactHref(label, value)}
                        target={label === 'Address' ? '_blank' : undefined}
                        rel={label === 'Address' ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-2 text-primary-green hover:text-white transition-colors text-xs group"
                      >
                        {label === 'Address' && <CiLocationOn className="text-xl shrink-0" />}
                        {label === 'Phone' && <FiPhone className="shrink-0" />}
                        {label === 'Email' && <CiMail className="text-xl shrink-0" />}
                        <span className="text-white group-hover:text-primary-green transition-colors">
                          {value}
                        </span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <hr className="w-full border-t border-gray-600 my-10" />

      <p className="text-white text-xs lg:text-sm text-center mt-6 lg:mt-0">
        © 2026 Conekta. All rights reserved. Powered by innovation in PropTech.
      </p>
    </footer>
  );
}
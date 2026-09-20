'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
  x: string;
}

export default function MeetTheTeam() {
  const teamMembers: TeamMember[] = [
    {
      name: 'Kevin Cruz',
      role: 'FOUNDER, REALTOR',
      bio: 'With over 15 years of experience managing diverse property portfolios, Kevin leads Propti with a focus on innovation and client satisfaction.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
      linkedin: '#',
      x: '#',
    },
    {
      name: 'Tien Le',
      role: 'CO-FOUNDER',
      bio: 'Tien drives strategic operations and partner ecosystems, ensuring seamlessly integrated real estate solutions across markets.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
      linkedin: '#',
      x: '#',
    },
    {
      name: 'Sullean Arragaza',
      role: 'CO-FOUNDER, REALTOR',
      bio: 'Sullean specializes in high-value asset acquisitions and client relations, blending market analytics with personalized service.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      linkedin: '#',
      x: '#',
    },
    {
      name: 'Juan Ruan',
      role: 'PRESIDENT, REALTORS',
      bio: 'Juan oversees regional broker networks and agent compliance, helping scale enterprise property management platforms.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
      linkedin: '#',
      x: '#',
    },
    {
      name: 'Ed Barreto, MBA',
      role: 'FOUNDER, REALTOR',
      bio: 'Ed brings corporate venture capital experience to real estate growth, guiding product strategies and institutional partnerships.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
      linkedin: '#',
      x: '#',
    },
    {
      name: 'Clara Jennings',
      role: 'PROPERTY TECHNOLOGY LEAD',
      bio: 'Clara leads software architecture and technical roadmap execution for Propti, making complex real estate workflows simple.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      linkedin: '#',
      x: '#',
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white text-slate-900 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading */}
        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Meet the People Behind Propti
          </h2>
        </div>

        {/* 3x2 Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="relative group rounded-3xl overflow-hidden aspect-[3/4] shadow-md border border-slate-100 bg-slate-900"
            >
              {/* Member Portrait */}
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />

              {/* Glassmorphism Details Overlay */}
              <div className="absolute bottom-4 inset-x-4 p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/20 text-white flex flex-col justify-between gap-3 shadow-xl">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold tracking-wide uppercase">
                    {member.name}
                  </h3>
                  <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs text-slate-200/90 leading-relaxed line-clamp-3 font-normal">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-1 text-xs font-semibold text-slate-300">
                  <Link
                    href={member.linkedin}
                    className="hover:text-white transition-colors"
                  >
                    in
                  </Link>
                  <Link
                    href={member.x}
                    className="hover:text-white transition-colors"
                  >
                    X
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
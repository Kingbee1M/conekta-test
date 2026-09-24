import React from 'react';

export default function ThreeDPipeFitting({ className = "w-48 h-48 sm:w-60 sm:h-60" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />

      {/* Glossy 3D Pipe Assembly (Pure SVG) */}
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] relative z-10"
      >
        <defs>
          {/* Metallic Chrome/Brass Gradients */}
          <linearGradient id="main-pipe" x1="50" y1="50" x2="250" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="35%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="65%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="brass-joint" x1="80" y1="100" x2="220" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="gauge-rim" x1="100" y1="60" x2="200" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id="inner-shadow">
            <feOffset dx="0" dy="3" />
            <feGaussianBlur stdDeviation="3" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.4" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* 3D Pipe Elbow Base */}
        <path
          d="M 60 180 L 160 180 C 200 180, 220 160, 220 120 L 220 50 L 170 50 L 170 120 C 170 130, 160 140, 150 140 L 60 140 Z"
          fill="url(#main-pipe)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Isometric Flange Ribs */}
        <ellipse cx="60" cy="160" rx="12" ry="22" fill="url(#brass-joint)" stroke="#78350f" strokeWidth="2" />
        <ellipse cx="195" cy="50" rx="27" ry="10" fill="url(#brass-joint)" stroke="#78350f" strokeWidth="2" />

        {/* Central Valve Body */}
        <rect x="135" y="115" width="50" height="50" rx="10" fill="url(#brass-joint)" transform="rotate(-15 160 140)" />

        {/* Pressure Gauge Unit */}
        <circle cx="200" cy="110" r="32" fill="url(#gauge-rim)" stroke="#ecfdf5" strokeWidth="3" />
        <circle cx="200" cy="110" r="26" fill="#ffffff" />
        
        {/* Gauge Needle & Markings */}
        <circle cx="200" cy="110" r="3" fill="#0f172a" />
        <path d="M 200 110 L 214 96" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        <path d="M 182 110 A 18 18 0 0 1 218 110" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="2 4" fill="none" />
      </svg>
    </div>
  );
}
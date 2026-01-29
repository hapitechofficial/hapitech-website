"use client";
import React from 'react';

export default function AnimatedBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {/* Mesh-style, high-blur, slow-drifting blobs */}
      <div className="absolute w-[700px] h-[700px] top-[-180px] left-[-180px] opacity-40 animate-meshblob1 rounded-full bg-gradient-to-tr from-[#60a5fa] via-[#a78bfa] to-[#f1f5f9] blur-[80px]" />
      <div className="absolute w-[600px] h-[600px] bottom-[-160px] right-[-120px] opacity-30 animate-meshblob2 rounded-full bg-gradient-to-br from-[#f8fafc] via-[#818cf8] to-[#f1f5f9] blur-[100px]" />
      <div className="absolute w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 animate-meshblob3 rounded-full bg-gradient-to-tl from-[#c7d2fe] via-[#f472b6] to-[#f1f5f9] blur-[90px]" />
      <style jsx>{`
        @keyframes blob1 {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(30deg); }
        }
        @keyframes blob2 {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(-20deg); }
        }
        @keyframes blob3 {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.08) rotate(15deg); }
        }
        @keyframes meshblob1 {
          0%, 100% { transform: scale(1) rotate(0deg) translateY(0); }
          50% { transform: scale(1.12) rotate(40deg) translateY(30px); }
        }
        @keyframes meshblob2 {
          0%, 100% { transform: scale(1) rotate(0deg) translateX(0); }
          50% { transform: scale(1.08) rotate(-30deg) translateX(-40px); }
        }
        @keyframes meshblob3 {
          0%, 100% { transform: scale(1) rotate(0deg) translateY(0); }
          50% { transform: scale(1.15) rotate(25deg) translateY(-40px); }
        }
        .animate-meshblob1 { animation: meshblob1 32s ease-in-out infinite; }
        .animate-meshblob2 { animation: meshblob2 38s ease-in-out infinite; }
        .animate-meshblob3 { animation: meshblob3 44s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

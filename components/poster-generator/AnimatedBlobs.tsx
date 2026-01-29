import React from 'react';

export default function AnimatedBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute w-[500px] h-[500px] top-[-120px] left-[-120px] opacity-30 animate-blob1 rounded-full bg-gradient-to-tr from-[#e0e7ef] to-[#c7d2fe] blur-3xl" />
      <div className="absolute w-[400px] h-[400px] bottom-[-100px] right-[-80px] opacity-25 animate-blob2 rounded-full bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] blur-2xl" />
      <div className="absolute w-[350px] h-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 animate-blob3 rounded-full bg-gradient-to-tl from-[#cbd5e1] to-[#f1f5f9] blur-2xl" />
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
        .animate-blob1 { animation: blob1 18s ease-in-out infinite; }
        .animate-blob2 { animation: blob2 22s ease-in-out infinite; }
        .animate-blob3 { animation: blob3 26s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

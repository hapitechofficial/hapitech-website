import React from 'react';
import { SIZE_OPTIONS } from '@/lib/constants';
import type { SizeOption } from '@/types/poster';

interface SizeSelectorProps {
  onSelect: (size: SizeOption) => void;
}

const SizeIcon: React.FC<{ type: SizeOption['iconType'] }> = ({ type }) => {
  const baseClasses = "border-2 border-indigo-500/50 rounded-sm bg-indigo-500/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-400 transition-all";

  switch (type) {
    case 'square':
      return <div className={`w-12 h-12 ${baseClasses}`}></div>;
    case 'portrait':
      return <div className={`w-10 h-14 ${baseClasses}`}></div>;
    case 'landscape':
      return <div className={`w-14 h-10 ${baseClasses}`}></div>;
    case 'tall':
      return <div className={`w-8 h-16 ${baseClasses}`}></div>;
    case 'wide':
      return <div className={`w-16 h-9 ${baseClasses}`}></div>;
    default:
      return <div className={`w-12 h-12 ${baseClasses}`}></div>;
  }
};

const SizeSelector: React.FC<SizeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Choose Your Canvas</h2>
        <p className="text-gray-400 text-lg">Select a format to start designing your professional poster.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {SIZE_OPTIONS.map((size) => (
          <button
            key={size.id}
            onClick={() => onSelect(size)}
            className="group flex flex-col items-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 text-left relative overflow-hidden"
          >
            <div className="mb-4 flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full group-hover:scale-110 transition-transform duration-300">
               <SizeIcon type={size.iconType} />
            </div>

            <h3 className="font-bold text-white text-center mb-1 group-hover:text-indigo-400 transition-colors">{size.title}</h3>
            <p className="text-xs text-indigo-300 font-mono mb-2">{size.dimensions}</p>
            <p className="text-xs text-gray-500 text-center leading-relaxed">{size.description}</p>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
import React from 'react';
import { PraetorianLogo } from './Icons';

const Header: React.FC = () => {
  return (
    <header 
        className="bg-gray-900/70 backdrop-blur-sm border-b border-cyan-400/20 sticky top-0 z-50 h-[80px] flex items-center"
        style={{ fontFamily: "'Teko', sans-serif" }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PraetorianLogo className="h-12 w-12 text-cyan-400" />
          <div>
            <h1 className="text-4xl font-bold text-white tracking-widest">
              PRAETORIAN
            </h1>
            <p className="text-sm text-cyan-300/80 -mt-1 tracking-wider">
              ACTIVE DIRECTORY CYBER RANGE
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
            <span className="text-green-400 animate-pulse">●</span> OPERATIONAL
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useContext } from 'react';
import { ADversaryLogo, LogoutIcon, SettingsIcon } from './Icons';
import { AuthContext } from '../context/AuthContext';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { logout } = useContext(AuthContext);

  return (
    <header 
        className="bg-black/80 backdrop-blur-sm border-b border-green-500/20 sticky top-0 z-50 h-[80px] flex items-center"
        style={{ fontFamily: "'Exo 2', sans-serif" }}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ADversaryLogo className="h-12 w-12 text-green-500" />
          <div>
            <h1 className="text-4xl font-bold text-white tracking-widest">
              ADversary
            </h1>
            <p className="text-sm text-green-300/80 -mt-1 tracking-wider font-medium">
              ACTIVE DIRECTORY THREAT SIMULATION
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 text-sm font-semibold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-gray-300">STATUS:</span>
                <span className="text-green-300">OPERATIONAL</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onSettingsClick} className="text-gray-400 hover:text-white transition-colors" title="Settings">
                <SettingsIcon className="w-6 h-6" />
              </button>
              <button onClick={logout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
                <LogoutIcon className="w-6 h-6" />
              </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

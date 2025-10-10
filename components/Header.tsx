import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ADversaryLogo } from './Icons';
import SettingsModal from './SettingsModal';
import HistoryModal from './HistoryModal';
import { ExportedScenario } from '../services/aiService';

interface HeaderProps {
  onLoadScenario: (scenario: ExportedScenario) => void;
}

const Header: React.FC<HeaderProps> = ({ onLoadScenario }) => {
    const { logout } = useContext(AuthContext);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <>
            <header className="bg-zinc-900/50 border-b border-green-500/20 sticky top-0 z-40 backdrop-blur-sm">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <ADversaryLogo className="h-12 w-12 text-green-500" />
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-widest" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                                ADversary
                            </h1>
                            <p className="text-xs text-green-300/70 tracking-wider font-medium">
                                ACTIVE DIRECTORY THREAT SIMULATION
                            </p>
                        </div>
                    </div>
                    <nav className="flex items-center gap-4">
                        <button onClick={() => setIsHistoryOpen(true)} className="text-sm font-semibold text-gray-300 hover:text-green-400 transition-colors">History</button>
                        <button onClick={() => setIsSettingsOpen(true)} className="text-sm font-semibold text-gray-300 hover:text-green-400 transition-colors">Settings</button>
                        <button onClick={logout} className="text-sm font-semibold bg-red-600/50 hover:bg-red-600 border border-red-500/50 text-white py-2 px-4 rounded-md transition-all">Logout</button>
                    </nav>
                </div>
            </header>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} onLoadScenario={onLoadScenario} />
        </>
    );
};

export default Header;
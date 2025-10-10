import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useLocalStorage('adversary_theme', 'dark');
  const [showTooltips, setShowTooltips] = useLocalStorage('adversary_tooltips', true);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-[#0c0c16] rounded-lg border border-green-500/30 shadow-2xl w-full max-w-lg mx-4 p-6 animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            Settings
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
        </div>
        
        <div className="space-y-6 text-gray-300">
          <div>
            <label htmlFor="theme-select" className="block text-sm font-medium mb-2">
              UI Theme
            </label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-zinc-900/70 border border-green-500/30 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-sm"
              disabled // Acknowledge other themes aren't implemented
            >
              <option value="dark">ADversary Dark (Default)</option>
              <option value="light" disabled>Light Mode (Coming Soon)</option>
              <option value="matrix" disabled>Matrix Green (Coming Soon)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="tooltips-toggle" className="text-sm font-medium">
              Enable Informational Tooltips
            </label>
            <button
                role="switch"
                aria-checked={showTooltips}
                onClick={() => setShowTooltips(!showTooltips)}
                className={`${
                    showTooltips ? 'bg-green-600' : 'bg-gray-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
            >
                <span
                    className={`${
                    showTooltips ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
            </button>
          </div>

          <div className="pt-4 border-t border-green-500/20 text-center">
             <p className="text-xs text-gray-500">ADversary Simulation Engine v1.0.0</p>
          </div>

        </div>

        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

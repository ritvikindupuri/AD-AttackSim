import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#111111] border border-green-500/30 rounded-lg shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 
          className="text-2xl font-bold mb-6 text-green-400 tracking-wider text-center" 
          style={{fontFamily: "'Exo 2', sans-serif"}}
        >
          Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="ai-model" className="block text-sm font-medium text-gray-300 mb-2">
              AI Model Provider
            </label>
            <select
              id="ai-model"
              value="gemini"
              disabled
              className="w-full bg-zinc-900/70 border border-green-500/30 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-sm disabled:opacity-70"
            >
              <option value="gemini">Google Gemini (gemini-2.5-flash)</option>
            </select>
             <p className="text-xs text-gray-500 mt-2">
              The model provider is configured to use Google Gemini. The API key is sourced from the `API_KEY` environment variable.
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

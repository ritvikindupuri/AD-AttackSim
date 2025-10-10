import React, { useState, ReactNode } from 'react';

interface TabbedPanelProps {
  children: { [key: string]: ReactNode };
}

const TabbedPanel: React.FC<TabbedPanelProps> = ({ children }) => {
  const tabs = Object.keys(children);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b border-green-500/20">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold transition-colors ${
              activeTab === tab 
                ? 'text-green-300 border-b-2 border-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        {children[activeTab]}
      </div>
    </div>
  );
};

export default TabbedPanel;

import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Header from './components/Header';
import DashboardPanel from './components/DashboardPanel';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!isAuthenticated) {
    return isSigningUp ? (
      <SignUpPage onSwitchToLogin={() => setIsSigningUp(false)} />
    ) : (
      <LoginPage onSwitchToSignUp={() => setIsSigningUp(true)} />
    );
  }

  return (
    <div className="bg-[#0c0c16] min-h-screen text-gray-200" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="container mx-auto p-4 lg:p-8">
        <DashboardPanel />
      </main>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default App;

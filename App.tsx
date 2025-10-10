import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPanel from './components/DashboardPanel';
import { HistoryProvider } from './context/HistoryContext';

const App: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);

  if (!isAuthenticated) {
    if (showLogin) {
      return <LoginPage onSwitchToSignUp={() => setShowLogin(false)} />;
    } else {
      return <SignUpPage onSwitchToLogin={() => setShowLogin(true)} />;
    }
  }

  return (
    // FIX: Wrap DashboardPanel with HistoryProvider to make history context available.
    <HistoryProvider>
      <DashboardPanel />
    </HistoryProvider>
  );
};

export default App;
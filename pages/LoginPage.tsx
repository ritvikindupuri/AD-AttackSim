import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ADversaryLogo } from '../components/Icons';
import Loader from '../components/Loader';

interface LoginPageProps {
  onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp }) => {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    try {
      await login(email, password);
      // On successful login, the AuthContext will handle the redirect via `isAuthenticated` state in App.tsx
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown login error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900/50 p-4" style={{fontFamily: "'Inter', sans-serif"}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <ADversaryLogo className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-white tracking-widest" style={{fontFamily: "'Exo 2', sans-serif"}}>
              ADversary
            </h1>
            <p className="text-lg text-green-300/80 tracking-wider font-medium mt-2">
              ACTIVE DIRECTORY THREAT SIMULATION
            </p>
        </div>

        <div className="bg-black/40 rounded-lg border border-green-500/20 p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Operator Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email-login" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email-login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-zinc-900/70 border border-green-500/30 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500 text-sm"
                placeholder="operator@adversary.c2"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password-login" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password-login"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-zinc-900/70 border border-green-500/30 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500 text-sm"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            
            {error && <p className="text-red-300 text-sm text-center bg-red-900/30 border border-red-500/40 p-3 rounded-md">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {loading ? (
                  <>
                    <Loader />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
           <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <button onClick={onSwitchToSignUp} className="font-semibold text-green-400 hover:text-green-300 transition-colors">
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
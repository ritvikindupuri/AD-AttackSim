import React, { createContext, useState, useEffect } from 'react';

// NOTE: This AuthContext simulates a secure backend interaction.
// User data is stored in localStorage for persistence in this simulation.
// A real-world app would use HTTP-only cookies and a proper database.

interface AuthContextType {
  isAuthenticated: boolean;
  signup: (email: string, password_plaintext: string) => Promise<void>;
  login: (email: string, password_plaintext: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface User {
  email: string;
  password_plaintext: string;
}

const USERS_STORAGE_KEY = 'adversary_sim_users';

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signup: async () => {},
  login: async () => {},
  logout: () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return sessionStorage.getItem('authToken');
  });
  const [loading, setLoading] = useState<boolean>(false);

  const isAuthenticated = !!authToken;

  useEffect(() => {
    if (authToken) {
      sessionStorage.setItem('authToken', authToken);
    } else {
      sessionStorage.removeItem('authToken');
    }
  }, [authToken]);

  const signup = async (email: string, password_plaintext: string): Promise<void> => {
    setLoading(true);
    // --- SIMULATED BACKEND INTERACTION ---
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
          const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
          
          if (users.find(user => user.email === email)) {
            setLoading(false);
            return reject(new Error('User with this email already exists.'));
          }

          users.push({ email, password_plaintext });
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

          setLoading(false);
          resolve();
        } catch (e) {
            setLoading(false);
            reject(new Error('Failed to register user due to a storage error.'));
        }
      }, 1000);
    });
    // --- END SIMULATION ---
  };

  const login = async (email: string, password_plaintext: string): Promise<void> => {
     setLoading(true);
     // --- SIMULATED BACKEND INTERACTION ---
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
                const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
                
                const foundUser = users.find(user => user.email === email);

                if (foundUser && foundUser.password_plaintext === password_plaintext) {
                    // Successful login: create a dummy session token
                    const dummyToken = `simulated_token_${Date.now()}`;
                    setAuthToken(dummyToken);
                    setLoading(false);
                    resolve();
                } else {
                    // User not found or password incorrect
                    setLoading(false);
                    reject(new Error('Invalid credentials. Please try again.'));
                }
            } catch (e) {
                setLoading(false);
                reject(new Error('An error occurred during login.'));
            }
        }, 1500);
     });
     // --- END SIMULATION ---
  };

  const logout = () => {
    // In a real app, this would also call a backend endpoint to invalidate the session.
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signup, login, logout, loading }}>
      {children}
    {/* FIX: Corrected typo in the closing tag. It should be AuthContext, not Auth-Context. */}
    </AuthContext.Provider>
  );
};

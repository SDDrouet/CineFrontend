import { createContext, useContext, useState } from "react";

interface User {
  id: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    setUser({
      id: 1,
      name: "Stephen",
    });
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");

  return context;
}
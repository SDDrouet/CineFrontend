import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { AuthUser } from "@/types";
import {
  decodeJwtPayload,
  getCurrentUser,
  isJwtExpired,
  loginRequest,
  logoutRequest,
  refreshRequest,
} from "@/lib/auth";

const ACCESS_TOKEN_KEY = "cinefrontend_access_token";
const REFRESH_TOKEN_KEY = "cinefrontend_refresh_token";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredTokens() {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null };
  }

  return {
    accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

function storeTokens(accessToken: string, refreshToken: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function clearTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function resolveUserFromTokens(accessToken: string, refreshToken: string) {
  let currentAccessToken = accessToken;
  let currentRefreshToken = refreshToken;

  if (isJwtExpired(currentAccessToken)) {
    const refreshedTokens = await refreshRequest(currentRefreshToken);
    currentAccessToken = refreshedTokens.accessToken;
    currentRefreshToken = refreshedTokens.refreshToken;
    storeTokens(currentAccessToken, currentRefreshToken);
  }

  const payload = decodeJwtPayload(currentAccessToken);

  if (payload.type !== "ACCESS") {
    throw new Error("El token de acceso no es válido");
  }

  const user = await getCurrentUser(payload.sub, currentAccessToken);

  return {
    accessToken: currentAccessToken,
    refreshToken: currentRefreshToken,
    user,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      const storedTokens = getStoredTokens();

      if (!storedTokens.accessToken || !storedTokens.refreshToken) {
        if (isMounted) {
          setLoading(false);
        }

        return;
      }

      try {
        const resolved = await resolveUserFromTokens(
          storedTokens.accessToken,
          storedTokens.refreshToken,
        );

        if (!isMounted) {
          return;
        }

        setUser(resolved.user);
        setAccessToken(resolved.accessToken);
        setError(null);
      } catch (bootstrapError) {
        clearTokens();

        if (isMounted) {
          setUser(null);
          setAccessToken(null);
          setError(
            bootstrapError instanceof Error
              ? bootstrapError.message
              : "No se pudo restaurar la sesión",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);

    const tokens = await loginRequest({ username, password });
    const resolved = await resolveUserFromTokens(tokens.accessToken, tokens.refreshToken);

    storeTokens(resolved.accessToken, resolved.refreshToken);
    setUser(resolved.user);
    setAccessToken(resolved.accessToken);
  };

  const refreshSession = async () => {
    const storedTokens = getStoredTokens();

    if (!storedTokens.accessToken || !storedTokens.refreshToken) {
      throw new Error("No hay una sesión para refrescar");
    }

    const refreshedTokens = await refreshRequest(storedTokens.refreshToken);
    const resolved = await resolveUserFromTokens(
      refreshedTokens.accessToken,
      refreshedTokens.refreshToken,
    );

    storeTokens(resolved.accessToken, resolved.refreshToken);
    setUser(resolved.user);
    setAccessToken(resolved.accessToken);
  };

  const logout = async () => {
    const storedTokens = getStoredTokens();

    try {
      if (storedTokens.accessToken && !isJwtExpired(storedTokens.accessToken)) {
        await logoutRequest(storedTokens.accessToken);
      }
    } finally {
      clearTokens();
      setUser(null);
      setAccessToken(null);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        loading,
        error,
        accessToken,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
}
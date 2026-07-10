import type {
  AuthUser,
  JwtAuthPayload,
  LoginRequest,
  TokenResponse,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function parseErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };

    return payload.message ?? payload.error ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function base64UrlToJson<T>(value: string): T {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  return JSON.parse(atob(padded)) as T;
}

export function decodeJwtPayload(token: string) {
  const [, payload] = token.split(".");

  if (!payload) {
    throw new Error("Token JWT inválido");
  }

  return base64UrlToJson<JwtAuthPayload>(payload);
}

export function isJwtExpired(token: string) {
  const payload = decodeJwtPayload(token);
  return payload.exp * 1000 <= Date.now();
}

export async function loginRequest(credentials: LoginRequest) {
  return requestJson<TokenResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function refreshRequest(refreshToken: string) {
  return requestJson<TokenResponse>("/api/auth/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
}

export async function logoutRequest(accessToken: string) {
  return requestJson<void>("/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function getCurrentUser(userId: string, accessToken: string) {
  return requestJson<AuthUser>(`/api/v1/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

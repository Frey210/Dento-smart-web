import { apiRequest } from './apiClient';

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'researcher';
  is_active: boolean;
  created_at: string;
};

export async function login(email: string, password: string): Promise<TokenPair> {
  const tokens = await apiRequest<TokenPair>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    auth: false,
  });
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
  return tokens;
}

export async function register(name: string, email: string, password: string): Promise<TokenPair> {
  const tokens = await apiRequest<TokenPair>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role: 'doctor' }),
    auth: false,
  });
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
  return tokens;
}

export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    await apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export async function forgotPassword(email: string): Promise<{ reset_token?: string }> {
  return apiRequest<{ reset_token?: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
    auth: false,
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, new_password: newPassword }),
    auth: false,
  });
}

export async function getMe(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>('/auth/me');
}

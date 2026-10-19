import api from "@/api/axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await api.get<CurrentUser>("auth/me");
  return response.data;
}

export async function login(credentials: LoginCredentials) {
  const response = await api.post("auth/login", credentials);
  return response.data;
}

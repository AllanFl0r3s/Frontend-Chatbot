export interface Role {
  id: number;
  nombre: string;
  descripcion?: string | null;
  estado?: boolean;
}

export interface User {
  id: number;
  roleId: number;
  roleName?: string;
  nombre: string;
  usuario?: string | null;
  email: string;
  telefonoNumero?: string | null;
  estado: boolean;
  fechaRegistro: string;
  ultimoContacto?: string | null;
}

export interface UserInput {
  nombre: string;
  usuario: string;
  email: string;
  password?: string;
  roleId: number;
  telefonoNumero?: string | null;
  estado?: boolean;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}


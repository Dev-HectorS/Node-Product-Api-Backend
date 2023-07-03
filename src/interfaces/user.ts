export interface User {
  id?: number;
  role_id?: number | null;
  email: string;
  username: string;
  password: string;
  name: string;
  lastname: string;
  isActive: boolean;
  createdAt?: string;
}
// User.ts
export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
  role: string;
  birthdate: string;
  description?: string;
  avatar?: string;
}

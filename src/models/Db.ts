export interface NewPasswordsAttributes {
  id?: number;
  userId: number;
  token: string;
  status: boolean;
  expire: Date;
}

export interface UsersAttributes {
  id?: number;
  name: string;
  email: string;
  date_registration: Date;
  password: string;
}
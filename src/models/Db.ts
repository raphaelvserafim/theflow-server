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

export interface FlowAttributes {
  id?: number;
  userId: number;
  code: string;
  name: string;
}
export interface FlowNodesAttributes {
  id?: number;
  flowId: number;
  position_x: number;
  position_y: number;
  type: string;
  data: string;
}

export interface FlowEdgesAttributes {
  id?: number;
  flowId: number;
  source: number;
  target: number;
}
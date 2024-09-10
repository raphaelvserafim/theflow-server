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
  api_key_gpt?: string;
  date_creation: Date;
}
export interface FlowNodesAttributes {
  id: string;
  flowId: number;
  position_x: number;
  position_y: number;
  type: string;
  date_time_created: Date;
  text_content?: string;
  file_content?: any;
  save_answer?: boolean;
}

export interface FlowEdgesAttributes {
  id?: number;
  flowId: number;
  source: string;
  target: string;
}
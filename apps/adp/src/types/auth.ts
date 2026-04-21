export interface LoginCommand {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  expiresAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  department: string;
  position: string;
}

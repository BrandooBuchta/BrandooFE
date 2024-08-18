export interface SignInResponse {
  token: Token;
  user: User;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface Token {
  authToken: string;
  expiresAt: string;
  userId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  name: string;
  email: string;
  type: UserType;
  id: string;
  webUrl: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  contactEmail: string;
  contactPhone: string;
  registrationNo: string;
}

export enum UserType {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}

export interface ResetPasswordCodeVerificationBody {
  email: string;
  code: string;
}

export interface ResetPasswordFinishBody {
  email: string;
  code: string;
  password: string;
}

export interface UserFormInfo {
  contactEmail: string;
  contactPhone: string;
  registrationNo: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  security: Security;
  user: User;
}

export interface Security {
  privateKey: string;
  token: Token;
}

export interface Token {
  authToken: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  contactEmail: any;
  contactPhone: any;
  registrationNo: any;
  name: string;
  email: string;
  isVerified: boolean;
  type: string;
  webUrl: string;
  createdAt: string;
  updatedAt: string;
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

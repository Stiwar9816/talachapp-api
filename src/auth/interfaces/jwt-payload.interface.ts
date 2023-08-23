export interface JwtPayload {
  id: string;
  roles: string[];
  fullName: string;
  iat: number;
  exp: number;
}

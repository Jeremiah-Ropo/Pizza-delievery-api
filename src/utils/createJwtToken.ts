import jwt from 'jsonwebtoken';

export type JwtPayload = {
  id: string;
  contact?: string;
  role?: string;
};

export const createUserJwtToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.USER_JWT_SECRET!, {
    expiresIn: 172800,
  });
};

export const createStaffJwtToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.STAFF_JWT_SECRET!, {
    expiresIn: 172800,
  });
};

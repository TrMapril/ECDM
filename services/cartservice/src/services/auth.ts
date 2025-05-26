import { verifyToken, CustomJwtPayload } from '../helpers/jwt';

export const verifyAuth = (token: string): CustomJwtPayload => {
  try {
    return verifyToken(token);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
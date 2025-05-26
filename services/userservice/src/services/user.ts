import { findUserById } from '../models/user';

export const getUserProfile = async (userId: number) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
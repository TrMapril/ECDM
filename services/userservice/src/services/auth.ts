import { pool } from '../helpers/init_postgres';
import bcrypt from 'bcryptjs';
import { generateToken } from '../helpers/jwt';

export const register = async (email: string, password: string, role: string = 'customer') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
    [email, hashedPassword, role]
  );
  return result.rows[0];
};

export const login = async (email: string, password: string) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) throw new Error('User not found');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error('Invalid password');

  const token = generateToken({ id: user.id, role: user.role });
  return { user, token };
};
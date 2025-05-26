import { pool } from '../helpers/init_postgres';

export interface User {
  id: number;
  email: string;
  password: string;
  role: string;
  created_at: Date;
}

export const createUser = async (email: string, password: string, role: string): Promise<User> => {
  const result = await pool.query(
    'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
    [email, password, role]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};
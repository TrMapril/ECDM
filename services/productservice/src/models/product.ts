import { pool } from '../helpers/init_postgres';

export interface Product {
  id: number;
  name: string;
  category: string;
  publisher: string;
  price: number;
  created_at: Date;
}

export const createProduct = async (name: string, category: string, publisher: string, price: number): Promise<Product> => {
  const result = await pool.query(
    'INSERT INTO products (name, category, publisher, price) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, category, publisher, price]
  );
  return result.rows[0];
};

export const findProductById = async (id: number): Promise<Product | null> => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const result = await pool.query('SELECT * FROM products');
  return result.rows;
};

export const updateProduct = async (id: number, name: string, category: string, publisher: string, price: number): Promise<Product | null> => {
  const result = await pool.query(
    'UPDATE products SET name = $1, category = $2, publisher = $3, price = $4 WHERE id = $5 RETURNING *',
    [name, category, publisher, price, id]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return result.rows.length > 0;
};
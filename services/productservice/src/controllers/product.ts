import { Request, Response } from 'express';
import { getProductByIdService, getAllProductsService, createProductService, updateProductService, deleteProductService } from '../services/product';
import { verifyAuth, CustomJwtPayload } from '../services/auth'; // Import CustomJwtPayload từ services/auth

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProductsService();
    res.json({ products: products || [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await getProductByIdService(id);
    res.json({ product });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, publisher, price } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = verifyAuth(token) as CustomJwtPayload; // Ép kiểu rõ ràng
    if (decoded.role !== 'admin') throw new Error('Admin access required');

    const product = await createProductService(name, category, publisher, price);
    res.status(201).json({ message: 'Product created', product });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, publisher, price } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = verifyAuth(token) as CustomJwtPayload; // Ép kiểu rõ ràng
    if (decoded.role !== 'admin') throw new Error('Admin access required');

    const product = await updateProductService(id, name, category, publisher, price);
    res.json({ message: 'Product updated', product });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = verifyAuth(token) as CustomJwtPayload; // Ép kiểu rõ ràng
    if (decoded.role !== 'admin') throw new Error('Admin access required');

    const success = await deleteProductService(id);
    res.json({ message: 'Product deleted', success });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};
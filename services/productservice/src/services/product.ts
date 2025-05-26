import { createProduct, findProductById, getAllProducts, updateProduct, deleteProduct } from '../models/product';

export const createProductService = async (name: string, category: string, publisher: string, price: number) => {
  return await createProduct(name, category, publisher, price);
};

export const getProductByIdService = async (id: number) => {
  const product = await findProductById(id);
  if (!product) throw new Error('Product not found');
  return product;
};

export const getAllProductsService = async () => {
  try {
    const products = await getAllProducts();
    return products || []; // Đảm bảo trả về mảng rỗng nếu products là undefined
  } catch (error) {
    console.error('Error in getAllProductsService:', error);
    throw new Error('Failed to fetch products from database');
  }
};

export const updateProductService = async (id: number, name: string, category: string, publisher: string, price: number) => {
  const product = await updateProduct(id, name, category, publisher, price);
  if (!product) throw new Error('Product not found');
  return product;
};

export const deleteProductService = async (id: number) => {
  const success = await deleteProduct(id);
  if (!success) throw new Error('Product not found');
  return success;
};
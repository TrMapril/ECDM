import { Request, Response } from 'express';
import { addToCartService, getCartService, updateCartItemService, removeFromCartService, clearCartService } from '../services/cart';

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body;
    const cartItem = await addToCartService(userId, productId, quantity);
    res.status(201).json({ message: 'Item added to cart', cartItem });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const cart = await getCartService(userId);
    res.json({ cart });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;
    const cartItem = await updateCartItemService(userId, productId, quantity);
    res.json({ message: 'Cart item updated', cartItem });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const productId = parseInt(req.params.productId);
    const success = await removeFromCartService(userId, productId);
    res.json({ message: 'Item removed from cart', success });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const success = await clearCartService(userId);
    res.json({ message: 'Cart cleared', success });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
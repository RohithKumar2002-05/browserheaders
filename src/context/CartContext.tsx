'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';

type CartItem = {
  _key: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    sizes: string[];
    colors: string[];
  };
  quantity: number;
  color: string;
  size: string;
};

type CartContextType = {
  items: CartItem[];
  cartId: string | null;
  userId: string;
  addToCart: (productId: string, quantity: number, color: string, size: string) => Promise<void>;
  updateCartItem: (itemKey: string, quantity: number) => Promise<void>;
  removeCartItem: (itemKey: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();

  // Update userId when user signs in/out
  useEffect(() => {
    if (isSignedIn && user?.id) {
      // Get anonymous cart before switching to user cart
      const anonymousUserId = localStorage.getItem('anonymousUserId');
      const anonymousCartKey = `cart_${anonymousUserId}`;
      const anonymousCart = localStorage.getItem(anonymousCartKey);
      
      setUserId(user.id);
      
      // Merge anonymous cart with user cart if exists
      if (anonymousCart && anonymousUserId) {
        const parsedAnonymousCart = JSON.parse(anonymousCart);
        const anonymousItems = parsedAnonymousCart.items || [];
        
        if (anonymousItems.length > 0) {
          // Get existing user cart
          const userCartKey = `cart_${user.id}`;
          const userCart = localStorage.getItem(userCartKey);
          const existingUserItems = userCart ? JSON.parse(userCart).items || [] : [];
          
          // Merge items (avoid duplicates)
          const mergedItems = [...existingUserItems, ...anonymousItems];
          
          // Save merged cart to user cart
          localStorage.setItem(userCartKey, JSON.stringify({
            cartId: uuidv4(),
            items: mergedItems
          }));
          
          // Clear anonymous cart
          localStorage.removeItem(anonymousCartKey);
        }
      }
    } else {
      // Use anonymous user ID for non-signed in users
      const storedUserId = localStorage.getItem('anonymousUserId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const newUserId = uuidv4();
        localStorage.setItem('anonymousUserId', newUserId);
        setUserId(newUserId);
      }
    }
  }, [isSignedIn, user]);

  // Fetch cart when userId changes
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      // Get cart from user-specific local storage
      const cartKey = `cart_${userId}`;
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart.items || []);
        setCartId(parsedCart.cartId || null);
      } else {
        // Clear cart if no stored cart for this user
        setItems([]);
        setCartId(null);
      }
    } catch (err) {
      setError('Failed to fetch cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number, color: string, size: string) => {
    try {
      setIsLoading(true);
      
      // Get product from Sanity
      let productToAdd;
      try {
        const { fetchProducts } = await import('@/lib/fetchproducts');
        const allProducts = await fetchProducts('All');
        productToAdd = allProducts?.find(p => p._id === productId || String(p.id) === productId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.log('Could not fetch products for cart');
      }
      
      if (!productToAdd) {
        throw new Error('Product not found');
      }
      
      // Create a new cart item
      const newItem = {
        _key: uuidv4(),
        product: {
          _id: productId,
          name: productToAdd.name,
          price: productToAdd.price,
          imageUrl: productToAdd.imageUrl || productToAdd.image,
          sizes: productToAdd.sizes,
          colors: productToAdd.colors
        },
        quantity,
        color,
        size
      };
      
      // Update local state
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      
      // Save to user-specific local storage
      const cartKey = `cart_${userId}`;
      localStorage.setItem(cartKey, JSON.stringify({
        cartId: cartId || uuidv4(),
        items: updatedItems
      }));
      
    } catch (err) {
      setError('Failed to add item to cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemKey: string, quantity: number) => {
    try {
      setIsLoading(true);
      
      // Update local state
      let updatedItems;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        updatedItems = items.filter(item => item._key !== itemKey);
      } else {
        // Update quantity if item exists
        updatedItems = items.map(item => 
          item._key === itemKey ? { ...item, quantity } : item
        );
      }
      
      setItems(updatedItems);
      
      // Save to user-specific local storage
      const cartKey = `cart_${userId}`;
      localStorage.setItem(cartKey, JSON.stringify({
        cartId: cartId || uuidv4(),
        items: updatedItems
      }));
      
    } catch (err) {
      setError('Failed to update cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartItem = async (itemKey: string) => {
    await updateCartItem(itemKey, 0); // Setting quantity to 0 removes the item
  };

  return (
    <CartContext.Provider value={{
      items,
      cartId,
      userId,
      addToCart,
      updateCartItem,
      removeCartItem,
      isLoading,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

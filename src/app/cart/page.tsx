'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useUser, SignInButton } from '@clerk/nextjs'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const { items, updateCartItem, removeCartItem, isLoading } = useCart();
  const [processingItemKey, setProcessingItemKey] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate cart totals
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15 : 0; // Example shipping cost
  const total = subtotal + shipping;

  const handleQuantityChange = async (itemKey: string, newQuantity: number) => {
    setProcessingItemKey(itemKey);
    await updateCartItem(itemKey, newQuantity);
    setProcessingItemKey(null);
  };

  const handleRemoveItem = async (itemKey: string) => {
    setProcessingItemKey(itemKey);
    await removeCartItem(itemKey);
    setProcessingItemKey(null);
  };

  const { isSignedIn, user } = useUser()

  const handleCheckout = async () => {
    if (!isSignedIn || items.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          userId: user?.id,
        }),
      });
      
      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe error:', error);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };


  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your <span className="text-primary">Cart</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Review your items and proceed to checkout.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {items.map((item) => (
                <motion.div
                  key={item._key}
                  className="bg-gray-900 rounded-lg mb-4 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/4 aspect-square relative">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                      />
                    </div>
                    <div className="sm:w-3/4 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{item.product.name}</h3>
                        <div className="text-primary font-bold mt-1">₹{item.product.price.toFixed(2)}</div>
                        <div className="mt-2 text-sm text-gray-400">
                          <span className="mr-4">Color: {item.color}</span>
                          <span>Size: {item.size}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleQuantityChange(item._key, Math.max(1, item.quantity - 1))}
                            disabled={isLoading || processingItemKey === item._key}
                            className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center rounded-l-md hover:bg-gray-700"
                          >
                            -
                          </button>
                          <div className="w-12 h-8 bg-gray-800 text-white flex items-center justify-center border-x border-gray-700">
                            {processingItemKey === item._key ? '...' : item.quantity}
                          </div>
                          <button 
                            onClick={() => handleQuantityChange(item._key, item.quantity + 1)}
                            disabled={isLoading || processingItemKey === item._key}
                            className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center rounded-r-md hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item._key)}
                          disabled={isLoading || processingItemKey === item._key}
                          className="text-gray-400 hover:text-primary transition-colors"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <Link href="/products" className="text-primary hover:underline flex items-center mt-6">
                <FiArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Order <span className='text-primary'> Summary </span></h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold text-white">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* <button className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  <FiShoppingBag />
                  Proceed to Checkout
                </button> */}
                {isSignedIn ? (
  <button 
    onClick={handleCheckout}
    disabled={isCheckingOut || items.length === 0}
    className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
  >
    <FiShoppingBag />
    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
  </button>
) : (
  <SignInButton mode="modal">
    <button className="btn-primary w-full py-3 flex items-center justify-center gap-2 cursor-pointer">
      <FiShoppingBag />
      Sign In to Checkout
    </button>
  </SignInButton>
)}

              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <FiShoppingBag className="mx-auto text-white/100 mb-4 mt-[-38]" size={164} />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              <FiArrowLeft />
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
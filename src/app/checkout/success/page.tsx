'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { useUser } from '@clerk/nextjs';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { user } = useUser();

  useEffect(() => {
    if (sessionId && user?.id) {
      // Get cart items before clearing
      const cartKey = `cart_${user.id}`;
      const storedCart = localStorage.getItem(cartKey);
      
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        const items = parsedCart.items || [];
        
        // Calculate total
        const subtotal = items.reduce((total: number, item: { product: { price: number }; quantity: number }) => total + (item.product.price * item.quantity), 0);
        const total = subtotal + 15; // Add shipping
        
        // Save order to history
        saveOrder(user.id, sessionId, items, total);
      }
      
      // Clear cart from localStorage after successful payment
      localStorage.removeItem(cartKey);
    }
  }, [sessionId, user]);
  
  const saveOrder = async (userId: string, sessionId: string, items: Array<{ product: { price: number }; quantity: number }>, total: number) => {
    try {
      console.log('Saving order:', { userId, sessionId, items, total });
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, sessionId, items, total })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return;
      }
      
      const result = await response.json();
      console.log('Order save result:', result);
      
      if (result.success) {
        console.log('Order saved successfully to Sanity!');
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <FiCheckCircle className="mx-auto text-green-500 mb-4" size={80} />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Payment <span className="text-primary">Successful!</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Order Confirmation</h2>
            <p className="text-gray-300 mb-2">
              Order ID: <span className="text-primary">{sessionId?.slice(-8)?.toUpperCase() || 'N/A'}</span>
            </p>
            <p className="text-gray-300">
              You will receive an email confirmation shortly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <FiArrowLeft />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-16 bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
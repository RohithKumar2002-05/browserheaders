'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPackage, FiArrowLeft } from 'react-icons/fi';

export default function OrdersPage() {
  const { user, isSignedIn } = useUser();
  const [orders, setOrders] = useState<Array<{ id: string; orderId: string; createdAt: string; total: number; status: string; items: Array<{ product: { name: string; imageUrl: string; price: number }; color: string; size: string; quantity: number }> }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      setOrders([]); // Clear previous orders
      setLoading(true);
      fetchOrders();
    } else {
      setOrders([]); // Clear orders when not signed in
      setLoading(false);
    }
  }, [isSignedIn, user?.id]);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders for user:', user?.id);
      const response = await fetch(`/api/orders?userId=${user?.id}`);
      const data = await response.json();
      console.log('Received orders:', data.orders);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400 mb-8">You need to be signed in to view your orders.</p>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your <span className="text-primary">Orders</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track your order history and view details of your purchases.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="bg-gray-900 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Order #{(order.orderId || order.id || 'N/A').slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{order.total.toFixed(2)}</p>
                    <p className="text-green-500 text-sm">{order.status}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {order.items.map((item, itemIndex: number) => (
                    <div key={itemIndex} className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-white font-medium">{item.product.name}</h4>
                        <p className="text-gray-400 text-sm">
                          Color: {item.color} | Size: {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-primary font-bold">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiPackage className="mx-auto text-gray-600 mb-4" size={80} />
            <h2 className="text-2xl font-semibold text-white mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-8">You haven&apos;t placed any orders yet.</p>
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
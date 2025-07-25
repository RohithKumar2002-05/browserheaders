'use client';

import { useState } from 'react';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPackage, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

// Mock data for orders
const orders = [
  {
    id: 'ORD-12345',
    date: '2023-07-15',
    total: 549.98,
    status: 'Delivered',
    items: [
      {
        id: 1,
        name: 'Royal Silk Shirt',
        price: 299.99,
        image: '/images/product1.jpg',
        quantity: 1,
        size: 'M',
        color: 'White',
      },
      {
        id: 2,
        name: 'Premium Denim Jeans',
        price: 249.99,
        image: '/images/product3.jpg',
        quantity: 1,
        size: '32',
        color: 'Blue',
      },
    ],
    tracking: {
      number: 'TRK-9876543',
      carrier: 'Royal Express',
      events: [
        { date: '2023-07-15', status: 'Delivered', location: 'Your address' },
        { date: '2023-07-14', status: 'Out for delivery', location: 'Local distribution center' },
        { date: '2023-07-13', status: 'Arrived at sorting facility', location: 'Regional hub' },
        { date: '2023-07-12', status: 'Shipped', location: 'Warehouse' },
        { date: '2023-07-11', status: 'Order processed', location: 'Fulfillment center' },
      ],
    },
  },
  {
    id: 'ORD-12346',
    date: '2023-07-28',
    total: 499.99,
    status: 'In Transit',
    items: [
      {
        id: 2,
        name: 'Velvet Evening Jacket',
        price: 499.99,
        image: '/images/product2.jpg',
        quantity: 1,
        size: 'L',
        color: 'Burgundy',
      },
    ],
    tracking: {
      number: 'TRK-9876544',
      carrier: 'Royal Express',
      events: [
        { date: '2023-07-28', status: 'In transit', location: 'Regional hub' },
        { date: '2023-07-27', status: 'Shipped', location: 'Warehouse' },
        { date: '2023-07-26', status: 'Order processed', location: 'Fulfillment center' },
      ],
    },
  },
  {
    id: 'ORD-12347',
    date: '2023-08-05',
    total: 349.99,
    status: 'Processing',
    items: [
      {
        id: 4,
        name: 'Cashmere Sweater',
        price: 349.99,
        image: '/images/product4.jpg',
        quantity: 1,
        size: 'M',
        color: 'Gray',
      },
    ],
    tracking: null,
  },
];

export default function MyOrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500';
      case 'In Transit':
        return 'bg-blue-500';
      case 'Processing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My <span className="text-primary">Orders</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Track and manage your orders with Royal Attire.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search orders by ID or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                className="bg-gray-900 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {/* Order Header */}
                <div 
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                      <span className="font-semibold text-white">{order.id}</span>
                    </div>
                    <div className="text-gray-400">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-white font-semibold">${order.total.toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{order.status}</span>
                      {expandedOrder === order.id ? (
                        <FiChevronUp className="text-gray-400" />
                      ) : (
                        <FiChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order Details */}
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-800"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                      
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-800 rounded-md relative overflow-hidden flex-shrink-0">
                              <div className="w-full h-full bg-gray-800 animate-pulse">
                                {/* Placeholder for image */}
                              </div>
                            </div>
                            
                            <div className="flex-grow">
                              <h4 className="text-white font-medium">{item.name}</h4>
                              <div className="text-sm text-gray-400 mt-1">
                                Size: {item.size} | Color: {item.color}
                              </div>
                              <div className="flex justify-between mt-2">
                                <span className="text-gray-400">Qty: {item.quantity}</span>
                                <span className="text-primary font-semibold">${item.price.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Tracking Information */}
                      {order.tracking ? (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-white mb-4">Tracking Information</h3>
                          
                          <div className="bg-gray-800 rounded-md p-4 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                <div className="text-sm text-gray-400">Tracking Number:</div>
                                <div className="text-white font-mono">{order.tracking.number}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-400">Carrier:</div>
                                <div className="text-white">{order.tracking.carrier}</div>
                              </div>
                              <Link 
                                href="#" 
                                className="text-primary hover:underline text-sm"
                              >
                                Track on carrier website
                              </Link>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                            
                            <div className="space-y-6">
                              {order.tracking.events.map((event, i) => (
                                <div key={i} className="flex gap-4 relative">
                                  <div className={`w-4 h-4 rounded-full mt-1 z-10 ${
                                    i === 0 ? 'bg-primary' : 'bg-gray-700'
                                  }`}></div>
                                  
                                  <div className="flex-grow">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                                      <div className="font-medium text-white">{event.status}</div>
                                      <div className="text-sm text-gray-400">
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                        })}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">{event.location}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-8 bg-gray-800 rounded-md p-4 text-center">
                          <FiPackage className="mx-auto text-gray-400 text-3xl mb-2" />
                          <p className="text-gray-400">
                            Your order is being processed. Tracking information will be available once shipped.
                          </p>
                        </div>
                      )}
                      
                      {/* Order Actions */}
                      <div className="mt-8 flex flex-wrap gap-4">
                        <button className="btn-primary">
                          Contact Support
                        </button>
                        {order.status === 'Delivered' && (
                          <button className="btn-secondary">
                            Return Items
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="text-center py-16 bg-gray-900 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              {searchQuery ? (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-4">No orders found</h2>
                  <p className="text-gray-400 mb-8">
                    We couldn&apos;t find any orders matching &quot;{searchQuery}&quot;.
                  </p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="btn-primary"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-4">No orders yet</h2>
                  <p className="text-gray-400 mb-8">
                    You haven&apos;t placed any orders with us yet.
                  </p>
                  <Link href="/products" className="btn-primary">
                    Start Shopping
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
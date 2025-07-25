'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiArrowRight } from 'react-icons/fi';

// Mock data for offers
const offers = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Get up to 40% off on our summer collection. Limited time offer.',
    image: '/images/of1.jpg',
    discount: '40%',
    endDate: '2023-08-31',
    code: 'SUMMER40',
  },
  {
    id: 2,
    title: 'New Customer Special',
    description: 'First-time customers get 15% off their first purchase.',
    image: '/images/of2.jpg',
    discount: '15%',
    endDate: null,
    code: 'WELCOME15',
  },
  {
    id: 3,
    title: 'Premium Collection',
    description: 'Buy any two items from our premium collection and get one free.',
    image: '/images/of3.jpg',
    discount: 'Buy 2 Get 1 Free',
    endDate: '2023-09-15',
    code: 'PREMIUM3',
  },
];

// Mock data for featured products on sale
const saleProducts = [
  {
    id: 1,
    name: 'Royal Silk Wear',
    originalPrice: 299.99,
    salePrice: 179.99,
    image: '/images/of4.jpg',
    category: 'Shirts',
    discount: '40%',
  },
  {
    id: 2,
    name: 'Casual T-Shirts',
    originalPrice: 499.99,
    salePrice: 349.99,
    image: '/images/of5.jpg',
    category: 'Jackets',
    discount: '30%',
  },
  {
    id: 3,
    name: 'Premium Denim Wear',
    originalPrice: 249.99,
    salePrice: 174.99,
    image: '/images/of6.jpg',
    category: 'Pants',
    discount: '30%',
  },
  {
    id: 4,
    name: 'Winter Wools',
    originalPrice: 349.99,
    salePrice: 244.99,
    image: '/images/of7.jpg',
    category: 'Sweaters',
    discount: '30%',
  },
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };
  
  // Calculate days remaining for offers
  const calculateDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null;
    
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
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
            Special <span className="text-primary">Offers</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Discover our exclusive deals and promotions on luxury clothing and accessories.
          </motion.p>
        </div>

        {/* Current Offers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Current <span className='text-primary'> Promotions</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => {
              const daysRemaining = calculateDaysRemaining(offer.endDate);
              
              return (
                <motion.div
                  key={offer.id}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden flex flex-col justify-between h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="relative aspect-[16/9]">
                    <div className="w-full h-full bg-gray-800">
                      <Image
                        src={offer.image}
                        alt={offer.title}
                        layout="fill"
                        objectFit="cover"
                        className="absolute inset-0 z-0 "
                      />
                    </div>
                    <div className="absolute top-0 right-0 bg-primary text-black font-bold px-4 py-2">
                      {offer.discount} OFF
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
                    <p className="text-gray-400 mb-4">{offer.description}</p>
                    
                    {daysRemaining !== null && (
                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <FiClock className="mr-2" />
                        {daysRemaining > 0 ? (
                          <span>Ends in {daysRemaining} days</span>
                        ) : (
                          <span>Offer expired</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-6 min-h-[80px]">
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">Use code:</div>
                        <div className="bg-gray-700 text-white px-3 py-2 rounded font-mono self-end items-end">
                          {offer.code}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(offer.code)}
                        className={`ml-4 mt-6 px-4 py-2 rounded cursor-pointer ${
                          copiedCode === offer.code
                            ? 'bg-green-600 text-white'
                            : 'bg-primary text-black hover:bg-primary/90'
                        } transition-colors`}
                      >
                        {copiedCode === offer.code ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Products on Sale */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Featured <span className='text-primary'>Sale Items</span></h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-gray-900 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative aspect-[3/4]">
                  <div className="w-full h-full bg-gray-800 ">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0 z-0 "
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-primary text-black text-xs font-bold px-2 py-1 rounded">
                    {product.discount} OFF
                  </div>
                  <div 
                    className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/60 z-20 transition-opacity duration-300 ${
                      hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                     <Link
                  href="/products"
                  className="bg-white text-black p-3 rounded-full hover:bg-primary transition-colors"
                >
                  <FiArrowRight />
                </Link>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="text-xs text-gray-400 mb-1">{product.category}</div>
                  <h3 className="font-semibold text-white mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">${product.salePrice.toFixed(2)}</span>
                    <span className="text-gray-400 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/products" 
              className="btn-primary inline-flex items-center gap-2 group"
            >
              View All Sale Items
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Subscribe for Exclusive Offers
            </h2>
            <p className="text-gray-400 mb-8">
              Be the first to know about our special promotions, new arrivals, and exclusive events.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
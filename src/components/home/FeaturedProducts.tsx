'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { fetchProducts } from '@/lib/fetchproducts';

// Import Product type
import { Product } from '@/types/product';

// Mock data for featured products
const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Royal Silk Shirt',
    price: 299.99,
    image: '/images/pf-1.jpg',
    category: 'Shirts',
    isNew: true,
    colors: ['White', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Luxurious silk shirt for formal occasions.',
    material: '100% Silk',
    care: 'Dry clean only',
    features: ['Premium fabric', 'Mother-of-pearl buttons'],
    stock: 10,
  },
  {
    id: 2,
    name: 'Velvet Evening Jacket',
    price: 499.99,
    image: '/images/pf-2.jpg',
    category: 'Jackets',
    isNew: false,
    colors: ['Black', 'Navy', 'Burgundy'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Elegant velvet jacket for special occasions.',
    material: '100% Cotton Velvet',
    care: 'Dry clean only',
    features: ['Satin lining', 'Hand-stitched details'],
    stock: 8,
  },
  {
    id: 3,
    name: 'Premium Denim Jeans',
    price: 249.99,
    image: '/images/pf-3.jpg',
    category: 'Pants',
    isNew: true,
    colors: ['Blue', 'Black', 'Gray'],
    sizes: ['30', '32', '34', '36'],
    description: 'Premium denim jeans with perfect fit.',
    material: '98% Cotton, 2% Elastane',
    care: 'Machine wash cold',
    features: ['Selvedge denim', 'Reinforced stitching'],
    stock: 15,
  },
  {
    id: 4,
    name: 'Cashmere Sweater',
    price: 349.99,
    image: '/images/pf-4.jpg',
    category: 'Sweaters',
    isNew: false,
    colors: ['Gray', 'Black', 'Navy', 'Cream'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Luxuriously soft cashmere sweater.',
    material: '100% Cashmere',
    care: 'Hand wash cold or dry clean',
    features: ['Premium cashmere', 'Ribbed collar and cuffs'],
    stock: 12,
  },
];

const FeaturedProducts = () => {
  const [hoveredProduct, setHoveredProduct] = useState<string | number | null>(null);
  const [products, setProducts] = useState<Product[]>(featuredProducts);
  const [loading, setLoading] = useState(false);
  
  // Fetch products from Sanity
  useEffect(() => {
    async function loadFeaturedProducts() {
      setLoading(true);
      try {
        console.log('Fetching products from Sanity...');
        const fetchedProducts = await fetchProducts('All');
        console.log('Featured products loaded:', fetchedProducts);
        
        if (fetchedProducts && fetchedProducts.length > 0) {
          console.log('Using Sanity products');
          // Take only the first 4 products
          setProducts(fetchedProducts.slice(0, 4));
        } else {
          console.log('No Sanity products found, using mock data');
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
        console.log('Falling back to mock data due to error');
      } finally {
        setLoading(false);
      }
    }
    
    loadFeaturedProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading ? 
        // Loading placeholders
        [...Array(4)].map((_, index) => (
          <div key={index} className="card overflow-hidden bg-gray-900 rounded-lg animate-pulse">
            <div className="aspect-[3/4] bg-gray-800"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-800 rounded w-1/3 mb-2"></div>
              <div className="h-5 bg-gray-800 rounded w-2/3 mb-2"></div>
              <div className="h-5 bg-gray-800 rounded w-1/4"></div>
            </div>
          </div>
        ))
      : 
        products.map((product, index) => (
          <motion.div
            key={product._id || product.id || `product-${index}`}
            className="card overflow-hidden bg-gray-900 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseEnter={() => setHoveredProduct(product._id || product.id || 0)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <div className="absolute inset-0 bg-black/20 z-10" />
              <div className="w-full h-full bg-gray-800">
                <Image
                  src={product.imageUrl || product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  className="brightness-100"
                />
                
              </div>
              {product.isNew && (
                <div className="absolute top-2 left-2 z-20 bg-primary text-black text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              )}
              <div 
                className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/60 z-20 transition-opacity duration-300 ${
                  hoveredProduct === (product._id || product.id || 0) ? 'opacity-100' : 'opacity-0'
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
              <div className="text-xs text-gray-400 mb-1">{typeof product.category === 'object' ? product.category.name : product.category}</div>
              <h3 className="font-semibold text-white mb-1">{product.name}</h3>
              <div className="text-primary font-bold">₹{product.price.toFixed(2)}</div>
            </div>
          </motion.div>
        ))
      }
    </div>
  );
};

export default FeaturedProducts;
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiShoppingCart, FiHeart, FiX, FiCheck } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { fetchProducts } from '@/lib/fetchproducts';
import { Product } from '@/types/product';

// Mock data for products


// Categories for filtering
const categories = [
  'All',
  'Shirts',
  'Jackets',
  'Pants',
  'Sweaters',
  'Footwear',
  'Accessories',
  'Outerwear',
];
export default function ProductsPage() {
  const { addToCart, isLoading: isCartLoading } = useCart();
  const [viewMode,] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
 
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [sanityProducts, setSanityProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Sanity
  // useEffect(() => {
  //   async function loadProducts() {
  //     setLoading(true);
  //     try {
  //       const fetchedProducts = await fetchProducts(selectedCategory);
  //       console.log('Products loaded:', fetchedProducts);
  //       if (fetchedProducts && fetchedProducts.length > 0) {
  //         setSanityProducts(fetchedProducts);
  //       }
  //     } catch (error) {
  //       console.error('Error loading products:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
    
  //   loadProducts();
  // }, [selectedCategory]);

  useEffect(() => {
  async function loadProducts() {
    setLoading(true);
    try {
      const fetchedProducts = await fetchProducts(selectedCategory);
      console.log('Products loaded:', fetchedProducts);

      // Set to fetched products or empty if none
      setSanityProducts(fetchedProducts || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setSanityProducts([]); // Clear on error
    } finally {
      setLoading(false);
    }
  }

  loadProducts();
}, [selectedCategory]);


  // // // Use Sanity products if available, otherwise use mock data
  //  const filteredProducts = sanityProducts.length > 0 ? sanityProducts : (
  //    selectedCategory === 'All' ? products : products.filter(product => product.category === selectedCategory)
  //  );

  const filteredProducts = sanityProducts

  

  
  // Make products available globally for the cart context
  // useEffect(() => {
  //   // @ts-expect-error - Adding to window for cart context to access
  //   window.mockProducts = products;
  // }, []);
    
  // Handle product selection
  const handleProductClick = (productId: string) => {
    const product = filteredProducts.find(p => {
      // Handle string _id from Sanity
      if (p._id) return p._id === productId;
      // Handle number id from mock data by converting to string
      if (p.id) return String(p.id) === productId;
      return false;
    });
    
    if (product) {
      setSelectedProduct(productId);
      // Handle comma-separated colors and sizes
      const firstColor = product.colors[0]?.includes(',') 
        ? product.colors[0].split(',')[0].trim() 
        : product.colors[0]?.trim() || '';
      const firstSize = product.sizes[0]?.includes(',') 
        ? product.sizes[0].split(',')[0].trim() 
        : product.sizes[0]?.trim() || '';
      
      setSelectedColor(firstColor);
      setSelectedSize(firstSize);
      setQuantity(1);
    }
  };
  
  // Close product detail modal
  const closeProductDetail = () => {
    setSelectedProduct(null);
  };
  
  // Get the selected product
  const getSelectedProduct = () => {
    return filteredProducts.find(product => {
      // Handle string _id from Sanity
      if (product._id) return product._id === selectedProduct;
      // Handle number id from mock data by converting to string
      if (product.id) return String(product.id) === selectedProduct;
      return false;
    });
  };
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (selectedProduct && selectedColor && selectedSize) {
      try {
        console.log('Adding to cart:', {
          productId: selectedProduct,
          quantity,
          color: selectedColor,
          size: selectedSize
        });
        await addToCart(selectedProduct, quantity, selectedColor, selectedSize);
        closeProductDetail();
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      alert('Please select both color and size before adding to cart');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-centre items-center">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-primary">Products</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our collection of luxury clothing and accessories, crafted with the finest materials and attention to detail.
          </p>
        </div>

        {/* Filters and Sort */}
        <div className='flex justify-center items-center'>
          <div className="flex flex-col md:flex-row  md:items-center mb-8 gap-4 ">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 text-white bg-gray-900 px-4 py-2 rounded-md md:hidden"
          >
            <FiFilter />
            Filters
          </button>

          <div className={`w-full md:w-auto bg-gray-900 p-4 rounded-md ${filtersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-primary text-black'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' ? 'bg-primary text-black' : 'bg-gray-800 text-white'
                }`}
                aria-label="Grid view"
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' ? 'bg-primary text-black' : 'bg-gray-800 text-white'
                }`}
                aria-label="List view"
              >
                <FiList />
              </button>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-800 text-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div> */}
        </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="text-center py-12 mt-2.5">
            <p className="text-gray-400 text-lg">Loading products...</p>
          </div>
        ) : (
          <div className= {`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
          {filteredProducts.map((product, index) => (
            
            
            <motion.div
              key={product._id || product.id}
              className={`card overflow-hidden bg-gray-900 rounded-lg cursor-pointer ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              onMouseEnter={() => setHoveredProduct(product._id ? product._id : product.id ? String(product.id) : null)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => handleProductClick(product._id || String(product.id))}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''} aspect-[3/4]`}>
                <div className="w-full h-full bg-gray-800">
                  <Image
                    src={product.imageUrl || product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="absolute inset-0 z-0 "
                  />
                </div>
                {product.isNew && (
                  <div className="absolute top-2 left-2 z-20 bg-primary text-black text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </div>
                )}
                <div 
                  className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/60 z-20 transition-opacity duration-300 ${
                    hoveredProduct === (product._id || String(product.id)) ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <button 
                    className="bg-white text-black p-3 rounded-full hover:bg-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      const prod = product;
                      addToCart(
                        prod._id || String(prod.id), 
                        1, 
                        prod.colors[0], 
                        prod.sizes[0]
                      );
                    }}
                  >
                    <FiShoppingCart />
                  </button>
                  
                </div>
              </div>
              
              <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                <div className="text-xs text-gray-400 mb-1">
                  {typeof product.category === 'object' && product.category?.name 
                    ? product.category.name 
                    : typeof product.category === 'string' 
                      ? product.category 
                      : 'Uncategorized'}
                </div>
                <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                <div className="text-primary font-bold mb-2">₹{product.price.toFixed(2)}</div>
                
                {viewMode === 'list' && (
                  <>
                    <div className="flex gap-2 mb-3">
                      {product.colors.map((color) => (
                        <span key={color} className="text-sm text-gray-400">{color}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 mb-4">
                      {product.sizes.map((size) => (
                        <span key={size} className="text-sm text-gray-400 border border-gray-700 px-2 py-1 rounded">{size}</span>
                      ))}
                    </div>
                    <button 
                      className="btn-primary w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(
                          product._id || String(product.id), 
                          1, 
                          product.colors[0], 
                          product.sizes[0]
                        );
                      }}
                    >
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}
     
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found in this category.</p>
          </div>
        )}
        
        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="relative bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close button */}
                <button
                  onClick={closeProductDetail}
                  className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </button>
                
                {getSelectedProduct() && (
                  <div className="flex flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="md:w-1/2 relative aspect-square">
                      <div className="w-full h-full bg-gray-800">
                        <Image
                          src={getSelectedProduct()?.imageUrl || getSelectedProduct()?.image || ''}
                          alt={getSelectedProduct()?.name || ''}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                          priority
                        />
                      </div>
                      {getSelectedProduct()?.isNew && (
                        <div className="absolute top-4 left-4 bg-primary text-black text-sm font-bold px-3 py-1 rounded">
                          NEW
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="md:w-1/2 p-6 md:p-8">
                      <div className="text-sm text-primary mb-2">
                        {(() => {
                          const product = getSelectedProduct();
                          if (!product) return '';
                          if (typeof product.category === 'object' && product.category && 'name' in product.category) {
                            return (product.category as { name: string }).name;
                          }
                          return typeof product.category === 'string' ? product.category : '';
                        })()}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{getSelectedProduct()?.name}</h2>
                      <div className="text-2xl text-primary font-bold mb-4">₹{getSelectedProduct()?.price.toFixed(2)}</div>
                      
                      <p className="text-gray-300 mb-6">{getSelectedProduct()?.description}</p>
                      
                      {/* Material & Care */}
                      <div className="mb-6">
                        <div className="text-white font-semibold mb-2">Material & Care</div>
                        <div className="text-gray-300 mb-1"><span className="text-primary">Material:</span> {getSelectedProduct()?.material}</div>
                        <div className="text-gray-300"><span className="text-primary">Care:</span> {getSelectedProduct()?.care}</div>
                      </div>
                      
                      {/* Features */}
                      <div className="mb-6">
                        <div className="text-white font-semibold mb-2">Features</div>
                        <ul className="text-gray-300 list-inside">
                          {getSelectedProduct()?.features.map((feature, index) => (
                            <li key={index} className="flex items-center mb-1">
                              <FiCheck className="text-primary mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Color Selection */}
<div className="mb-6">
  <div className="text-white font-semibold mb-2">Color</div>
  <div className="flex flex-wrap gap-2">
    {(() => {
      const product = getSelectedProduct();
      if (!product?.colors) return [];
      
      // Handle both array of strings and comma-separated strings
      const allColors = product.colors.flatMap((color: string) => {
        if (typeof color === 'string' && color.includes(',')) {
          return color.split(',').map(c => c.trim()).filter(c => c.length > 0);
        }
        return [color.toString().trim()];
      });
      
      // Remove duplicates
      const uniqueColors = [...new Set(allColors)];
      
      return uniqueColors.map((color: string) => {
        const isSelected = selectedColor === color;
        
        return (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`px-3 py-1 rounded border transition-colors duration-200 ${
              isSelected
                ? 'bg-primary text-black font-bold border-primary' 
                : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
            }`}
          >
            {color}
          </button>
        );
      });
    })()}
  </div>
</div>

                      
                      {/* Size Selection */}
                    <div className="mb-6">
  <div className="text-white font-semibold mb-2">Size</div>
  <div className="flex flex-wrap gap-2">
    {(() => {
      const product = getSelectedProduct();
      if (!product?.sizes) return [];
      
      // Handle both array of strings and comma-separated strings
      const allSizes = product.sizes.flatMap((size: string) => {
        if (typeof size === 'string' && size.includes(',')) {
          return size.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
        return [size.toString().trim()];
      });
      
      // Remove duplicates
      const uniqueSizes = [...new Set(allSizes)];
      
      return uniqueSizes.map((size: string) => {
        const isSelected = selectedSize === size;
        
        return (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`w-12 h-10 flex items-center justify-center rounded transition-colors duration-200 ${
              isSelected
                ? 'bg-primary text-black font-bold'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {size}
          </button>
        );
      });
    })()}
  </div>
</div>

                      
                      {/* Quantity */}
                      <div className="mb-6">
                        <div className="text-white font-semibold mb-2">Quantity</div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 bg-gray-800 text-white flex items-center justify-center rounded-l-md hover:bg-gray-700"
                          >
                            -
                          </button>
                          <div className="w-16 h-10 bg-gray-800 text-white flex items-center justify-center border-x border-gray-700">
                            {quantity}
                          </div>
                          <button 
                            onClick={() => setQuantity(Math.min((getSelectedProduct()?.stock || 10), quantity + 1))}
                            className="w-10 h-10 bg-gray-800 text-white flex items-center justify-center rounded-r-md hover:bg-gray-700"
                          >
                            +
                          </button>
                          <div className="ml-4 text-gray-400 text-sm">
                            {getSelectedProduct()?.stock || 0} items available
                          </div>
                        </div>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                          onClick={handleAddToCart}
                          disabled={isCartLoading}
                          >
                        {isCartLoading ? 'Adding...' : (
    <>
      <FiShoppingCart />
      Add to Cart
    </>
  )}
</button>
                        <button className="bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center">
                          <FiHeart className="mr-2" />
                          Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
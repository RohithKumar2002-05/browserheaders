'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Mock data for gallery images
const galleryImages = [
  {
    id: 1,
    src: '/images/g1.jpg',
    alt: 'Fashion Show 2023',
    category: 'Events',
    width: 800,
    height: 1200,
  },
  {
    id: 2,
    src: '/images/g7.jpg',
    alt: 'Summer Collection',
    category: 'Collections',
    width: 1200,
    height: 800,
  },
  {
    id: 3,
    src: '/images/g12.jpg',
    alt: 'Behind the Scenes',
    category: 'Behind the Scenes',
    width: 800,
    height: 800,
  },
  {
    id: 4,
    src: '/images/g8.jpg',
    alt: 'Winter Collection',
    category: 'Collections',
    width: 800,
    height: 1200,
  },
  {
    id: 5,
    src: '/images/g11.jpg',
    alt: 'Milan Fashion Week',
    category: 'Events',
    width: 1200,
    height: 800,
  },
  {
    id: 6,
    src: '/images/g5.jpg',
    alt: 'Design Studio',
    category: 'Behind the Scenes',
    width: 800,
    height: 800,
  },
  {
    id: 7,
    src: '/images/g3.jpg',
    alt: 'Spring Collection',
    category: 'Collections',
    width: 800,
    height: 1200,
  },
  {
    id: 8,
    src: '/images/g9.jpg',
    alt: 'Paris Fashion Show',
    category: 'Events',
    width: 1200,
    height: 800,
  },
  {
    id: 9,
    src: '/images/g4.jpg',
    alt: 'Fabric Selection',
    category: 'Behind the Scenes',
    width: 800,
    height: 800,
  },
  {
    id: 10,
    src: '/images/g6.jpg',
    alt: 'Fall Collection',
    category: 'Collections',
    width: 800,
    height: 1200,
  },
  {
    id: 11,
    src: '/images/g10.jpg',
    alt: 'New York Fashion Week',
    category: 'Events',
    width: 1200,
    height: 800,
  },
  {
    id: 12,
    src: '/images/g2.jpg',
    alt: 'Tailoring Process',
    category: 'Behind the Scenes',
    width: 800,
    height: 800,
  },
];

// Categories for filtering
// const categories = ['All', 'Collections', 'Events', 'Behind the Scenes'];

export default function GalleryPage() {
  const [selectedCategory, ] = useState('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Filter images based on selected category
  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(image => image.category === selectedCategory);
  
  // Handle lightbox navigation
  const handlePrev = () => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex].id);
  };
  
  const handleNext = () => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex].id);
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
            Our <span className="text-primary">Gallery</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Explore our collections, events, and behind-the-scenes moments through our curated gallery.
          </motion.p>
        </div>

        {/* Category Filters */}
        {/* <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-black'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div> */}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative overflow-hidden rounded-lg cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => setSelectedImage(image.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`relative ${
                image.width > image.height ? 'aspect-[4/3]' : 'aspect-[3/4]'
              }`}>
                <div className="w-full h-full bg-gray-800">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-100"
                  />
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No images found in this category.</p>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
              aria-label="Close lightbox"
            >
              <FiX size={24} />
            </button>
            
            <button
              onClick={handlePrev}
              className="absolute left-4 text-white hover:text-primary transition-colors"
              aria-label="Previous image"
            >
              <FiChevronLeft size={32} />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-4 text-white hover:text-primary transition-colors"
              aria-label="Next image"
            >
              <FiChevronRight size={32} />
            </button>
            
            <div className="max-w-4xl max-h-[80vh] relative">
              <div className="w-full h-full bg-gray-800 animate-pulse">
                {/* Placeholder for image */}
              </div>
              
              {filteredImages.find(img => img.id === selectedImage) && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
                  <p className="text-white font-medium">
                    {filteredImages.find(img => img.id === selectedImage)?.alt}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {filteredImages.find(img => img.id === selectedImage)?.category}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
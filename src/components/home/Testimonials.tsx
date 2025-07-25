'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: 'Alexandra Smith',
    role: 'Fashion Influencer',
    image: '/images/tm.jpg',
    quote: 'Royal Attire has completely transformed my wardrobe. The quality and attention to detail in each piece is unmatched. I receive compliments every time I wear their clothing.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Pepper Potts',
    role: 'Business Executive',
    image: '/images/tm2.jpg',
    quote: 'As someone who needs to look professional yet stylish, Royal Attire has been my go-to brand. Their suits are impeccably tailored and the fabrics are luxurious.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sophia Chen',
    role: 'Art Director',
    image: '/images/tm3.jpg',
    quote: 'The unique designs and bold colors from Royal Attire help me express my creativity. Their limited edition pieces are always conversation starters.',
    rating: 4,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 rounded-lg p-8 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-primary">
            <div className="w-full h-full bg-gray-800">
              <Image
                src={testimonials[currentIndex].image}
                alt='Testimonial Image'
                fill
                style={{ objectFit: "cover" }}
                className="absolute inset-0 z-0 "
              />
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xl ${i < testimonials[currentIndex].rating ? 'text-primary' : 'text-gray-600'}`}>
                ★
              </span>
            ))}
          </div>
          
          <blockquote className="text-lg md:text-xl text-gray-300 italic mb-6">
            {testimonials[currentIndex].quote}
          </blockquote>
          
          <div className="font-semibold text-white">{testimonials[currentIndex].name}</div>
          <div className="text-sm text-gray-400">{testimonials[currentIndex].role}</div>
        </motion.div>
      </div>
      
      <div className="flex justify-center mt-8 gap-4">
        <button 
          onClick={prevTestimonial}
          className="p-2 rounded-full bg-gray-800 text-white hover:bg-primary transition-colors"
          aria-label="Previous testimonial"
        >
          <FiChevronLeft size={24} />
        </button>
        <button 
          onClick={nextTestimonial}
          className="p-2 rounded-full bg-gray-800 text-white hover:bg-primary transition-colors"
          aria-label="Next testimonial"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
      
      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-600'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
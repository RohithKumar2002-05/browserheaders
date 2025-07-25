'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiGlobe, FiStar } from 'react-icons/fi';

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const stats = [
    { icon: <FiAward />, value: '15+', label: 'Years of Excellence' },
    { icon: <FiUsers />, value: '50K+', label: 'Satisfied Customers' },
    { icon: <FiGlobe />, value: '25+', label: 'Countries Served' },
    { icon: <FiStar />, value: '200+', label: 'Exclusive Designs' },
  ];

  const team = [
    { name: 'Alexander Wright', role: 'Founder & Creative Director', image: '/images/t1.jpg' },
    { name: 'Isabella Chen', role: 'Head of Design', image: '/images/t2.jpg' },
    { name: 'Marcus Johnson', role: 'Production Manager', image: '/images/t3.jpg' },
    { name: 'Sophia Rodriguez', role: 'Marketing Director', image: '/images/t4.jpg' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About <span className="text-primary">Royal Attire</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Crafting luxury clothing with passion and precision since 2008.
          </motion.p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div 
            className="relative aspect-square rounded-lg overflow-hidden"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="w-full h-full bg-gray-800">
              <Image
                              src='/images/as.jpg'
                              alt='Testimonial Image'
                              fill
                              style={{ objectFit: "cover" }}
                              className="absolute inset-0 z-0 "
                            />
            </div>
          </motion.div>
          
          <motion.div
            className="flex flex-col justify-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Founded in 2008, Royal Attire began as a small boutique in Milan with a vision to create clothing that combines traditional craftsmanship with contemporary design. Our founder, Alexander Wright, brought together a team of skilled artisans who shared his passion for quality and attention to detail.
              </p>
              <p>
                Over the years, we&apos;ve grown into a global brand, but our core values remain unchanged. Every piece in our collection is crafted with the finest materials sourced from sustainable suppliers around the world. We believe that luxury should be timeless, not trendy.
              </p>
              <p>
                Today, Royal Attire stands as a symbol of elegance and sophistication, dressing influential individuals across the globe. Our commitment to excellence has earned us recognition in the fashion industry and the loyalty of our discerning clientele.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-gray-900 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="text-primary text-3xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Values */}
        <motion.div 
          className="mb-20"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-gray-900 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Quality Craftsmanship</h3>
              <p className="text-gray-400">
                We believe in creating garments that stand the test of time, both in style and durability. Each piece is meticulously crafted by skilled artisans using traditional techniques.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Sustainable Practices</h3>
              <p className="text-gray-400">
                We are committed to ethical sourcing and sustainable production methods. Our materials are carefully selected from suppliers who share our values of environmental responsibility.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Timeless Elegance</h3>
              <p className="text-gray-400">
                We design for the discerning individual who appreciates understated luxury. Our collections transcend seasonal trends, focusing instead on timeless elegance and sophistication.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Our Team */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-gray-900 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="aspect-square relative">
                  <div className="w-full h-full bg-gray-800">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="absolute inset-0 z-0 "
                    />
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-gray-400">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
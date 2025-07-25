'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();

  const { items } = useCart();
  const cartItemCount = items.length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Offers', href: '/offers' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center">
              <span className="text-primary font-bold text-xl">ROYAL ATTIRE</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <motion.div 
              className="ml-10 flex items-center space-x-8"
              initial="hidden"
              animate="visible"
              variants={navVariants}
            >
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={itemVariants}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-6">
            {isSignedIn && (
              <Link href="/orders" className="text-gray-300 hover:text-primary transition-colors">
                Orders
              </Link>
            )}
            <Link href="/cart" className="text-gray-300 hover:text-primary transition-colors relative">
              <FiShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {/* <Link href="/account" className="text-gray-300 hover:text-primary transition-colors">
              <FiUser className="h-6 w-6" />
            </Link> */}
            {/* Replace the existing user icon link */}
<SignedOut>
  <SignInButton mode="modal">
    <button className="text-gray-300 hover:text-primary transition-colors cursor-pointer">
      <FiUser className="h-6 w-6" />
    </button>
  </SignInButton>
</SignedOut>
<SignedIn>
  <UserButton afterSignOutUrl="/" />
</SignedIn>

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="text-gray-300 hover:text-primary transition-colors relative">
  <FiShoppingCart className="h-6 w-6" />
  {cartItemCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {cartItemCount}
    </span>
  )}
</Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-primary focus:outline-none"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-black/95 backdrop-blur-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-900/50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* <Link
              href="/account"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-900/50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              My Account
            </Link> */}
            {/* Replace the existing My Account link */}
<SignedOut>
  <SignInButton mode="modal">
    <div className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-900/50 rounded-md">
      Sign In
    </div>
  </SignInButton>
</SignedOut>
<SignedIn>
  <div className="px-3 py-2">
    <UserButton afterSignOutUrl="/" />
  </div>
</SignedIn>

          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
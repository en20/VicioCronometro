'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1
                }}
                className="h-20 flex items-center justify-center"
              >
                <img 
                  src="/vicio.png" 
                  alt="Vício Logo" 
                  className="h-10 object-contain"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7651B1] to-[#9B7ED7]"
              >
                
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/">Início</NavLink>
              <NavLink href="/sobre">Sobre</NavLink>
              <motion.a 
                href="https://github.com/en20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7651B1] to-[#9B7ED7] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Github
              </motion.a>
            </div>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#7651B1] hover:bg-purple-50 transition-colors"
              aria-label="Menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isOpen 
                    ? "M6 18L18 6M6 6l12 12" 
                    : "M4 6h16M4 12h16M4 18h16"
                  } 
                />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <div className="h-16 md:h-20"></div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-5 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/vicio.png" 
                      alt="Vício Logo" 
                      className="h-8 object-contain"
                    />
                    <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7651B1] to-[#9B7ED7]">
                      Cronômetro
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Início</MobileNavLink>
                  <MobileNavLink href="/sobre" onClick={() => setIsOpen(false)}>Sobre</MobileNavLink>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  <motion.a 
                    href="https://github.com/en20"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7651B1] to-[#9B7ED7] text-white font-medium shadow-md flex items-center justify-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Github
                  </motion.a>
                  
                  <div className="mt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Cronômetro Vício
                    <div className="text-xs mt-1">Acompanhe seu tempo de estudo</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="relative text-gray-700 hover:text-[#7651B1] transition-colors duration-200 font-medium group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#7651B1] to-[#9B7ED7] group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}


function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-[#7651B1] transition-all duration-200 flex items-center"
    >
      <motion.span
        initial={{ x: -5, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
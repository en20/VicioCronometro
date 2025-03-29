'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-20 bg-gradient-to-r from-purple-50 to-purple-100 pt-12 pb-6 border-t border-purple-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-10 gap-8">
          {/* Logo e descrição */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white rounded-full p-1.5 shadow-sm">
                <img 
                  src="/vicio.png" 
                  alt="Vício Logo" 
                  className="h-8 w-8 object-contain" 
                />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7651B1] to-[#9B7ED7]">
                Cronômetro Vício
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Otimize seus estudos acompanhando seu tempo dedicado a cada disciplina e tópico.
              Visualize estatísticas detalhadas e monitore seu progresso.
            </p>
            <div className="flex gap-3">
              <motion.a 
                href="https://github.com/en20" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow text-gray-600 hover:text-[#7651B1] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow text-gray-600 hover:text-[#7651B1] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
              <motion.a 
                href="mailto:contato@cronometrovicio.com" 
                whileHover={{ y: -3 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow text-gray-600 hover:text-[#7651B1] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </motion.a>
            </div>
          </div>
          
          {/* Links */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Navegação</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-[#7651B1] transition-colors">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="/sobre" className="text-gray-600 hover:text-[#7651B1] transition-colors">
                    Sobre
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Recursos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#7651B1] transition-colors">
                    Dicas de Estudo
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#7651B1] transition-colors">
                    Técnica Pomodoro
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#7651B1] transition-colors">
                    Suporte
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#7651B1] transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#7651B1] transition-colors">
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent my-6"></div>
        
        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          <p>© {currentYear} Cronômetro Vício. Todos os direitos reservados.</p>
          <p className="mt-1 text-xs">
            Desenvolvido com <span className="text-red-500">♥</span> para estudantes
          </p>
        </div>
      </div>
    </footer>
  );
} 
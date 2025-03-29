import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import { Poppins } from 'next/font/google';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
});

export const metadata: Metadata = {
  title: "Cronômetro de Estudos",
  description: "Acompanhe seu tempo de estudo por disciplina e tópico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${poppins.className}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import SessionProviderWrapper from "../components/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "STORENER",
  description: "Nowoczesny sklep internetowy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <SessionProviderWrapper>
          <Navbar />
          {children}
          <Footer />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#111111",
                color: "#ffffff",
                borderRadius: "14px",
                padding: "14px 16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
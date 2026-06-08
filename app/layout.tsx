import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import SessionProviderWrapper from "../components/SessionProviderWrapper";

export const metadata: Metadata = {
  title: {
    default: "STORENER – Sklep internetowy",
    template: "%s | STORENER",
  },
  description: "Nowoczesny sklep internetowy – nowości, wyprzedaż, dom i ogród, motoryzacja i akcesoria dla zwierząt.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <SessionProviderWrapper>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#0a0a0a",
                color: "#ffffff",
                borderRadius: "14px",
                padding: "14px 18px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.24)",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: "500",
                fontSize: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
              },
              success: {
                iconTheme: { primary: "#4caf3d", secondary: "#ffffff" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
              },
            }}
          />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

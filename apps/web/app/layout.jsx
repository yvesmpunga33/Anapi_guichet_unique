import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers.jsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ANAPI - Agence Nationale pour la Promotion des Investissements",
  description: "Système de gestion des investissements et des ressources humaines",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

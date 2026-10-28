import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Dice5, MapPin, ArrowUpRight } from "lucide-react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ADMIN_WHATSAPP } from "@/lib/data";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lokki — Des jeux, des proches, de bons moments",
  description:
    "Louez un pack de 5 jeux : Monopoly, Ludo personnalisé, Uno, Jenga et Scrabble. 7 000 F CFA les 24 h, livraison gratuite. Réservez simplement sur WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body>
        <a href="#main-content" className="skip-link">
          Aller au contenu
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="shell footer-top">
            <div>
              <Link href="/" className="brand">
                <Dice5 size={27} strokeWidth={2.5} />
                <span>
                  lokki<span className="brand-dot">.</span>
                </span>
              </Link>
              <p>
                Déconnectez les écrans.
                <br />
                Reconnectez les gens.
              </p>
            </div>
            <div className="footer-links">
              <Link href="/catalogue">Louer un pack</Link>
              <Link href="/#comment-ca-marche">Comment ça marche</Link>
              <a
                href={`https://wa.me/${ADMIN_WHATSAPP.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                On en parle ? <ArrowUpRight size={14} />
              </a>
            </div>
            <span className="footer-location">
              <MapPin size={15} /> Du fun, depuis Lomé.
            </span>
          </div>
          <div className="shell footer-bottom">
            <span>© {new Date().getFullYear()} Lokki</span>
            <span>La vie est plus belle autour d’un jeu.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

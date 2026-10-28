"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dice5, ShoppingBag, Menu, X, Gift, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { HOLIDAY_PROMOTION } from "@/lib/offer";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartStore((state) => state.items.length);
  const links = [
    { href: "/catalogue", label: "Notre pack" },
    { href: "/#les-jeux", label: "Les jeux" },
    { href: "/#comment-ca-marche", label: "Comment ça marche" },
  ];
  return (
    <>
      {HOLIDAY_PROMOTION.enabled && (
        <Link className="offer-banner" href="/catalogue">
          <Gift size={15} />
          <span>
            Les fêtes se jouent ensemble.{" "}
            <strong>
              −{HOLIDAY_PROMOTION.discountPercent} % sur votre pack !
            </strong>
          </span>
          <ArrowRight size={15} />
        </Link>
      )}
      <header className="site-header">
        <div className="shell nav-inner">
          <Link href="/" className="brand" aria-label="Lokki — accueil">
            <Dice5 size={30} strokeWidth={2.5} />
            <span>
              lokki<span className="brand-dot">.</span>
            </span>
          </Link>
          <nav aria-label="Navigation principale" className="desktop-nav">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link
              href="/panier"
              className="cart-link"
              aria-label={`Ma réservation, ${cartCount} pack${cartCount > 1 ? "s" : ""}`}
            >
              <ShoppingBag size={18} />
              <span>Ma réservation</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <button
              className="mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Navigation mobile"
            className="mobile-nav"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

"use client";

import { use } from "react";
import PackArtwork from "@/components/PackArtwork";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Check, Truck, Clock3, PackageOpen } from "lucide-react";
import { useArticleStore, useCartStore } from "@/lib/store";
import { GAMES } from "@/lib/data";
import { HOLIDAY_PROMOTION } from "@/lib/offer";
import PriceTag from "@/components/PriceTag";
import GameGrid from "@/components/GameGrid";
import RentalForm from "@/components/RentalForm";
import { formatPrice } from "@/lib/utils";

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const article = useArticleStore((state) =>
    state.articles.find((pack) => pack.id === id && pack.kind === "game-pack"),
  );
  const addItem = useCartStore((state) => state.addItem);
  if (!article) return notFound();
  return (
    <div className="shell page-space">
      <Link href="/catalogue" className="back-link">
        <ArrowLeft size={16} /> Tous les packs
      </Link>
      <div className="pack-detail-grid">
        <div className="pack-detail-content">
          <div className="pack-detail-art">
            <PackArtwork
              src={article.images[0] || "/images/pack-hero.webp"}
              alt={`Illustration de ${article.name}, avec les cinq jeux inclus`}
              sizes="(max-width: 800px) 100vw, 55vw"
              preload
            />
            <span className="pack-photo-note">Visuel d’illustration</span>
          </div>
          <span className="eyebrow">
            {article.gameIds.length} JEUX. DES SOUVENIRS À LA PELLE.
          </span>
          <h1>
            {article.name}
            <span className="blue-text">.</span>
          </h1>
          <p>{article.description}</p>
          <ul className="pack-checklist">
            {GAMES.filter((game) => article.gameIds.includes(game.id)).map(
              (game) => (
                <li key={game.id}>
                  <Check size={16} />
                  {game.name}
                </li>
              ),
            )}
          </ul>
          <div className="benefit-pills">
            <span>
              <Truck size={16} /> Livraison gratuite
            </span>
            <span>
              <Clock3 size={16} /> Par tranches de 24 h
            </span>
            <span>
              <PackageOpen size={16} /> Pack complet
            </span>
          </div>
        </div>
        <aside className="booking-panel">
          <span className="eyebrow">À VOUS DE JOUER</span>
          {HOLIDAY_PROMOTION.enabled && (
            <span className="promo-label">
              Fêtes · −{HOLIDAY_PROMOTION.discountPercent} %
            </span>
          )}
          <PriceTag price={article.pricePerDay} />
          {article.status === "active" ? (
            <RentalForm
              article={article}
              onSave={(start, end) => {
                addItem(article, start, end);
                router.push("/panier");
              }}
            />
          ) : (
            <p className="form-error">
              Ce pack est momentanément indisponible.
            </p>
          )}
          <p className="pricing-note">
            La demande ne confirme pas encore la réservation.
            <br />
            Notre équipe valide la disponibilité sur WhatsApp.
          </p>
          {article.conditions.caution !== undefined && (
            <p className="field-help">
              Caution : {formatPrice(article.conditions.caution)}
            </p>
          )}
          {article.conditions.notes && (
            <p className="field-help">{article.conditions.notes}</p>
          )}
        </aside>
      </div>
      <section className="section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DANS VOTRE PACK</span>
            <h2>
              Chacun son jeu.
              <br />
              <span className="blue-text">Tous autour de la table.</span>
            </h2>
          </div>
        </div>
        <GameGrid gameIds={article.gameIds} />
      </section>
    </div>
  );
}

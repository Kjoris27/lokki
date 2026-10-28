"use client";

import PackArtwork from "@/components/PackArtwork";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Truck,
  Check,
  Gift,
  CalendarDays,
  MessageCircle,
  Smile,
  Sparkles,
  PackageOpen,
} from "lucide-react";
import { useArticleStore } from "@/lib/store";
import { HOLIDAY_PROMOTION, RENTAL_OFFER } from "@/lib/offer";
import { GAMES } from "@/lib/data";
import { calcTotal, formatPrice } from "@/lib/utils";
import PriceTag from "@/components/PriceTag";
import GameGrid from "@/components/GameGrid";

export default function HomePage() {
  const pack = useArticleStore((state) =>
    state.articles.find(
      (article) => article.kind === "game-pack" && article.status === "active",
    ),
  );
  const packHref = pack ? `/article/${pack.id}` : "/catalogue";
  return (
    <>
      <section className="shell hero">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">
            <span className="live-dot" /> LE BONHEUR SE JOUE ENSEMBLE
          </span>
          <h1>
            Moins d’écrans.
            <br />
            Plus de{" "}
            <span className="blue-text">
              bons
              <br className="desktop-break" /> moments.
            </span>
          </h1>
          <p className="hero-description">
            Votre bande. Cinq jeux cultes. Une seule boîte.
            <br className="desktop-break" /> On vous livre tout pour une soirée
            qui se prolonge.
          </p>
          <div className="benefit-pills">
            <span>
              <PackageOpen size={16} /> 5 jeux inclus
            </span>
            <span>
              <Clock3 size={16} /> 24 h de fun
            </span>
            <span>
              <Truck size={16} /> Livraison gratuite
            </span>
          </div>
          <Link className="button button-primary hero-cta" href={packHref}>
            {pack ? "Je réserve mon pack" : "Découvrir les packs"}
            <ArrowRight size={18} />
          </Link>
          {pack && (
            <div className="hero-price">
              <PriceTag price={pack.pricePerDay} compact />
              {HOLIDAY_PROMOTION.enabled && (
                <span className="small-offer">
                  C’est cadeau : −{HOLIDAY_PROMOTION.discountPercent} % pour les
                  fêtes.
                </span>
              )}
            </div>
          )}
        </div>
        <div className="hero-visual">
          <span className="hero-sticker">
            <Sparkles size={15} /> La soirée est dans la boîte.
          </span>
          <PackArtwork
            src="/images/pack-hero.webp"
            alt="Illustration 3D du pack Lokki avec Monopoly, Ludo personnalisé, Uno, Jenga et Scrabble"
            sizes="(max-width: 760px) 100vw, 55vw"
            preload
          />
          <span className="visual-note">
            <span>✦</span> De grandes revanches en perspective.
          </span>
        </div>
      </section>

      <div className="shell occasion-strip">
        <span>TOUTES LES OCCASIONS SONT BONNES.</span>
        <div>
          <span>Entre amis</span>
          <i /> <span>En famille</span>
          <i />
          <span>Pour les fêtes</span>
          <i />
          <span>Juste pour le plaisir</span>
        </div>
      </div>

      <section id="les-jeux" className="shell section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LE CASTING DE VOTRE SOIRÉE</span>
            <h2>
              Cinq classiques.
              <br />
              <span className="blue-text">Zéro soirée ordinaire.</span>
            </h2>
          </div>
          <p>
            Pas besoin de choisir votre préféré.
            <br />
            <strong>Ils sont tous dans le pack.</strong>
          </p>
        </div>
        <GameGrid />
        <p className="illustration-note">
          Visuels d’illustration. L’apparence des jeux et du rangement peut
          varier.
        </p>
      </section>

      <section id="notre-pack" className="shell">
        {pack ? (
          <div className="featured-pack">
            <div className="pack-intro">
              <span className="eyebrow">
                <PackageOpen size={15} /> UN PACK. TOUT LE MONDE JOUE.
              </span>
              <h2>
                Le pack des
                <br />
                bons moments<span className="blue-text">.</span>
              </h2>
              <p>
                Du premier « à toi de jouer » à la dernière revanche.
                <br />
                Les {pack.gameIds.length} jeux vous accompagnent pendant 24 h.
              </p>
              <ul className="pack-checklist">
                {GAMES.filter((game) => pack.gameIds.includes(game.id)).map(
                  (game) => (
                    <li key={game.id}>
                      <Check size={16} />
                      {game.name}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="pack-pricing">
              {HOLIDAY_PROMOTION.enabled && (
                <span className="promo-label">
                  <Gift size={15} /> OFFRE DE FÊTES · −
                  {HOLIDAY_PROMOTION.discountPercent} %
                </span>
              )}
              <PriceTag price={pack.pricePerDay} />
              <p className="free-delivery">
                <Truck size={17} /> Livraison gratuite
              </p>
              <Link href={packHref} className="button button-primary">
                C’est parti, je réserve <ArrowRight size={18} />
              </Link>
              <p className="pricing-note">
                Une demande simple sur WhatsApp.
                <br />
                Disponibilité confirmée par notre équipe.
              </p>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <PackageOpen size={42} />
            <h2>Les packs font une pause.</h2>
            <p>Revenez bientôt pour préparer votre prochaine soirée jeux.</p>
          </div>
        )}
      </section>

      <section
        id="comment-ca-marche"
        className="shell section-space how-section"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">LA SEULE RÈGLE : PROFITER</span>
            <h2>
              Simple comme <span className="blue-text">1, 2, 3.</span>
            </h2>
          </div>
          <p>
            Moins d’organisation.
            <br />
            Plus de temps pour jouer.
          </p>
        </div>
        <div className="steps-grid">
          {[
            {
              number: "01",
              icon: CalendarDays,
              title: "Choisissez votre moment",
              copy: "Un jour, une heure, et votre pack. Les 24 h commencent à la livraison.",
              color: "blue",
            },
            {
              number: "02",
              icon: MessageCircle,
              title: "On se dit tout sur WhatsApp",
              copy: "Envoyez votre demande préremplie. Notre équipe confirme la disponibilité et la livraison.",
              color: "mint",
            },
            {
              number: "03",
              icon: Smile,
              title: "Ouvrez. Jouez. Recommencez.",
              copy: "On vous livre gratuitement. Profitez des cinq jeux, puis restituez le pack selon les modalités convenues.",
              color: "peach",
            },
          ].map((step) => (
            <article
              className={`step-card step-${step.color}`}
              key={step.number}
            >
              <div className="step-top">
                <span className="step-icon">
                  <step.icon size={26} />
                </span>
                <span className="step-number">{step.number}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell faq-section">
        <div>
          <span className="eyebrow">AVANT DE LANCER LES DÉS</span>
          <h2>
            Les petites
            <br />
            questions.
          </h2>
        </div>
        <div className="faq-list">
          {[
            [
              "Les cinq jeux sont-ils vraiment inclus ?",
              "Oui ! Monopoly, Ludo personnalisé, Uno, Jenga et Scrabble sont réunis dans chaque pack. Les jeux ne se louent pas séparément.",
            ],
            [
              "Combien coûte une location de 24 h ?",
              `Le tarif habituel est de ${formatPrice(RENTAL_OFFER.pricePerDay)} par pack pour 24 h.${HOLIDAY_PROMOTION.enabled ? ` Pendant les fêtes, la réduction de ${HOLIDAY_PROMOTION.discountPercent} % est appliquée automatiquement : ${formatPrice(calcTotal(RENTAL_OFFER.pricePerDay, 1))}.` : ""} La livraison est gratuite.`,
            ],
            [
              "Quand commencent les 24 h ?",
              "À l’heure de livraison convenue avec notre équipe. Par exemple, un pack livré samedi à 18 h est à restituer dimanche à 18 h pour une location de 24 h.",
            ],
            [
              "Comment se passent la livraison et le retour ?",
              "Indiquez votre quartier et votre adresse dans la demande. Notre équipe confirme le lieu et l’heure sur WhatsApp. La livraison est gratuite ; les modalités de restitution sont convenues ensemble.",
            ],
          ].map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="shell last-cta">
        <div>
          <span className="eyebrow">VOTRE PROCHAINE SOIRÉE COMMENCE ICI</span>
          <h2>On fait une partie ?</h2>
          <p>Les meilleurs souvenirs n’ont pas besoin de Wi-Fi.</p>
        </div>
        <Link className="button button-dark" href={packHref}>
          Je prends le pack <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}

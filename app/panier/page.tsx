"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Pencil,
  Truck,
  MessageCircle,
  Check,
} from "lucide-react";
import { useArticleStore, useCartStore } from "@/lib/store";
import {
  calcDays,
  calcTotal,
  canBook,
  formatDate,
  formatPrice,
} from "@/lib/utils";
import { HOLIDAY_PROMOTION, RENTAL_OFFER } from "@/lib/offer";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import RentalForm from "@/components/RentalForm";
import { useBookingClock } from "@/lib/use-booking-clock";

export default function PanierPage() {
  useBookingClock();
  const {
    items: savedItems,
    removeItem,
    updateItem,
    clearCart,
  } = useCartStore();
  const articles = useArticleStore((state) => state.articles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: "", address: "", note: "" });
  const [error, setError] = useState("");
  // Always use the current catalogue and offer, never stale persisted prices or status.
  const items = savedItems.map((item) => {
    const article = articles.find(
      (pack) => pack.id === item.articleId && pack.kind === "game-pack",
    );
    return {
      ...item,
      article: article ?? { ...item.article, status: "inactive" as const },
      days: calcDays(item.startDate, item.endDate),
    };
  });
  const base = items.reduce(
    (sum, item) => sum + item.article.pricePerDay * item.days,
    0,
  );
  const total = items.reduce(
    (sum, item) => sum + calcTotal(item.article.pricePerDay, item.days),
    0,
  );
  const datesValid = items.every((item) =>
    canBook(item.article, item.startDate, item.endDate),
  );

  if (!items.length)
    return (
      <div className="shell empty-state cart-empty">
        <span className="empty-icon">
          <ShoppingBag size={38} />
        </span>
        <span className="eyebrow">LA SOIRÉE N’ATTEND QUE VOUS</span>
        <h1>Il manque juste le pack.</h1>
        <p>
          Les cinq jeux sont prêts. Choisissez votre moment
          <br />
          et on s’occupe de lancer la partie.
        </p>
        <Link href="/catalogue" className="button button-primary">
          Découvrir le pack <ArrowRight size={18} />
        </Link>
      </div>
    );

  return (
    <div className="shell page-space cart-page">
      <Link href="/catalogue" className="back-link">
        <ArrowLeft size={16} /> Voir le pack
      </Link>
      <div className="section-heading">
        <div>
          <span className="eyebrow">ENCORE UN PETIT TOUR</span>
          <h1>
            Votre prochaine
            <br />
            <span className="blue-text">bonne soirée.</span>
          </h1>
        </div>
        <button onClick={clearCart} className="text-button danger">
          <Trash2 size={15} /> Tout retirer
        </button>
      </div>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article key={item.cartItemId} className="cart-item">
              <div className="cart-item-top">
                <div className="cart-item-image">
                  <Image
                    src={item.article.images[0] || "/images/pack-hero.webp"}
                    alt={`Illustration de ${item.article.name}`}
                    fill
                    sizes="110px"
                    className="object-contain"
                  />
                </div>
                <div className="cart-item-info">
                  <Link href={`/article/${item.articleId}`}>
                    <h2>{item.article.name}</h2>
                  </Link>
                  <p>5 jeux inclus · {item.days * 24} h de location</p>
                  <strong>
                    {formatPrice(
                      calcTotal(item.article.pricePerDay, item.days),
                    )}
                  </strong>
                </div>
                <button
                  className="icon-button danger"
                  onClick={() => removeItem(item.cartItemId)}
                  aria-label={`Retirer ${item.article.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {editingId === item.cartItemId ? (
                <RentalForm
                  article={item.article}
                  initialStart={item.startDate}
                  initialDays={item.days}
                  label="Enregistrer les dates"
                  onSave={(start, end) => {
                    updateItem(item.cartItemId, start, end);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="cart-dates">
                    <div>
                      <span>Livraison souhaitée</span>
                      <strong>{formatDate(item.startDate)}</strong>
                    </div>
                    <div>
                      <span>Restitution prévue</span>
                      <strong>{formatDate(item.endDate)}</strong>
                    </div>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setEditingId(item.cartItemId)}
                  >
                    <Pencil size={14} /> Modifier les dates
                  </button>
                </>
              )}
              {!canBook(item.article, item.startDate, item.endDate) && (
                <p className="form-error" role="alert">
                  Le pack ou les dates ne sont plus disponibles. Modifiez les
                  dates ou retirez cette sélection.
                </p>
              )}
            </article>
          ))}
          <div className="cart-assurance">
            <Truck size={23} />
            <div>
              <strong>Le fun vient jusqu’à vous.</strong>
              <p>
                Livraison gratuite. Le lieu et le créneau sont confirmés
                ensemble sur WhatsApp.
              </p>
            </div>
          </div>
        </div>
        <aside className="checkout-panel">
          <span className="eyebrow">LA DERNIÈRE ÉTAPE</span>
          <h2>On vous livre où ?</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (
                !items.every((item) =>
                  canBook(item.article, item.startDate, item.endDate),
                )
              ) {
                setError("Vérifiez vos dates avant de continuer.");
                return;
              }
              if (!customer.name.trim() || !customer.address.trim()) {
                setError("Indiquez votre nom et votre adresse de livraison.");
                return;
              }
              setError("");
              window.open(
                buildWhatsAppUrl(items, customer),
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            <div className="field">
              <label htmlFor="customer-name">Votre nom</label>
              <input
                id="customer-name"
                name="name"
                autoComplete="name"
                maxLength={100}
                required
                value={customer.name}
                onChange={(event) =>
                  setCustomer({ ...customer, name: event.target.value })
                }
                placeholder="Comment vous appelle-t-on ?"
              />
            </div>
            <div className="field">
              <label htmlFor="customer-address">
                Quartier et adresse de livraison
              </label>
              <textarea
                id="customer-address"
                name="address"
                autoComplete="street-address"
                maxLength={500}
                rows={2}
                required
                value={customer.address}
                onChange={(event) =>
                  setCustomer({ ...customer, address: event.target.value })
                }
                placeholder="Quartier, rue, point de repère…"
              />
            </div>
            <div className="field">
              <label htmlFor="customer-note">
                Un petit mot ? <span>(facultatif)</span>
              </label>
              <input
                id="customer-note"
                maxLength={500}
                value={customer.note}
                onChange={(event) =>
                  setCustomer({ ...customer, note: event.target.value })
                }
                placeholder="Une précision pour la livraison…"
              />
            </div>
            <div className="booking-breakdown">
              <div>
                <span>Location des packs</span>
                <span>{formatPrice(base)}</span>
              </div>
              {HOLIDAY_PROMOTION.enabled && (
                <div className="discount-line">
                  <span>Fêtes · −{HOLIDAY_PROMOTION.discountPercent} %</span>
                  <span>−{formatPrice(base - total)}</span>
                </div>
              )}
              <div>
                <span>Livraison</span>
                <strong className="green-text">
                  {RENTAL_OFFER.deliveryFee === 0
                    ? "Gratuite"
                    : formatPrice(RENTAL_OFFER.deliveryFee)}
                </strong>
              </div>
              <div className="booking-total">
                <strong>Total de la location</strong>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="button button-whatsapp"
              disabled={!datesValid || editingId !== null}
            >
              <MessageCircle size={19} /> Continuer sur WhatsApp{" "}
              <ArrowRight size={17} />
            </button>
            <p className="pricing-note">
              Un message prérempli s’ouvre dans WhatsApp.
              <br />
              Vous l’envoyez pour demander confirmation.
            </p>
            <p className="checkout-note">
              <Check size={14} /> Aucun paiement demandé sur le site.
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Calendar,
  MessageCircle,
  ArrowLeft,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import {
  calcDays,
  calcTotal,
  formatPrice,
  formatDate,
  isDateRangeAvailable,
} from "@/lib/utils";
import { ADMIN_WHATSAPP } from "@/lib/data";

export default function PanierPage() {
  const { items, removeItem, updateItem, clearCart, totalAmount } = useCartStore();
  const total = totalAmount();

  function buildWhatsAppMessage(): string {
    const lines = [
      "Bonjour ! Je souhaite effectuer une demande de location :",
      "",
      ...items.map((item, i) => [
        `${i + 1}. *${item.article.name}*`,
        `   Du ${formatDate(item.startDate)} au ${formatDate(item.endDate)}`,
        `   ${item.days} jour${item.days > 1 ? "s" : ""} × ${formatPrice(item.article.pricePerDay)} = *${formatPrice(item.totalPrice)}*`,
      ].join("\n")),
      "",
      `*Total : ${formatPrice(total)}*`,
      "",
      "Merci de confirmer la disponibilité. 🙏",
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${buildWhatsAppMessage()}`;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-5">
        <ShoppingCart size={56} className="text-gray-200" />
        <h1 className="text-2xl font-bold text-gray-800">Votre panier est vide</h1>
        <p className="text-gray-500">Parcourez notre catalogue et ajoutez des articles pour commencer.</p>
        <Link
          href="/catalogue"
          className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-10">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon panier</h1>
          <p className="text-gray-500 text-sm mt-1">
            {items.length} article{items.length > 1 ? "s" : ""} sélectionné{items.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-rose-500 hover:text-rose-700 flex items-center gap-1.5"
        >
          <Trash2 size={14} /> Vider
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <CartItemRow
            key={item.cartItemId}
            item={item}
            onRemove={() => removeItem(item.cartItemId)}
            onUpdate={(start, end) => updateItem(item.cartItemId, start, end)}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 text-lg mb-4">Récapitulatif</h2>
        <div className="flex flex-col gap-2 text-sm mb-4">
          {items.map((item) => (
            <div key={item.cartItemId} className="flex justify-between text-gray-600">
              <span className="truncate mr-2">
                {item.article.name} ({item.days}j)
              </span>
              <span className="shrink-0 font-medium">{formatPrice(item.totalPrice)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-indigo-600">{formatPrice(total)}</span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-4 rounded-xl hover:bg-emerald-600 transition-colors text-base"
        >
          <MessageCircle size={20} />
          Conclure la demande via WhatsApp
        </a>
        <p className="text-xs text-gray-400 text-center mt-3 hidden md:block">
          Un message pré-rempli sera envoyé à notre équipe pour confirmer votre demande.
        </p>
      </div>
    </div>

    {/* Floating CTA — mobile only */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-40 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{items.length} article{items.length > 1 ? "s" : ""}</span>
        <span className="font-bold text-indigo-600 text-base">{formatPrice(total)}</span>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 transition-colors text-sm"
      >
        <MessageCircle size={18} />
        Conclure via WhatsApp
      </a>
    </div>
    </>
  );
}

interface CartItemRowProps {
  item: ReturnType<typeof useCartStore.getState>["items"][number];
  onRemove: () => void;
  onUpdate: (start: string, end: string) => void;
}

function CartItemRow({ item, onRemove, onUpdate }: CartItemRowProps) {
  const [editing, setEditing] = useState(false);
  const [start, setStart] = useState(item.startDate);
  const [end, setEnd] = useState(item.endDate);
  const today = new Date().toISOString().split("T")[0];

  const newDays = calcDays(start, end);
  const newTotal = calcTotal(item.article.pricePerDay, newDays);
  const newAvailable = isDateRangeAvailable(item.article, start, end);

  function handleSave() {
    if (start && end && end >= start && newAvailable) {
      onUpdate(start, end);
      setEditing(false);
    }
  }

  function handleCancel() {
    setStart(item.startDate);
    setEnd(item.endDate);
    setEditing(false);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
      {/* Image */}
      <div className="relative w-full sm:w-24 h-44 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {item.article.images[0] ? (
          <Image
            src={item.article.images[0]}
            alt={item.article.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/article/${item.article.id}`}
            className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            {item.article.name}
          </Link>
          <button onClick={onRemove} className="text-gray-400 hover:text-rose-500 shrink-0">
            <Trash2 size={16} />
          </button>
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">Début</label>
                <input
                  type="date"
                  min={today}
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Fin</label>
                <input
                  type="date"
                  min={start || today}
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>
            {start && end && !newAvailable && (
              <p className="text-xs text-rose-500">Ces dates sont indisponibles.</p>
            )}
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleSave}
                disabled={!start || !end || end < start || !newAvailable}
                className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-40"
              >
                <Check size={12} /> Confirmer ({newDays}j = {formatPrice(newTotal)})
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
              >
                <X size={12} /> Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Calendar size={14} />
            <span>
              {formatDate(item.startDate)} → {formatDate(item.endDate)}{" "}
              <span className="text-gray-400">({item.days}j)</span>
            </span>
            <button
              onClick={() => setEditing(true)}
              className="text-gray-400 hover:text-indigo-500"
            >
              <Pencil size={13} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">
            {formatPrice(item.article.pricePerDay)} / jour
          </span>
          <span className="font-bold text-indigo-600">{formatPrice(item.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

import type { CartItem } from "./types";
import { ADMIN_WHATSAPP, GAMES } from "./data";
import { HOLIDAY_PROMOTION } from "./offer";
import { calcTotal, formatDate, formatPrice } from "./utils";

export function buildWhatsAppUrl(
  items: CartItem[],
  customer: { name: string; address: string; note: string },
): string {
  const total = items.reduce(
    (sum, item) => sum + calcTotal(item.article.pricePerDay, item.days),
    0,
  );
  const lines = [
    "Bonjour Lokki ! Je souhaite louer un pack de jeux 🎲",
    "",
    `Nom : ${customer.name.trim()}`,
    `Adresse / quartier de livraison : ${customer.address.trim()}`,
    "",
    ...items.map((item, i) =>
      [
        `${i + 1}. *${item.article.name}*`,
        `Jeux inclus : ${GAMES.filter((game) =>
          item.article.gameIds.includes(game.id),
        )
          .map((game) => game.name)
          .join(", ")}`,
        `Livraison souhaitée : ${formatDate(item.startDate)} (heure de Lomé)`,
        `Restitution prévue : ${formatDate(item.endDate)} (heure de Lomé)`,
        `Durée : ${item.days * 24} h (${item.days} × 24 h)`,
        `Tarif habituel : ${formatPrice(item.article.pricePerDay)} / 24 h`,
        ...(HOLIDAY_PROMOTION.enabled
          ? [`Offre de fêtes : −${HOLIDAY_PROMOTION.discountPercent} %`]
          : []),
        `Sous-total : *${formatPrice(calcTotal(item.article.pricePerDay, item.days))}*`,
      ].join("\n"),
    ),
    "",
    "Livraison : *gratuite*",
    `*Total de la location : ${formatPrice(total)}*`,
    ...(customer.note.trim()
      ? ["", `Précisions : ${customer.note.trim()}`]
      : []),
    "",
    "Merci de confirmer la disponibilité, l’heure de livraison et les modalités de restitution. 🙏",
  ];
  return `https://wa.me/${ADMIN_WHATSAPP.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
}

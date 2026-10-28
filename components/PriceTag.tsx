import { HOLIDAY_PROMOTION, RENTAL_OFFER } from "@/lib/offer";
import { calcTotal, formatPrice } from "@/lib/utils";

export default function PriceTag({
  price = RENTAL_OFFER.pricePerDay,
  compact = false,
}: {
  price?: number;
  compact?: boolean;
}) {
  return (
    <div className={`price-tag ${compact ? "price-tag-compact" : ""}`}>
      {HOLIDAY_PROMOTION.enabled && (
        <span className="original-price">{formatPrice(price)}</span>
      )}
      <span className="current-price">{formatPrice(calcTotal(price, 1))}</span>
      <span className="price-period">/ 24 h</span>
    </div>
  );
}

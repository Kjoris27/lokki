// Disable the holiday promotion here when the owner supplies its end date.
// All displayed prices, cart totals and WhatsApp messages use this configuration.
export const HOLIDAY_PROMOTION = {
  enabled: true,
  discountPercent: 20,
  label: "Offre de fêtes",
};

export const RENTAL_OFFER = {
  pricePerDay: 7000,
  hoursPerDay: 24,
  deliveryFee: 0,
};

export function discountedPrice(amount: number): number {
  return Math.round(
    amount *
      (HOLIDAY_PROMOTION.enabled
        ? 1 - HOLIDAY_PROMOTION.discountPercent / 100
        : 1),
  );
}

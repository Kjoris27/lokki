import { test } from "node:test";
import assert from "node:assert/strict";
import { ARTICLES, GAMES } from "../lib/data";
import { HOLIDAY_PROMOTION } from "../lib/offer";
import {
  bookingDate,
  calcDays,
  calcTotal,
  canBook,
  formatDate,
  isDateRangeAvailable,
  rentalEnd,
} from "../lib/utils";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { useArticleStore, useCartStore } from "../lib/store";
import type { CartItem } from "../lib/types";

const pack = ARTICLES[0];
const future = "2030-12-24T18:00";

test("the only seeded product is the complete pack with the five requested games", () => {
  assert.equal(ARTICLES.length, 1);
  assert.equal(pack.kind, "game-pack");
  assert.equal(pack.pricePerDay, 7000);
  assert.deepEqual(
    pack.gameIds,
    GAMES.map((game) => game.id),
  );
  assert.deepEqual(
    GAMES.map((game) => game.name),
    ["Monopoly", "Ludo personnalisé", "Uno", "Jenga", "Scrabble"],
  );
});

test("24 hours crossing midnight are billed once; 48 hours twice", () => {
  const end = rentalEnd(future, 1);
  assert.equal(end, "2030-12-25T18:00");
  assert.equal(calcDays(future, end), 1);
  assert.equal(calcDays(future, rentalEnd(future, 2)), 2);
  assert.equal(calcTotal(7000, 1), 5600);
  assert.equal(calcTotal(7000, 2), 11200);
});

test("the ordinary tariff returns everywhere when the seasonal promotion is disabled", () => {
  const enabled = HOLIDAY_PROMOTION.enabled;
  try {
    HOLIDAY_PROMOTION.enabled = false;
    assert.equal(calcTotal(7000, 1), 7000);
    const url = buildWhatsAppUrl([cartItem()], {
      name: "Test",
      address: "Lomé",
      note: "",
    });
    const message = new URL(url).searchParams.get("text")!;
    assert.ok(message.includes("7\u202f000 F CFA"));
    assert.ok(!message.includes("Offre de fêtes"));
  } finally {
    HOLIDAY_PROMOTION.enabled = enabled;
  }
});

test("invalid, empty, reversed and zero-length date ranges are rejected without throwing", () => {
  for (const [start, end] of [
    ["", ""],
    ["invalid", future],
    [future, "invalid"],
    [future, future],
    ["2030-12-25T18:00", future],
    ["2030-02-30T18:00", future],
  ]) {
    assert.equal(calcDays(start, end), 0);
    assert.equal(isDateRangeAvailable(pack, start, end), false);
  }
  assert.equal(rentalEnd(future, 0), "");
  assert.equal(rentalEnd(future, 1.5), "");
  assert.equal(rentalEnd(future, 1e20), "");
  assert.equal(rentalEnd(future, 100000000), "");
  assert.equal(rentalEnd("invalid", 1), "");
  assert.equal(calcTotal(7000, NaN), 0);
  assert.equal(calcTotal(7000, 1.5), 0);
});

test("Lomé booking timestamps and display do not depend on the browser timezone", () => {
  assert.equal(bookingDate(future).toISOString(), "2030-12-24T18:00:00.000Z");
  assert.match(formatDate(future), /18:00/);
  assert.equal(formatDate("invalid"), "Date invalide");
});

test("blocked date-only periods include the full last day and permit adjacent bookings", () => {
  const blocked = {
    ...pack,
    unavailablePeriods: [{ start: "2030-12-25", end: "2030-12-26" }],
  };
  assert.equal(
    isDateRangeAvailable(blocked, "2030-12-24T00:00", "2030-12-25T00:00"),
    true,
  );
  assert.equal(
    isDateRangeAvailable(blocked, future, rentalEnd(future, 1)),
    false,
  );
  assert.equal(
    isDateRangeAvailable(blocked, "2030-12-26T23:59", "2030-12-27T23:59"),
    false,
  );
  assert.equal(
    isDateRangeAvailable(blocked, "2030-12-27T00:00", "2030-12-28T00:00"),
    true,
  );
});

test("past times, inactive packs, partial 24-hour periods and minimum durations are enforced", () => {
  assert.equal(canBook(pack, future, rentalEnd(future, 1)), true);
  assert.equal(canBook(pack, "2000-01-01T18:00", "2000-01-02T18:00"), false);
  assert.equal(
    canBook({ ...pack, status: "inactive" }, future, rentalEnd(future, 1)),
    false,
  );
  assert.equal(canBook(pack, future, "2030-12-25T19:00"), false);
  assert.equal(
    canBook(
      { ...pack, conditions: { minDuration: 2 } },
      future,
      rentalEnd(future, 1),
    ),
    false,
  );
});

function cartItem(): CartItem {
  return {
    cartItemId: "test",
    articleId: pack.id,
    article: pack,
    startDate: future,
    endDate: rentalEnd(future, 1),
    days: 1,
    totalPrice: 99999,
  };
}

test("WhatsApp uses current prices, free delivery, all games and encoded customer details", () => {
  const url = new URL(
    buildWhatsAppUrl([cartItem()], {
      name: "Ada & Zoé",
      address: "Lomé, rue 4 #2",
      note: "Après 18 h ?",
    }),
  );
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/22892494828");
  const message = url.searchParams.get("text")!;
  for (const game of GAMES) assert.ok(message.includes(game.name));
  assert.ok(message.includes("Ada & Zoé"));
  assert.ok(message.includes("Lomé, rue 4 #2"));
  assert.ok(message.includes("18:00"));
  assert.ok(message.includes("24 h"));
  assert.ok(message.includes("20 %"));
  assert.ok(message.includes("5\u202f600 F CFA"));
  assert.ok(message.includes("Livraison : *gratuite*"));
  assert.ok(!message.includes("99\u202f999"));
});

test("legacy carts and catalogues migrate away from equipment", async () => {
  const migrateCart = useCartStore.persist.getOptions().migrate!;
  assert.deepEqual(
    await migrateCart({ items: [{ articleId: "ps5-001" }] }, 0),
    { items: [] },
  );
  const migrateCatalogue = useArticleStore.persist.getOptions().migrate!;
  const result = (await migrateCatalogue(
    { articles: [{ id: "ps5-001" }], categories: [] },
    2,
  )) as { articles: typeof ARTICLES };
  assert.deepEqual(result.articles, ARTICLES);
});

test("cart insertion deduplicates an identical booking and rejects invalid requests", () => {
  useCartStore.getState().clearCart();
  useCartStore.getState().addItem(pack, future, rentalEnd(future, 1));
  useCartStore.getState().addItem(pack, future, rentalEnd(future, 1));
  assert.equal(useCartStore.getState().items.length, 1);
  assert.equal(useCartStore.getState().totalAmount(), 5600);
  useCartStore.getState().addItem(pack, future, future);
  assert.equal(useCartStore.getState().items.length, 1);
  useCartStore.getState().clearCart();
});

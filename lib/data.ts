import type { Article, Category } from "./types";
import { RENTAL_OFFER } from "./offer";

export const GAMES = [
  {
    id: "monopoly",
    name: "Monopoly",
    mood: "Les affaires sont les affaires.",
    tag: "Stratégie",
    image: "/images/games/monopoly.webp",
    color: "mint",
  },
  {
    id: "ludo",
    name: "Ludo personnalisé",
    mood: "Le classique, avec notre touche.",
    tag: "Convivialité",
    image: "/images/games/ludo.webp",
    color: "blue",
  },
  {
    id: "uno",
    name: "Uno",
    mood: "Un +4. Et tout peut basculer.",
    tag: "Ambiance",
    image: "/images/games/uno.webp",
    color: "rose",
  },
  {
    id: "jenga",
    name: "Jenga",
    mood: "Gardez votre calme. Et l’équilibre.",
    tag: "Adresse",
    image: "/images/games/jenga.webp",
    color: "peach",
  },
  {
    id: "scrabble",
    name: "Scrabble",
    mood: "Les bons mots font les bons scores.",
    tag: "Réflexion",
    image: "/images/games/scrabble.webp",
    color: "lilac",
  },
] as const;

export const CATEGORIES: Category[] = [
  {
    id: "packs-jeux",
    name: "Packs de jeux",
    slug: "packs-jeux",
    icon: "🎲",
    description: "Cinq jeux incontournables, réunis dans un seul pack à louer.",
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
];

export const ARTICLES: Article[] = [
  {
    id: "pack-classiques",
    kind: "game-pack",
    categoryId: "packs-jeux",
    name: "Le pack des bons moments",
    description:
      "Monopoly, Ludo personnalisé, Uno, Jenga et Scrabble : les cinq jeux sont inclus. En famille ou entre amis, passez du premier lancer de dés à la dernière revanche. Un pack complet, livré gratuitement, pour 24 h de jeu.",
    gameIds: GAMES.map((game) => game.id),
    images: ["/images/pack-hero.webp"],
    pricePerDay: RENTAL_OFFER.pricePerDay,
    conditions: {
      minDuration: 1,
      notes:
        "Livraison gratuite. Heure de livraison, disponibilité et modalités de restitution à confirmer avec notre équipe sur WhatsApp.",
    },
    unavailablePeriods: [],
    status: "active",
    isPopular: true,
    createdAt: "2026-10-28T00:00:00Z",
  },
];

export const ADMIN_WHATSAPP = "+22892494828";

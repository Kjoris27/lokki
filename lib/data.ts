import { Article, Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "loisirs",
    name: "Loisirs",
    slug: "loisirs",
    icon: "🎮",
    description: "Consoles, jeux, sport et détente",
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
  {
    id: "evenements",
    name: "Événements",
    slug: "evenements",
    icon: "🎉",
    description: "Matériel pour vos fêtes et événements",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  {
    id: "autres",
    name: "Autres",
    slug: "autres",
    icon: "📦",
    description: "Divers équipements utiles",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
];

export const ARTICLES: Article[] = [
  {
    id: "ps5-001",
    categoryId: "loisirs",
    name: "PlayStation 5",
    description:
      "Console PS5 avec 2 manettes DualSense et accès à une bibliothèque de jeux. Profitez d'une expérience gaming next-gen avec des graphismes 4K et le retour haptique.",
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80",
    ],
    pricePerDay: 5000,
    conditions: {
      caution: 50000,
      minDuration: 1,
      notes: "Caution remboursable à la restitution en bon état.",
    },
    unavailablePeriods: [
      { start: "2026-04-25", end: "2026-04-27" },
      { start: "2026-05-10", end: "2026-05-15" },
    ],
    status: "active",
    isPopular: true,
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "velo-001",
    categoryId: "loisirs",
    name: "Vélo VTT",
    description:
      "VTT 21 vitesses, idéal pour les balades en forêt ou les sorties sportives. Casque inclus.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    pricePerDay: 3000,
    conditions: {
      caution: 20000,
      minDuration: 1,
    },
    unavailablePeriods: [],
    status: "active",
    isPopular: false,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "sono-001",
    categoryId: "evenements",
    name: "Sono complète",
    description:
      "Système sono professionnel : 2 enceintes 1000W, ampli, mixeur et câbles. Parfait pour vos soirées, mariages et événements jusqu'à 200 personnes.",
    images: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    ],
    pricePerDay: 15000,
    conditions: {
      caution: 100000,
      minDuration: 1,
      notes: "Livraison et installation en option (+5000 FCFA).",
    },
    unavailablePeriods: [{ start: "2026-05-01", end: "2026-05-03" }],
    status: "active",
    isPopular: false,
    createdAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "tente-001",
    categoryId: "evenements",
    name: "Tente de réception 6x12m",
    description:
      "Grande tente modulable, imperméable, idéale pour mariages, baptêmes et cérémonies. Montage disponible sur demande.",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    ],
    pricePerDay: 25000,
    conditions: {
      caution: 150000,
      minDuration: 2,
      notes: "Durée minimale 2 jours. Montage inclus dans un rayon de 20km.",
    },
    unavailablePeriods: [],
    status: "active",
    isPopular: false,
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "beamer-001",
    categoryId: "evenements",
    name: "Vidéoprojecteur 4K",
    description:
      "Projecteur 4K, 3500 lumens, avec écran de projection 150 pouces inclus. Idéal pour conférences, cinéma en plein air et présentations.",
    images: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80",
    ],
    pricePerDay: 8000,
    conditions: {
      caution: 60000,
      minDuration: 1,
    },
    unavailablePeriods: [{ start: "2026-04-28", end: "2026-04-29" }],
    status: "active",
    isPopular: true,
    createdAt: "2026-02-10T00:00:00Z",
  },
  {
    id: "drone-001",
    categoryId: "autres",
    name: "Drone DJI Mini 4 Pro",
    description:
      "Drone compact avec caméra 4K, autonomie 34 min, portée 10km. Parfait pour photos aériennes, immobilier et événements.",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    ],
    pricePerDay: 12000,
    conditions: {
      caution: 80000,
      minDuration: 1,
      notes: "Permis de vol requis. Formation de 30 min incluse.",
    },
    unavailablePeriods: [],
    status: "active",
    isPopular: true,
    createdAt: "2026-02-20T00:00:00Z",
  },
  {
    id: "appareil-001",
    categoryId: "autres",
    name: "Appareil photo Sony A7 IV",
    description:
      "Appareil photo hybride full-frame, objectif 24-70mm f/2.8 inclus. Idéal pour mariages, portraits et paysages.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    ],
    pricePerDay: 10000,
    conditions: {
      caution: 70000,
      minDuration: 1,
    },
    unavailablePeriods: [{ start: "2026-05-05", end: "2026-05-08" }],
    status: "active",
    isPopular: false,
    createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "xbox-001",
    categoryId: "loisirs",
    name: "Xbox Series X",
    description:
      "Console Xbox Series X avec 2 manettes et Game Pass Ultimate 1 mois. Gaming 4K 120fps, rétrocompatibilité avec des milliers de jeux.",
    images: [
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80",
    ],
    pricePerDay: 4500,
    conditions: {
      caution: 45000,
      minDuration: 1,
    },
    unavailablePeriods: [],
    status: "inactive",
    isPopular: false,
    createdAt: "2026-03-10T00:00:00Z",
  },
];

export const ADMIN_WHATSAPP = "+22870881076";

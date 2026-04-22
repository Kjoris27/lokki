"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Article, CartItem, Category } from "./types";
import { ARTICLES, CATEGORIES } from "./data";
import { calcDays, calcTotal, generateCartId } from "./utils";

interface CartStore {
  items: CartItem[];
  addItem: (article: Article, startDate: string, endDate: string) => void;
  removeItem: (cartItemId: string) => void;
  updateItem: (cartItemId: string, startDate: string, endDate: string) => void;
  clearCart: () => void;
  totalAmount: () => number;
}

interface ArticleStore {
  articles: Article[];
  categories: Category[];
  addArticle: (article: Omit<Article, "id" | "createdAt">) => void;
  updateArticle: (id: string, data: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  toggleStatus: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (article, startDate, endDate) => {
        const days = calcDays(startDate, endDate);
        const totalPrice = calcTotal(article.pricePerDay, days);
        const newItem: CartItem = {
          cartItemId: generateCartId(),
          articleId: article.id,
          article,
          startDate,
          endDate,
          days,
          totalPrice,
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },
      updateItem: (cartItemId, startDate, endDate) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.cartItemId !== cartItemId) return item;
            const days = calcDays(startDate, endDate);
            const totalPrice = calcTotal(item.article.pricePerDay, days);
            return { ...item, startDate, endDate, days, totalPrice };
          }),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalAmount: () =>
        get().items.reduce((sum, item) => sum + item.totalPrice, 0),
    }),
    { name: "stuffrental-cart" }
  )
);

export const useArticleStore = create<ArticleStore>()(
  persist(
    (set) => ({
      articles: ARTICLES,
      categories: CATEGORIES,
      addArticle: (data) => {
        const article: Article = {
          ...data,
          id: `art-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ articles: [...state.articles, article] }));
      },
      updateArticle: (id, data) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        }));
      },
      deleteArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id),
        }));
      },
      toggleStatus: (id) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id
              ? { ...a, status: a.status === "active" ? "inactive" : "active" }
              : a
          ),
        }));
      },
      addCategory: (data) => {
        const category: Category = {
          ...data,
          id: `cat-${Date.now()}`,
        };
        set((state) => ({ categories: [...state.categories, category] }));
      },
      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: "stuffrental-admin-v2",
      version: 2,
      migrate: (persistedState, version) => {
        if (!version || version < 2) {
          const s = persistedState as { articles: Article[]; categories: Category[] };
          return {
            ...s,
            articles: s.articles.map((a) => {
              const seed = ARTICLES.find((seed) => seed.id === a.id);
              if (seed) return { ...a, images: seed.images, isPopular: seed.isPopular };
              return a;
            }),
          };
        }
        return persistedState as { articles: Article[]; categories: Category[] };
      },
    }
  )
);

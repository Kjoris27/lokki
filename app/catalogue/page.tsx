"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useArticleStore } from "@/lib/store";
import ArticleCard from "@/components/ArticleCard";
import CategoryCard from "@/components/CategoryCard";

export default function CataloguePage() {
  const { articles, categories } = useArticleStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = articles.filter((a) => {
    if (a.status === "inactive") return false;
    if (selectedCategory && a.categoryId !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = filtered.filter((a) => a.status === "active").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catalogue</h1>
        <p className="text-gray-500 mt-1">
          {activeCount} article{activeCount !== 1 ? "s" : ""} disponible{activeCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un article…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            selectedCategory === null
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
          }`}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-gray-400 gap-3">
          <SlidersHorizontal size={40} className="opacity-30" />
          <p className="text-lg font-medium">Aucun article trouvé</p>
          <button
            onClick={() => { setSearch(""); setSelectedCategory(null); }}
            className="text-indigo-500 text-sm hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Categories section */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Parcourir par catégorie</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const count = articles.filter(
              (a) => a.categoryId === cat.id && a.status === "active"
            ).length;
            return <CategoryCard key={cat.id} category={cat} articleCount={count} />;
          })}
        </div>
      </div>
    </div>
  );
}

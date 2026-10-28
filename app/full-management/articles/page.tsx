"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Star,
} from "lucide-react";
import { useArticleStore } from "@/lib/store";
import { Article } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import ArticleFormModal from "@/components/admin/ArticleFormModal";

export default function AdminArticlesPage() {
  const { articles, categories, deleteArticle, toggleStatus } =
    useArticleStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Article | null>(null);

  function handleEdit(article: Article) {
    setEditTarget(article);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    if (globalThis.confirm("Supprimer ce pack ?")) deleteArticle(id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Packs de jeux</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {articles.map((article) => {
          const cat = categories.find((c) => c.id === article.categoryId);
          return (
            <div
              key={article.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {article.images[0] ? (
                  <Image
                    src={article.images[0]}
                    alt={article.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    📦
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 truncate">
                    {article.name}
                  </span>
                  {article.isPopular && (
                    <Star
                      size={13}
                      className="text-amber-400 shrink-0"
                      fill="currentColor"
                    />
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      article.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {article.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                  <span>{cat ? `${cat.icon} ${cat.name}` : "—"}</span>
                  <span>·</span>
                  <span>{formatPrice(article.pricePerDay)} / 24 h</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleStatus(article.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600"
                  title={article.status === "active" ? "Désactiver" : "Activer"}
                >
                  {article.status === "active" ? (
                    <ToggleRight size={20} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={20} />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(article)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-rose-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <ArticleFormModal
          article={editTarget}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

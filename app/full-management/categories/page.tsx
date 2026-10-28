"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useArticleStore } from "@/lib/store";
import { Category } from "@/lib/types";
import CategoryFormModal from "@/components/admin/CategoryFormModal";

export default function AdminCategoriesPage() {
  const { categories, articles, deleteCategory } = useArticleStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  function handleEdit(cat: Category) {
    setEditTarget(cat);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    const hasArticles = articles.some((a) => a.categoryId === id);
    if (hasArticles) {
      globalThis.alert(
        "Impossible de supprimer : des packs utilisent cette catégorie.",
      );
      return;
    }
    if (globalThis.confirm("Supprimer cette catégorie ?")) deleteCategory(id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          const count = articles.filter((a) => a.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4"
            >
              <span className="text-3xl">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{cat.name}</div>
                <div className="text-sm text-gray-500">{cat.description}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {count} pack{count === 1 ? "" : "s"}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
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
        <CategoryFormModal
          category={editTarget}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

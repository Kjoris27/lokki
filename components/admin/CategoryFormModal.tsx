"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useArticleStore } from "@/lib/store";
import { Category } from "@/lib/types";

const COLOR_OPTIONS = [
  { label: "Violet", value: "bg-violet-100 text-violet-700 border-violet-200" },
  { label: "Rose", value: "bg-rose-100 text-rose-700 border-rose-200" },
  { label: "Amber", value: "bg-amber-100 text-amber-700 border-amber-200" },
  { label: "Bleu", value: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "Vert", value: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { label: "Indigo", value: "bg-indigo-100 text-indigo-700 border-indigo-200" },
];

interface Props {
  category: Category | null;
  onClose: () => void;
}

export default function CategoryFormModal({ category, onClose }: Props) {
  const { addCategory, updateCategory } = useArticleStore();
  const isEdit = !!category;

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "📦");
  const [description, setDescription] = useState(category?.description ?? "");
  const [color, setColor] = useState(category?.color ?? COLOR_OPTIONS[0].value);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim() || !slug.trim()) {
      setError("Nom et slug sont obligatoires.");
      return;
    }
    const slugClean = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const data = {
      name: name.trim(),
      slug: slugClean,
      icon: icon.trim() || "📦",
      description: description.trim(),
      color,
    };
    if (isEdit && category) {
      updateCategory(category.id, data);
    } else {
      addCategory(data);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl">
        <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900">
            {isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Nom *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEdit) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                }}
                placeholder="Loisirs"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="loisirs"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-xs text-gray-500 font-medium">Icône (emoji)</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={4}
                placeholder="🎮"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center text-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 font-medium">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brève description…"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Couleur</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setColor(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${opt.value} ${
                    color === opt.value ? "ring-2 ring-offset-1 ring-indigo-500" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

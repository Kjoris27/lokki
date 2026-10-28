"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useArticleStore } from "@/lib/store";
import { Article, UnavailablePeriod } from "@/lib/types";
import { GAMES } from "@/lib/data";
import { RENTAL_OFFER } from "@/lib/offer";
import { bookingDate } from "@/lib/utils";

interface Props {
  article: Article | null;
  onClose: () => void;
}

export default function ArticleFormModal({ article, onClose }: Props) {
  const { categories, addArticle, updateArticle } = useArticleStore();
  const isEdit = !!article;

  const [name, setName] = useState(article?.name ?? "");
  const [description, setDescription] = useState(article?.description ?? "");
  const [categoryId, setCategoryId] = useState(
    article?.categoryId ?? categories[0]?.id ?? "",
  );
  const pricePerDay = RENTAL_OFFER.pricePerDay;
  const [caution, setCaution] = useState(
    article?.conditions.caution?.toString() ?? "",
  );
  const [minDuration, setMinDuration] = useState(
    article?.conditions.minDuration?.toString() ?? "1",
  );
  const [notes, setNotes] = useState(article?.conditions.notes ?? "");
  const [images, setImages] = useState<string[]>(
    article?.images ?? ["/images/pack-hero.webp"],
  );
  const [unavailable, setUnavailable] = useState<UnavailablePeriod[]>(
    article?.unavailablePeriods ?? [],
  );
  const [status, setStatus] = useState<"active" | "inactive">(
    article?.status ?? "active",
  );
  const [isPopular, setIsPopular] = useState(article?.isPopular ?? false);
  const [error, setError] = useState("");

  function handleImageChange(i: number, val: string) {
    const arr = [...images];
    arr[i] = val;
    setImages(arr);
  }

  function addImage() {
    setImages([...images, ""]);
  }

  function removeImage(i: number) {
    setImages(images.filter((_, idx) => idx !== i));
  }

  function addUnavailable() {
    setUnavailable([...unavailable, { start: "", end: "" }]);
  }

  function removeUnavailable(i: number) {
    setUnavailable(unavailable.filter((_, idx) => idx !== i));
  }

  function updateUnavailable(i: number, field: "start" | "end", val: string) {
    const arr = [...unavailable];
    arr[i] = { ...arr[i], [field]: val };
    setUnavailable(arr);
  }

  function handleSubmit() {
    if (!name.trim() || !categoryId) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const filledImages = images.filter((img) => img.trim());
    const badUrls = filledImages.filter((url) => {
      if (/^\/images\/[\w/.-]+$/.test(url) && !url.includes("..")) return false;
      try {
        const imageUrl = new URL(url);
        return (
          imageUrl.protocol !== "https:" ||
          imageUrl.hostname !== "images.unsplash.com"
        );
      } catch {
        return true;
      }
    });
    if (badUrls.length > 0) {
      setError(
        "Utilisez une image locale /images/… ou une URL https://images.unsplash.com/…",
      );
      return;
    }
    if (
      !Number.isInteger(Number(minDuration)) ||
      Number(minDuration) < 1 ||
      (caution && (!Number.isFinite(Number(caution)) || Number(caution) < 0))
    ) {
      setError("Vérifiez la durée minimale et la caution.");
      return;
    }
    if (
      unavailable.some(
        (period) =>
          !Number.isFinite(bookingDate(period.start).getTime()) ||
          !Number.isFinite(bookingDate(period.end).getTime()) ||
          period.end < period.start,
      )
    ) {
      setError(
        "Chaque période bloquée doit avoir une date de début et de fin valides.",
      );
      return;
    }
    const data = {
      kind: "game-pack" as const,
      gameIds: GAMES.map((game) => game.id),
      name: name.trim(),
      description: description.trim(),
      categoryId,
      pricePerDay: Number(pricePerDay),
      images: filledImages,
      conditions: {
        caution: caution === "" ? undefined : Number(caution),
        minDuration: Number(minDuration) || 1,
        notes: notes.trim() || undefined,
      },
      unavailablePeriods: unavailable.filter((u) => u.start && u.end),
      status,
      isPopular,
    };

    if (isEdit && article) {
      updateArticle(article.id, data);
    } else {
      addArticle(data);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg text-gray-900">
            {isEdit ? "Modifier le pack" : "Nouveau pack de jeux"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Basic */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Informations générales
            </h3>
            <div>
              <label className="text-xs text-gray-500 font-medium">Nom *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Le pack des bons moments"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Description détaillée…"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium">
                  Catégorie *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">
                  Tarif habituel / 24 h (F CFA)
                </label>
                <input
                  type="number"
                  value={pricePerDay}
                  readOnly
                  min="0"
                  placeholder="5000"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>
          </section>

          {/* Conditions */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Modalités de location
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium">
                  Caution (F CFA, facultative)
                </label>
                <input
                  type="number"
                  value={caution}
                  onChange={(e) => setCaution(e.target.value)}
                  min="0"
                  placeholder="50000"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">
                  Durée min. (jours)
                </label>
                <input
                  type="number"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                  min="1"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">
                Notes (optionnel)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Livraison disponible…"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </section>

          {/* Images */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Images (chemins ou URLs)
              </h3>
              <button
                onClick={addImage}
                className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
              >
                <Plus size={12} /> Ajouter
              </button>
            </div>
            {images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  placeholder="https://..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                {images.length > 1 && (
                  <button
                    onClick={() => removeImage(i)}
                    className="text-rose-400 hover:text-rose-600"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Unavailable periods */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Périodes indisponibles
              </h3>
              <button
                onClick={addUnavailable}
                className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
              >
                <Plus size={12} /> Ajouter
              </button>
            </div>
            {unavailable.length === 0 && (
              <p className="text-xs text-gray-400">Aucune période bloquée.</p>
            )}
            {unavailable.map((u, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="date"
                  value={u.start}
                  onChange={(e) =>
                    updateUnavailable(i, "start", e.target.value)
                  }
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <span className="text-gray-400 text-xs">→</span>
                <input
                  type="date"
                  value={u.end}
                  min={u.start}
                  onChange={(e) => updateUnavailable(i, "end", e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button
                  onClick={() => removeUnavailable(i)}
                  className="text-rose-400 hover:text-rose-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </section>

          {/* Status & Popular */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700">Paramètres</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Pack actif</span>
              <input
                type="checkbox"
                checked={status === "active"}
                onChange={(e) =>
                  setStatus(e.target.checked ? "active" : "inactive")
                }
                className="w-4 h-4 accent-indigo-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">
                Marquer comme populaire
              </span>
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
            </label>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3">
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
            {isEdit ? "Enregistrer" : "Créer le pack"}
          </button>
        </div>
      </div>
    </div>
  );
}

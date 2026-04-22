"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { use } from "react";
import { useArticleStore, useCartStore } from "@/lib/store";
import {
  calcDays,
  calcTotal,
  formatPrice,
  isDateRangeAvailable,
} from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { articles, categories } = useArticleStore();
  const addItem = useCartStore((s) => s.addItem);

  // All hooks must be declared before any conditional return
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const article = articles.find((a) => a.id === id);
  if (!article) return notFound();

  const category = categories.find((c) => c.id === article.categoryId);
  const today = new Date().toISOString().split("T")[0];
  const days = calcDays(startDate, endDate);
  const total = calcTotal(article.pricePerDay, days);
  const available = startDate && endDate ? isDateRangeAvailable(article, startDate, endDate) : null;

  const canAdd =
    article.status === "active" &&
    startDate !== "" &&
    endDate !== "" &&
    endDate >= startDate &&
    available === true;

  function handleAdd() {
    if (!canAdd || !article) return;
    addItem(article, startDate, endDate);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        {/* Images */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
            {article.images[imgIndex] && !imgErrors[imgIndex] ? (
              <Image
                src={article.images[imgIndex]}
                alt={article.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={() => setImgErrors((prev) => ({ ...prev, [imgIndex]: true }))}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                📦
              </div>
            )}
            {article.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
                  disabled={imgIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImgIndex((i) => Math.min(article.images.length - 1, i + 1))}
                  disabled={imgIndex === article.images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow disabled:opacity-30"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {article.images.length > 1 && (
            <div className="flex gap-2">
              {article.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === imgIndex ? "border-indigo-500" : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          {/* Category badge */}
          {category && (
            <Link
              href={`/categorie/${category.slug}`}
              className={`self-start text-xs font-semibold px-3 py-1 rounded-full border ${category.color}`}
            >
              {category.icon} {category.name}
            </Link>
          )}

          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{article.name}</h1>
              {article.status === "inactive" && (
                <span className="shrink-0 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                  Indisponible
                </span>
              )}
            </div>
            <p className="text-indigo-600 font-bold text-2xl mt-2">
              {formatPrice(article.pricePerDay)}{" "}
              <span className="text-base font-normal text-gray-400">/ jour</span>
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed">{article.description}</p>

          {/* Conditions */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 text-sm">
            <div className="font-semibold text-gray-700 flex items-center gap-1.5">
              <Info size={15} /> Modalités de location
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Caution</span>
              <span className="font-medium">{formatPrice(article.conditions.caution)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Durée minimale</span>
              <span className="font-medium">
                {article.conditions.minDuration} jour{article.conditions.minDuration > 1 ? "s" : ""}
              </span>
            </div>
            {article.conditions.notes && (
              <p className="text-gray-500 text-xs mt-1 border-t border-gray-200 pt-2">
                {article.conditions.notes}
              </p>
            )}
          </div>

          {/* Date picker */}
          {article.status === "active" && (
            <div className="flex flex-col gap-3">
              <div className="font-semibold text-gray-800 flex items-center gap-1.5 text-sm">
                <Calendar size={15} /> Choisir les dates
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-medium">Début</label>
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && e.target.value > endDate) setEndDate("");
                    }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-medium">Fin</label>
                  <input
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* Unavailable periods */}
              {article.unavailablePeriods.length > 0 && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Certaines dates sont déjà réservées.
                </p>
              )}

              {/* Availability feedback */}
              {startDate && endDate && available === false && (
                <div className="bg-rose-50 text-rose-600 text-sm rounded-lg p-3 flex items-center gap-2">
                  <AlertTriangle size={15} />
                  Ces dates sont déjà prises. Veuillez en choisir d&apos;autres.
                </div>
              )}
              {startDate && endDate && available === true && (
                <div className="bg-emerald-50 text-emerald-700 text-sm rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle size={15} />
                  Disponible ! {days} jour{days > 1 ? "s" : ""} ={" "}
                  <strong>{formatPrice(total)}</strong>
                </div>
              )}
            </div>
          )}

          {/* Add to cart */}
          {article.status === "active" ? (
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-colors ${
                added
                  ? "bg-emerald-500 text-white"
                  : canAdd
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {added ? (
                <>
                  <CheckCircle size={18} /> Ajouté au panier !
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  {!startDate || !endDate
                    ? "Choisissez les dates"
                    : !canAdd
                    ? "Dates indisponibles"
                    : `Ajouter — ${formatPrice(total)}`}
                </>
              )}
            </button>
          ) : (
            <div className="w-full text-center py-3.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium">
              Article momentanément indisponible
            </div>
          )}

          {added && (
            <Link
              href="/panier"
              className="text-center text-indigo-600 text-sm font-medium hover:underline"
            >
              Voir mon panier →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

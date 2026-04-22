"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, Calendar } from "lucide-react";
import { Article } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const isAvailable = article.status === "active";
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/article/${article.id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {article.images[0] && !imgError ? (
          <Image
            src={article.images[0]}
            alt={article.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
            📦
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {article.isPopular && (
            <span className="bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Populaire
            </span>
          )}
          {!isAvailable && (
            <span className="bg-gray-800 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Indisponible
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {article.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{article.description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-indigo-600 font-bold text-base">
            {formatPrice(article.pricePerDay)}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar size={12} /> / jour
          </span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useArticleStore } from "@/lib/store";
import ArticleCard from "@/components/ArticleCard";
import { use } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoriePage({ params }: Props) {
  const { slug } = use(params);
  const { articles, categories } = useArticleStore();

  const category = categories.find((c) => c.slug === slug);
  if (!category) return notFound();

  const categoryArticles = articles.filter(
    (a) => a.categoryId === category.id && a.status === "active"
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/catalogue" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={16} /> Retour au catalogue
      </Link>

      {/* Header */}
      <div className={`rounded-2xl p-6 mb-8 border ${category.color}`}>
        <div className="text-4xl mb-2">{category.icon}</div>
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <p className="mt-1 text-sm opacity-80">{category.description}</p>
        <p className="mt-2 text-sm font-medium">
          {categoryArticles.length} article{categoryArticles.length !== 1 ? "s" : ""} disponible{categoryArticles.length !== 1 ? "s" : ""}
        </p>
      </div>

      {categoryArticles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Aucun article disponible dans cette catégorie.</p>
          <Link href="/catalogue" className="text-indigo-500 text-sm hover:underline mt-2 inline-block">
            Voir tout le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

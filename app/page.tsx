"use client";

import Link from "next/link";
import { ArrowRight, Star, Zap, Search, ShoppingCart, MessageCircle } from "lucide-react";
import { useArticleStore } from "@/lib/store";
import ArticleCard from "@/components/ArticleCard";
import CategoryCard from "@/components/CategoryCard";

export default function HomePage() {
  const { articles, categories } = useArticleStore();
  const activeArticles = articles.filter((a) => a.status === "active");
  const popularArticles = activeArticles.filter((a) => a.isPopular).slice(0, 3);

  const categoryCountMap = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.id] = activeArticles.filter((a) => a.categoryId === cat.id).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm px-4 py-1.5 rounded-full font-medium">
            <Zap size={14} />
            Location rapide &amp; simple
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Louez ce dont vous<br />
            <span className="text-yellow-300">avez besoin</span>
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-xl">
            PS5, sono, drones, tentes… Trouvez l&apos;article idéal et finalisez votre demande via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link href="/catalogue" className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2">
              Voir le catalogue <ArrowRight size={16} />
            </Link>
            <Link href="/panier" className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Mon panier
            </Link>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Comment ça marche ?</h2>
            <p className="text-gray-500 text-sm mt-2">Louer un article en 3 étapes simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Search size={28} />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900">Parcourez le catalogue</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Explorez nos catégories, filtrez par type d&apos;article et trouvez ce qu&apos;il vous faut en quelques secondes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ShoppingCart size={28} />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900">Choisissez vos dates</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Sélectionnez votre date de début et de fin. Le prix total est calculé automatiquement. Ajoutez au panier.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <MessageCircle size={28} />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900">Confirmez via WhatsApp</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Cliquez sur &ldquo;Conclure la demande&rdquo; — un message pré-rempli est envoyé directement à notre équipe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
            <p className="text-gray-500 text-sm mt-1">Trouvez par type d&apos;article</p>
          </div>
          <Link href="/catalogue" className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} articleCount={categoryCountMap[cat.id] ?? 0} />
          ))}
        </div>
      </section>

      {/* Articles populaires */}
      {popularArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Star size={20} className="text-amber-400" fill="currentColor" />
                Articles populaires
              </h2>
              <p className="text-gray-500 text-sm mt-1">Les plus demandés</p>
            </div>
            <Link href="/catalogue" className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} priority={i === 0} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Prêt à louer ?</h3>
            <p className="text-gray-600 mt-1 text-sm">
              Ajoutez vos articles au panier et finalisez votre demande en 30 secondes via WhatsApp.
            </p>
          </div>
          <Link href="/catalogue" className="shrink-0 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
            Commencer <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

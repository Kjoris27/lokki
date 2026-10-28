"use client";

import Link from "next/link";
import { Package, FolderOpen, TrendingUp, Eye, EyeOff } from "lucide-react";
import { useArticleStore } from "@/lib/store";

export default function AdminDashboard() {
  const { articles, categories } = useArticleStore();
  const active = articles.filter((a) => a.status === "active").length;
  const inactive = articles.filter((a) => a.status === "inactive").length;
  const popular = articles.filter((a) => a.isPopular).length;

  const stats = [
    {
      label: "Packs actifs",
      value: active,
      icon: Eye,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Packs inactifs",
      value: inactive,
      icon: EyeOff,
      color: "text-gray-500 bg-gray-100",
    },
    {
      label: "Packs populaires",
      value: popular,
      icon: TrendingUp,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Catégories",
      value: categories.length,
      icon: FolderOpen,
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-2"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}
            >
              <stat.icon size={18} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/full-management/articles"
          className="bg-indigo-600 text-white rounded-2xl p-6 flex items-center gap-4 hover:bg-indigo-700 transition-colors"
        >
          <Package size={28} />
          <div>
            <div className="font-semibold text-lg">Gérer les packs</div>
            <div className="text-indigo-200 text-sm mt-0.5">
              Ajouter, modifier, supprimer
            </div>
          </div>
        </Link>
        <Link
          href="/full-management/categories"
          className="bg-white border border-gray-100 text-gray-900 rounded-2xl p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <FolderOpen size={28} className="text-indigo-600" />
          <div>
            <div className="font-semibold text-lg">Gérer les catégories</div>
            <div className="text-gray-500 text-sm mt-0.5">
              Ajouter, modifier, supprimer
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

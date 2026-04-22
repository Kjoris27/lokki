import Link from "next/link";
import { Category } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  articleCount?: number;
}

export default function CategoryCard({ category, articleCount }: CategoryCardProps) {
  return (
    <Link
      href={`/categorie/${category.slug}`}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-md ${category.color}`}
    >
      <span className="text-3xl">{category.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base">{category.name}</div>
        <div className="text-xs mt-0.5 line-clamp-1 opacity-75">{category.description}</div>
        {articleCount !== undefined && (
          <div className="text-xs font-medium mt-1 opacity-80">
            {articleCount} article{articleCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
      <ChevronRight size={18} className="opacity-50 shrink-0" />
    </Link>
  );
}

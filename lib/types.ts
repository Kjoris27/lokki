export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

export interface ArticleConditions {
  caution: number;
  minDuration: number;
  notes?: string;
}

export interface UnavailablePeriod {
  start: string; // ISO date string YYYY-MM-DD
  end: string;
}

export interface Article {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  images: string[];
  pricePerDay: number;
  conditions: ArticleConditions;
  unavailablePeriods: UnavailablePeriod[];
  status: "active" | "inactive";
  isPopular?: boolean;
  createdAt: string;
}

export interface CartItem {
  cartItemId: string;
  articleId: string;
  article: Article;
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
}

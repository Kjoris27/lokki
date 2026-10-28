import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Check } from "lucide-react";
import type { Article } from "@/lib/types";
import { GAMES } from "@/lib/data";
import { HOLIDAY_PROMOTION } from "@/lib/offer";
import PriceTag from "./PriceTag";

export default function ArticleCard({
  article,
  priority = false,
}: {
  article: Article;
  priority?: boolean;
}) {
  return (
    <article className="catalogue-pack-card">
      <div className="catalogue-pack-image">
        <Image
          src={article.images[0] || "/images/pack-hero.webp"}
          alt={`Illustration de ${article.name}`}
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
          preload={priority}
          className="object-contain"
        />
        <span className="pack-photo-note">Visuel d’illustration</span>
      </div>
      <div className="catalogue-pack-content">
        <span className="eyebrow">
          {article.gameIds.length} JEUX · 1 SEUL PACK
        </span>
        <h2>{article.name}</h2>
        <p>{article.description}</p>
        <ul className="pack-checklist">
          {GAMES.filter((game) => article.gameIds.includes(game.id)).map(
            (game) => (
              <li key={game.id}>
                <Check size={15} />
                {game.name}
              </li>
            ),
          )}
        </ul>
        {HOLIDAY_PROMOTION.enabled && (
          <span className="small-offer">
            Offre de fêtes : −{HOLIDAY_PROMOTION.discountPercent} % appliqués
            automatiquement.
          </span>
        )}
        <PriceTag price={article.pricePerDay} />
        <span className="free-delivery">
          <Truck size={16} /> Livraison gratuite
        </span>
        <Link href={`/article/${article.id}`} className="button button-primary">
          Choisir mes dates <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

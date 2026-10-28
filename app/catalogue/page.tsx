"use client";

import { PackageOpen, Truck, Clock3, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useArticleStore } from "@/lib/store";
import ArticleCard from "@/components/ArticleCard";
import GameGrid from "@/components/GameGrid";

export default function CataloguePage() {
  const packs = useArticleStore((state) => state.articles).filter(
    (article) => article.kind === "game-pack" && article.status === "active",
  );
  return (
    <div className="shell page-space">
      <div className="catalogue-heading">
        <span className="eyebrow">CHOISISSEZ LE FUN</span>
        <h1>
          Un pack complet.
          <br />
          <span className="blue-text">Une bonne idée de soirée.</span>
        </h1>
        <p>Cinq jeux réunis, un seul tarif, et la livraison offerte.</p>
        <div className="benefit-pills">
          <span>
            <PackageOpen size={16} /> 5 jeux dans chaque pack
          </span>
          <span>
            <Clock3 size={16} /> Dès 24 h
          </span>
          <span>
            <Truck size={16} /> Livraison gratuite
          </span>
        </div>
      </div>
      {packs.length ? (
        <div className="catalogue-packs">
          {packs.map((pack, i) => (
            <ArticleCard key={pack.id} article={pack} priority={i === 0} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <PackageOpen size={48} />
          <h2>Aucun pack disponible pour le moment.</h2>
          <p>Revenez bientôt pour la prochaine partie.</p>
          <Link href="/" className="button button-primary">
            Retour à l’accueil <ArrowRight size={16} />
          </Link>
        </div>
      )}
      <div className="section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow">TOUS INCLUS</span>
            <h2>
              De quoi changer de jeu.
              <br />
              <span className="blue-text">Pas de bonne humeur.</span>
            </h2>
          </div>
        </div>
        <GameGrid />
        <p className="illustration-note">
          Les jeux sont proposés en pack uniquement. Visuels d’illustration.
        </p>
      </div>
    </div>
  );
}

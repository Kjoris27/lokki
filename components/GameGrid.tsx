import Image from "next/image";
import { Check } from "lucide-react";
import { GAMES } from "@/lib/data";

export default function GameGrid({
  gameIds = GAMES.map((game) => game.id),
}: {
  gameIds?: readonly string[];
}) {
  return (
    <div className="game-grid">
      {GAMES.filter((game) => gameIds.includes(game.id)).map((game, i) => (
        <article key={game.id} className={`game-card game-${game.color}`}>
          <div className="game-art">
            <span className="game-number">0{i + 1}</span>
            <Image
              src={game.image}
              alt={`Illustration du jeu ${game.name}`}
              fill
              sizes="(max-width: 600px) 45vw, (max-width: 900px) 30vw, 230px"
              className="game-image"
            />
          </div>
          <div className="game-info">
            <span className="game-tag">{game.tag}</span>
            <h3>{game.name}</h3>
            <p>{game.mood}</p>
            <span className="game-included">
              <Check size={13} /> Inclus dans le pack
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

import Image from "next/image";
import { GAMES } from "@/lib/data";

// Transparent game illustrations keep their original colors on a dark canvas.
// Custom catalogue photos continue to render as supplied by the owner.
export default function PackArtwork({
  src = "/images/pack-hero.webp",
  alt,
  sizes,
  preload = false,
  fill = false,
}: {
  src?: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  fill?: boolean;
}) {
  const themed = src === "/images/pack-hero.webp";
  return (
    <div
      className={`pack-artwork${fill ? " pack-artwork-fill" : ""}${themed ? " pack-artwork-themed" : ""}`}
      role="img"
      aria-label={alt}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        preload={preload}
        className="pack-artwork-photo"
        aria-hidden="true"
      />
      {themed && (
        <div className="pack-artwork-night" aria-hidden="true">
          {GAMES.map((game) => (
            <div className={`pack-piece pack-piece-${game.id}`} key={game.id}>
              <Image
                src={game.image}
                alt=""
                fill
                sizes={sizes}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

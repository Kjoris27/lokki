# Lokki

Location de packs de jeux à Lomé. Application Next.js 16, React 19, Tailwind CSS 4 et Zustand.

## Offre

- Un pack complet : Monopoly, Ludo personnalisé, Uno, Jenga et Scrabble. Aucun jeu ni équipement à louer séparément.
- Tarif habituel : **7 000 F CFA par pack et par tranche de 24 h**.
- **Livraison gratuite**.
- Offre de fêtes activée : **−20 %, soit 5 600 F CFA pour 24 h**. La même remise s’applique aux tranches supplémentaires : 48 h = 11 200 F CFA.

Le propriétaire n’a pas encore fixé de date de fin. À la fin des fêtes, passer `HOLIDAY_PROMOTION.enabled` à `false` dans `lib/offer.ts`, puis redéployer. Les affichages, récapitulatifs, paniers existants et messages WhatsApp utilisent ce réglage commun. Les dates et heures sont toujours exprimées en heure de Lomé (UTC).

Les tarifs sont des montants de location. Aucune caution n’est inventée : ce champ est facultatif dans l’administration. Les modalités de restitution sont confirmées avec l’équipe.

## Démarrer

```sh
npm ci
npm run dev
```

Puis ouvrir http://localhost:3000.

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Node.js 20.9 ou plus récent requis par Next.js. Les tests TypeScript utilisent `tsx` via le mécanisme `--import` de Node.

## Parcours

Accueil → pack → date et heure de livraison → durée (jours de 24 h) → réservation → nom et adresse → WhatsApp. Le message contient les cinq jeux, la livraison et la restitution souhaitées, le tarif habituel, la remise et le total. Le client doit encore envoyer le message ; aucune réservation ni aucun paiement n’est confirmé automatiquement.

Le numéro WhatsApp existant est conservé dans `lib/data.ts`.

Les URL de catégories historiques redirigent vers le nouveau catalogue. Le stockage existant est migré : les anciens équipements sont remplacés par le pack ; les anciens paniers, dont les durées étaient calculées en jours calendaires inclusifs, sont vidés.

## Données et disponibilité

L’architecture existante reste locale au navigateur : Zustand et `localStorage`. Les modifications de catalogue faites dans l’administration ne sont pas partagées entre appareils. Les périodes bloquées empêchent une demande sur ces dates dans ce navigateur ; elles ne constituent pas un inventaire global. La disponibilité effective et le créneau de livraison sont donc confirmés manuellement sur WhatsApp. Une base de données et une authentification serveur seraient nécessaires pour une gestion multiutilisateur.

## Visuels

Six illustrations originales sont intégrées dans `public/images/` : le pack et les cinq jeux. Les fichiers WebP individuels ont un fond transparent. Elles illustrent l’offre et ne prétendent pas photographier le stock ou le rangement réel.

Voir [les prompts et chemins des visuels](docs/generated-assets.md).

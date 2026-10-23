# MQS Advisor

Site vitrine bilingue (FR/EN) de MQS_Advisor : studio produit et incubateur (Canada, France, Sénégal, Djibouti), avec la marque DIGIAFRICA pour les plateformes publiques en Afrique.

## Stack

- [TanStack Start](https://tanstack.com/start) + React 19, routage par fichiers dans `src/routes/`
- Tailwind CSS 4, composants shadcn/ui dans `src/components/ui/`
- Textes FR/EN dans `src/i18n/fr.ts` et `src/i18n/en.ts`
- Formulaires Contact et Rejoindre envoyés directement à Supabase (table `submissions`, bucket `attachments`)

Le site est entièrement **statique** : chaque page est pré-rendue en HTML au build, ce qui permet de l'héberger sur GitHub Pages.

## Développement

```sh
bun install
bun run dev      # http://localhost:8080
bun run test     # tests des dictionnaires
bun run build    # site statique dans dist/client
```

Variables d'environnement (`.env`) : `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Déploiement

Chaque push sur `main` lance [.github/workflows/deploy.yml](.github/workflows/deploy.yml), qui construit le site et le publie sur GitHub Pages.

Prérequis, une seule fois : dans le repo GitHub, **Settings → Pages → Source : GitHub Actions**.

Pour construire localement avec le même chemin que GitHub Pages :

```sh
BASE_PATH=/mqs-advisor/ SITE_URL=https://ermt0504.github.io/mqs-advisor bun run build
```

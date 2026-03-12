# Tétrarchie Synthétique v2

Plateforme techno-politique de débats IA en temps réel, avec 4 personas pilotées par l’API OpenAI.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Zustand (state client)
- Framer Motion (micro-animations)
- OpenAI Node SDK (orchestration débat multi-persona)

## Architecture IA (OpenAI)

### 1) Orchestrateur central côté serveur

- Route API: `POST /api/debate/turn`
- Service: `lib/server/debate-orchestrator.ts`
- Rôle:
  - choisir le prochain speaker
  - injecter l’intervention humaine selon protocole
  - appeler OpenAI avec le **system prompt constitutionnel** + **system prompt persona**
  - retourner message court + métadonnées débat

### 2) Prompts séparés par persona

- `lib/ai/persona-prompts.ts`
- Contient:
  - `DEBATE_CONSTITUTION` (règles strictes: messages courts, ton incarné, pas de pavés)
  - `PERSONA_SYSTEM_PROMPTS` (Seren / Aegis / Nexus / Equinox)

### 3) État temps réel côté client

- `store/debate-store.ts`
- Rôle:
  - initialiser le débat (bootstrap des 4 premières prises de parole via API)
  - avancer les tours en pseudo temps réel
  - lever la main / pause / reprise / reset
  - stocker erreurs d’infrastructure (clé manquante, API indisponible)

## Variables d’environnement (où mettre les secrets ?)

### Production (Fly.io)

Pour l'application en ligne (`tetrarchie-synthetique-v2.fly.dev`), les secrets doivent être définis **dans Fly.io** (pas dans GitHub Pages):

```bash
fly secrets set OPENAI_API_KEY=... OPENAI_MODEL=gpt-5.4 -a tetrarchie-synthetique-v2
```

Puis redéployer/redémarrer l'app Fly pour prise en compte.


Noms exacts à créer dans Fly.io (et valeurs attendues):

- `OPENAI_API_KEY` (**obligatoire**) : ta clé API OpenAI (ex: `sk-...`).
- `OPENAI_MODEL` (**optionnel**) : modèle à utiliser (défaut du projet: `gpt-5.4`).

Exemples commande par commande:

```bash
fly secrets set OPENAI_API_KEY=sk-... -a tetrarchie-synthetique-v2
fly secrets set OPENAI_MODEL=gpt-5.4 -a tetrarchie-synthetique-v2
```

Format demandé par l'interface Fly.io:

- **Name**: `OPENAI_API_KEY` / `OPENAI_MODEL`
- **Secret**: la valeur réelle (clé ou nom de modèle)

### GitHub (optionnel)

Les secrets GitHub (`Settings > Secrets and variables > Actions`) ne servent que si vous utilisez un workflow GitHub Actions (CI/CD, déploiement automatisé, etc.).
Actuellement, ce dépôt ne contient pas de workflow de déploiement Fly, donc ces secrets ne sont pas nécessaires pour faire tourner la prod.

### Local

En local, vous pouvez utiliser un `.env.local`:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.4
```

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Structure

- `app/`
  - `page.tsx` : landing
  - `create/page.tsx` : création salon
  - `debate/page.tsx` : salon débat
  - `api/debate/turn/route.ts` : endpoint orchestration IA
- `components/debate/` : cartes IA, stream, contrôles, métriques, board
- `data/personas.ts` : identité visuelle + rôle des 4 IA
- `lib/ai/persona-prompts.ts` : prompts système IA
- `lib/server/openai-client.ts` : client OpenAI + model
- `lib/server/debate-orchestrator.ts` : logique multi-agent serveur
- `lib/debate-engine.ts` : rotation + meta + insertion humaine
- `store/debate-store.ts` : état global client

## Pourquoi GitHub Pages et Fly.io affichent des choses différentes ?

- **Fly.io** exécute l'application Next.js avec un serveur Node (SSR + routes API).
- **GitHub Pages** sert uniquement des fichiers statiques (HTML/CSS/JS), sans backend Node ni routes API Next.

Résultat: la version Fly.io est la vraie app complète, tandis que GitHub Pages ne peut pas exécuter toute cette architecture.

## Faire pointer GitHub Pages vers Fly.io (recommandé)

Ce dépôt inclut `docs/index.html` et `docs/404.html` qui redirigent automatiquement vers:

- `https://tetrarchie-synthetique-v2.fly.dev/`

Configuration à appliquer dans GitHub:

1. Repository **Settings** > **Pages**
2. **Build and deployment** > **Source**: *Deploy from a branch*
3. **Branch**: `main` et **Folder**: `/docs`
4. Enregistrer

Après propagation, `https://slyreus.github.io/Tetrarchie-Synthetique-v2/` redirigera vers Fly.io.

## Évolutions backend recommandées

- persistance historique par salon (PostgreSQL)
- websocket pour live multi-utilisateur
- file de parole collaborative
- observabilité (latence/tokens/coût par persona)
- versionnement des prompts par persona

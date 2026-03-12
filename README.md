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

## Variables d’environnement (GitHub privé)

Configurer les secrets dans GitHub (Settings > Secrets and variables > Actions / Environment):

- `OPENAI_API_KEY` (obligatoire)
- `OPENAI_MODEL` (optionnel, défaut: `gpt-4.1`)

En local, vous pouvez utiliser un `.env.local`:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1
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

## Évolutions backend recommandées

- persistance historique par salon (PostgreSQL)
- websocket pour live multi-utilisateur
- file de parole collaborative
- observabilité (latence/tokens/coût par persona)
- versionnement des prompts par persona

import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PERSONAS } from '@/data/personas';

export default function HomePage() {
  return (
    <AppShell>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-mesh-radial p-6 md:p-10">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-slate-300">Plateforme de débat politique assisté par IA</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Le plateau de débat du futur.<br />
            <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              Vivant, fluide, contradictoire.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Créez un salon en 20 secondes, observez 4 IA débattre avec des prises de parole courtes, puis intervenez au bon moment.
          </p>
          <div className="mt-8">
            <Link href="/create" className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 font-semibold text-white">
              Créer un débat
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-10 grid gap-4 md:grid-cols-4">
          {PERSONAS.map((p) => (
            <div key={p.id} className="panel p-4">
              <p className="text-base font-semibold" style={{ color: p.color }}>
                {p.name}
              </p>
              <p className="text-xs text-slate-300">{p.role}</p>
              <p className="mt-2 text-xs text-slate-400">{p.absoluteGoal}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-6 panel p-4 md:p-5">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Aperçu live</p>
          <div className="space-y-2 text-sm text-slate-100">
            <p><span className="text-rose-300">Seren:</span> Tu protèges l’ordre, pas les personnes.</p>
            <p><span className="text-cyan-300">Aegis:</span> Sans ordre, il n’y a plus de personnes à protéger.</p>
            <p><span className="text-violet-300">Nexus:</span> Le coût d’inaction nous plombe déjà.</p>
            <p><span className="text-emerald-200">Equinox:</span> Je reformule: cadre strict + garde-fous sociaux.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

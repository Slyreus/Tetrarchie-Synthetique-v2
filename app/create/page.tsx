'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { DebateConfig } from '@/lib/types';
import { useDebateStore } from '@/store/debate-store';

const defaultConfig: DebateConfig = {
  topic: '',
  tension: 'Modéré',
  duration: 'Standard',
  userMode: 'Intervention ponctuelle',
  angle: 'Libre',
  animationPace: 'Normal',
  spectacleMode: true
};

export default function CreateRoomPage() {
  const router = useRouter();
  const { initializeDebate, loading, error } = useDebateStore();
  const [config, setConfig] = useState<DebateConfig>(defaultConfig);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!config.topic.trim()) return;
    const ok = await initializeDebate(config);
    if (ok) router.push('/debate');
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl panel p-6 md:p-8">
        <h1 className="text-2xl font-semibold">Créer un salon de débat</h1>
        <p className="mt-1 text-sm text-slate-400">Configurez la dynamique politique en moins d’une minute.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Sujet du débat">
            <input
              required
              value={config.topic}
              onChange={(e) => setConfig((s) => ({ ...s, topic: e.target.value }))}
              placeholder="Ex: L’État doit-il imposer des garde-fous à l’IA ?"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Niveau de tension"
              value={config.tension}
              onChange={(value) => setConfig((s) => ({ ...s, tension: value as DebateConfig['tension'] }))}
              options={['Modéré', 'Offensif', 'Critique', 'Crise']}
            />
            <SelectField
              label="Durée"
              value={config.duration}
              onChange={(value) => setConfig((s) => ({ ...s, duration: value as DebateConfig['duration'] }))}
              options={['Court', 'Standard', 'Approfondi']}
            />
            <SelectField
              label="Mode utilisateur"
              value={config.userMode}
              onChange={(value) => setConfig((s) => ({ ...s, userMode: value as DebateConfig['userMode'] }))}
              options={['Observateur', 'Intervention ponctuelle', 'Modérateur actif']}
            />
            <SelectField
              label="Angle dominant"
              value={config.angle}
              onChange={(value) => setConfig((s) => ({ ...s, angle: value as DebateConfig['angle'] }))}
              options={['Social', 'Sécuritaire', 'Économique', 'Équilibré', 'Libre']}
            />
            <SelectField
              label="Rythme"
              value={config.animationPace}
              onChange={(value) => setConfig((s) => ({ ...s, animationPace: value as DebateConfig['animationPace'] }))}
              options={['Lent', 'Normal', 'Nerveux']}
            />
            <Field label="Ambiance">
              <label className="flex h-[46px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-sm">
                <input
                  type="checkbox"
                  checked={config.spectacleMode}
                  onChange={(e) => setConfig((s) => ({ ...s, spectacleMode: e.target.checked }))}
                />
                Mode spectacle immersif
              </label>
            </Field>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Initialisation IA..." : "Lancer le débat"}
          </button>
          {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        </form>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[46px] w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none focus:border-cyan-400"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900">
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

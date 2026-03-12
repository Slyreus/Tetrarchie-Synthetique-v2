import { DebateMeta } from '@/lib/types';
import { formatPercent } from '@/lib/utils';

export function DebateMetrics({ meta }: { meta: DebateMeta | null }) {
  if (!meta) return null;

  return (
    <div className="panel space-y-3 p-4 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <Metric label="Température" value={formatPercent(meta.temperature)} />
        <Metric label="Polarisation" value={formatPercent(meta.polarization)} />
        <Metric label="Axe dominant" value={meta.dominantAxis} />
        <Metric label="État" value={meta.globalState} />
      </div>
      <div>
        <p className="mb-1 text-xs text-slate-400">Consensus</p>
        <ul className="space-y-1 text-xs text-slate-200">
          {meta.consensus.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-1 text-xs text-slate-400">Points de friction</p>
        <ul className="space-y-1 text-xs text-slate-200">
          {meta.frictions.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}

import { compactNumber } from "@/lib/format";

export function KpiCard({ label, value, valueLabel}:{ label: string; value?: number; valueLabel?: string }){
  return (
    <div className="card-surface p-4">
      <div className="text-xs text-white/60 mb-1">{label}</div>
      <div className="text-2xl font-semibold tracking-tight">{valueLabel ?? compactNumber(value)}</div>
    </div>
  );
}

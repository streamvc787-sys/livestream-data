import { KpiCard } from "./KpiCard";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiRow({ kpis, isLoading}:{
  kpis?: { totalStreams: number; totalParticipants: number; peakParticipants: number; updatedAt: string };
  isLoading: boolean; updatedAt?: string;
}){
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[0,1,2].map(i=> <Skeleton key={i} className="h-24 card-surface"/>) }
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <KpiCard label="Total Streams" value={kpis?.totalStreams ?? 0} />
      <KpiCard label="Total Viewers" value={kpis?.totalParticipants ?? 0} />
      <KpiCard label="Peak Viewers" value={kpis?.peakParticipants ?? 0} />
    </div>
  );
}

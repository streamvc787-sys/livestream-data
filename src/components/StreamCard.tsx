import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { compactNumber, titleOf, handleOf, uptimeFrom, updatedLabel } from "@/lib/format";

export function StreamCard({ item }:{ item: unknown }){
  if (!item) {
    return (
      <div className="card-surface p-3 flex gap-3">
        <div className="h-16 w-24 bg-white/5 border border-border rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded animate-pulse" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }
  
  const streamItem = item as { 
    title?: string; 
    name?: string; 
    handle?: string; 
    status?: string;
    is_currently_live?: boolean;
    thumbnail?: string;
    thumbnail_url?: string; 
    num_participants?: number; 
    started_at?: string; 
    created_at?: string;
    updated_at?: string;
    mint?: string;
  };
  const title = titleOf(streamItem);
  const handle = handleOf(streamItem);
  const status = streamItem.is_currently_live ? "LIVE" : (streamItem.status ?? "").toUpperCase();
  const pumpFunUrl = streamItem.mint ? `https://pump.fun/${streamItem.mint}` : null;

  const cardContent = (
    <div className="card-surface p-3 flex gap-3 hover:opacity-80 transition-opacity">
      <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-white/5 border border-border shrink-0">
        {(streamItem.thumbnail || streamItem.thumbnail_url) && (
          <Image 
            src={streamItem.thumbnail || streamItem.thumbnail_url || ''} 
            alt="thumb" 
            fill 
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate font-medium">{title}</div>
          <Badge variant={status==='LIVE' ? 'default':'secondary'} className={status==='LIVE'?'bg-green-600':'bg-white/10'}>{status || '–'}</Badge>
        </div>
        <div className="text-xs text-white/60 truncate">{handle}</div>
        <div className="text-sm mt-1">👥 {compactNumber(streamItem.num_participants ?? 0)} <span className="text-white/50">·</span> ⏱ {uptimeFrom(streamItem.started_at || streamItem.created_at)} <span className="text-white/50">·</span> {updatedLabel(streamItem.updated_at)}</div>
      </div>
    </div>
  );

  if (pumpFunUrl) {
    return (
      <a 
        href={pumpFunUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

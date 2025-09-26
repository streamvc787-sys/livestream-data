'use client';

import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Stream } from '@/lib/types';
import { 
  getStreamDisplayName, 
  getStreamHandle, 
  calculateUptime, 
  formatCompactNumber 
} from '@/lib/format';
import Image from 'next/image';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface StreamRowProps {
  stream: Stream;
  rank: number;
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export function StreamRow({ 
  stream, 
  rank, 
  isLoading = false, 
  sortBy, 
  sortOrder 
}: StreamRowProps) {
  if (isLoading) {
    return (
      <TableRow className="hover:bg-muted/50">
        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
        <TableCell>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
      </TableRow>
    );
  }

  const displayName = getStreamDisplayName(stream);
  const handle = getStreamHandle(stream);
  const participants = stream.num_participants || 0;
  const chatMembers = stream.chat_members || 0;
  const replyCount = stream.reply_count || 0;
  const uptime = calculateUptime(stream.created_at);
  const pumpFunUrl = stream.mint ? `https://pump.fun/${stream.mint}` : null;
  const pastStreams = stream.counts_streams || 0;

  const showSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'ASC' ? (
      <ChevronUp className="h-3 w-3 ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1" />
    );
  };

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      {/* Rank */}
      <TableCell className="font-medium text-muted-foreground">
        #{rank}
      </TableCell>

      {/* Stream/Creator */}
      <TableCell>
        {pumpFunUrl ? (
          <a 
            href={pumpFunUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            {/* Avatar/Thumbnail */}
            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {stream.thumbnail || stream.image_uri ? (
                <Image
                  src={stream.thumbnail || stream.image_uri || ''}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Handle */}
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">
                {displayName}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                @{handle}
              </div>
            </div>
          </a>
        ) : (
          <div className="flex items-center space-x-3">
            {/* Avatar/Thumbnail */}
            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {stream.thumbnail || stream.image_uri ? (
                <Image
                  src={stream.thumbnail || stream.image_uri || ''}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Handle */}
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">
                {displayName}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                @{handle}
              </div>
            </div>
          </div>
        )}
      </TableCell>

      {/* Viewers */}
      <TableCell className="font-medium">
        <div className="flex items-center">
          {formatCompactNumber(participants)}
          {showSortIcon('num_participants')}
        </div>
      </TableCell>

      {/* Chat member/replies */}
      <TableCell>
        {chatMembers > 0 || replyCount > 0 ? 
          `${formatCompactNumber(chatMembers)} / ${formatCompactNumber(replyCount)}` : 
          '-'
        }
      </TableCell>

      {/* Uptime */}
      <TableCell className="text-sm text-muted-foreground">
        {uptime !== 'Unknown' ? uptime : '-'}
      </TableCell>

      {/* Past Streams */}
      <TableCell className="text-sm text-muted-foreground">
        {pastStreams > 0 ? pastStreams : '-'}
      </TableCell>
    </TableRow>
  );
}

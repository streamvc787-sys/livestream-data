'use client';

import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Stream } from '@/lib/types';
import { StreamRow } from './StreamRow';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';

interface StreamTableProps {
  streams: Stream[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  onSort?: (field: string) => void;
  offset?: number;
}

export function StreamTable({
  streams,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
  sortBy,
  sortOrder,
  onSort,
  offset = 0
}: StreamTableProps) {
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        {sortBy === field && (
          sortOrder === 'ASC' ? (
            <ChevronUp className="h-3 w-3 ml-1" />
          ) : (
            <ChevronDown className="h-3 w-3 ml-1" />
          )
        )}
      </div>
    </Button>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Stream / Creator</TableHead>
                <TableHead className="w-24">Viewers</TableHead>
                <TableHead className="w-24">Chat member/replies</TableHead>
                <TableHead className="w-24">Uptime</TableHead>
                <TableHead className="w-24">Past Streams</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <StreamRow
                  key={i}
                  stream={{} as Stream}
                  rank={offset + i + 1}
                  isLoading={true}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">No streams found</p>
          <p className="text-sm mt-1">Try adjusting your filters or check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Stream / Creator</TableHead>
              <TableHead className="w-24">
                <SortButton field="num_participants">
                  Viewers
                </SortButton>
              </TableHead>
              <TableHead className="w-24">
                <SortButton field="viewer_count">
                  Chat member/replies
                </SortButton>
              </TableHead>
              <TableHead className="w-24">
                <SortButton field="started_at">
                  Uptime
                </SortButton>
              </TableHead>
              <TableHead className="w-24">Past Streams</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {streams.map((stream, index) => (
              <StreamRow
                key={stream.id || index}
                stream={stream}
                rank={offset + index + 1}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="w-full max-w-xs"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

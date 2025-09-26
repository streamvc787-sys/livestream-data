'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Controls } from './Controls';
import { StreamFilters } from '@/lib/types';

interface HeaderBarProps {
  filters: StreamFilters;
  onFiltersChange: (filters: Partial<StreamFilters>) => void;
  isPolling: boolean;
  onPollingChange: (value: boolean) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  countdown?: number;
}

export function HeaderBar({
  filters,
  onFiltersChange,
  isPolling,
  onPollingChange,
  isRefreshing,
  onRefresh,
  countdown
}: HeaderBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-4">
          {/* Logo and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Image 
                src="/logo.svg" 
                alt="Stream VC" 
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              
              {/* Category Links */}
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  PumpFun
                </Link>
                <span className="text-sm text-muted-foreground cursor-not-allowed">
                  Twitch
                </span>
                <span className="text-sm text-muted-foreground cursor-not-allowed">
                  Kick
                </span>
              </div>
            </div>
            
            {/* Live indicator */}
            {isPolling && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>Live updating...</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <Controls
            search={filters.search}
            onSearchChange={(value) => onFiltersChange({ search: value })}
            sortBy={filters.sortBy}
            onSortByChange={(value) => onFiltersChange({ sortBy: value })}
            sortOrder={filters.sortOrder}
            onSortOrderChange={(value) => onFiltersChange({ sortOrder: value })}
            limit={filters.limit}
            onLimitChange={(value) => onFiltersChange({ limit: value, offset: 0 })}
            isPolling={isPolling}
            onPollingChange={onPollingChange}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
            countdown={countdown}
          />
        </div>
      </div>
    </header>
  );
}

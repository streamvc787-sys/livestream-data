'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SORT_OPTIONS, LIMIT_OPTIONS } from '@/lib/types';
import { Search, RefreshCw, Loader2 } from 'lucide-react';
import { formatCountdown } from '@/lib/format';

interface ControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: 'ASC' | 'DESC';
  onSortOrderChange: (value: 'ASC' | 'DESC') => void;
  limit: number;
  onLimitChange: (value: number) => void;
  isPolling: boolean;
  onPollingChange: (value: boolean) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  countdown?: number;
  className?: string;
}

export function Controls({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  limit,
  onLimitChange,
  isPolling,
  onPollingChange,
  isRefreshing = false,
  onRefresh,
  countdown = 0,
  className = ''
}: ControlsProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center ${className}`}>
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search streams..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onSortOrderChange(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
          className="px-3"
        >
          {sortOrder === 'ASC' ? '↑' : '↓'}
        </Button>
      </div>

      {/* Limit */}
      <Select value={limit.toString()} onValueChange={(value) => onLimitChange(parseInt(value))}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LIMIT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Polling Toggle */}
      <div className="flex items-center gap-2">
        <Switch
          checked={isPolling}
          onCheckedChange={onPollingChange}
          id="polling-toggle"
        />
        <label htmlFor="polling-toggle" className="text-sm font-medium">
          Live
        </label>
        {isPolling && countdown > 0 && (
          <span className="text-xs text-muted-foreground">
            ({formatCountdown(countdown)})
          </span>
        )}
      </div>

      {/* Refresh Button */}
      {onRefresh && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="px-3"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}

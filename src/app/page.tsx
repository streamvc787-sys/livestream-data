'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { HeaderBar } from '@/components/HeaderBar';
import { KpiCard } from '@/components/KpiCard';
import { StreamTable } from '@/components/StreamTable';
import { StreamCard } from '@/components/StreamCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { StreamCardSkeleton } from '@/components/Skeletons';
import { fetchStreams, calculateKpiData, fetchAllStreamsForKpi } from '@/lib/api';
import { StreamFilters } from '@/lib/types';

const POLLING_INTERVAL = 15000; // 15 seconds

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<StreamFilters>(() => ({
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'num_participants',
    sortOrder: (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'DESC',
    limit: parseInt(searchParams.get('limit') || '20'),
    offset: parseInt(searchParams.get('offset') || '0'),
  }));

  // Pagination state
  const [currentPage, setCurrentPage] = useState(() => {
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '20');
    return Math.floor(offset / limit) + 1;
  });

  const [isPolling, setIsPolling] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: Partial<StreamFilters>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: Partial<StreamFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Reset to first page when changing filters (except offset)
      if (newFilters.search !== undefined || newFilters.sortBy !== undefined || newFilters.sortOrder !== undefined || newFilters.limit !== undefined) {
        updated.offset = 0;
        setCurrentPage(1);
      }
      return updated;
    });
  }, []);

  // Update URL when filters change
  useEffect(() => {
    updateURL(filters);
  }, [filters, updateURL]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    const limit = Number(filters.limit) || 20;
    const newOffset = (page - 1) * limit;
    setCurrentPage(page);
    setFilters(prev => ({
      ...prev,
      offset: newOffset
    }));
  }, [filters.limit]);

  // Countdown timer for polling
  useEffect(() => {
    if (!isPolling) {
      setCountdown(0);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return POLLING_INTERVAL / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPolling]);

  // Main data query
  const {
    data: streamsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['streams', filters],
    queryFn: () => fetchStreams({
      limit: filters.limit,
      offset: filters.offset,
      sort_by: filters.sortBy as 'num_participants' | 'created_at' | 'started_at' | 'viewer_count',
      sort_order: filters.sortOrder,
    }),
    refetchInterval: isPolling ? POLLING_INTERVAL : false,
    refetchIntervalInBackground: false,
  });

  // Query for total participants across all streams
  const {
    data: allStreamsKpi
  } = useQuery({
    queryKey: ['all-streams-kpi'],
    queryFn: fetchAllStreamsForKpi,
    refetchInterval: isPolling ? POLLING_INTERVAL : false,
    refetchIntervalInBackground: false,
    // Cache for 5 minutes to avoid excessive API calls
    staleTime: 5 * 60 * 1000,
  });

  // Calculate pagination info
  const totalStreams = Number(streamsData?.data?.metadata?.total) || 0;
  const limit = Number(filters.limit) || 20;
  const totalPages = Math.ceil(totalStreams / limit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  }, [hasNextPage, currentPage, handlePageChange]);

  const handlePrevPage = useCallback(() => {
    if (hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  }, [hasPrevPage, currentPage, handlePageChange]);

  // Filter streams by search
  const filteredStreams = streamsData?.data?.data?.filter(stream => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    const title = stream.title || stream.name || '';
    const handle = stream.handle || '';
    return title.toLowerCase().includes(searchLower) || 
           handle.toLowerCase().includes(searchLower);
  }) || [];

  // Calculate KPIs
  const kpiData = streamsData ? {
    ...calculateKpiData(streamsData.data),
    totalStreams: streamsData.data.metadata?.total || 0,
    totalParticipants: allStreamsKpi?.totalParticipants || 0,
    peakParticipants: allStreamsKpi?.peakParticipants || 0
  } : null;


  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle sort
  const handleSort = useCallback((field: string) => {
    const newSortOrder = filters.sortBy === field && filters.sortOrder === 'DESC' ? 'ASC' : 'DESC';
    handleFiltersChange({ sortBy: field, sortOrder: newSortOrder });
  }, [filters.sortBy, filters.sortOrder, handleFiltersChange]);

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isPolling={isPolling}
          onPollingChange={setIsPolling}
          isRefreshing={isRefetching}
          onRefresh={handleRefresh}
        />
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            title="Failed to load streams"
            description={error?.message || 'Something went wrong while loading the data.'}
            onAction={handleRefresh}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isPolling={isPolling}
        onPollingChange={setIsPolling}
        isRefreshing={isRefetching}
        onRefresh={handleRefresh}
        countdown={countdown}
      />

      <main className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <KpiCard
            label="Total Streams"
            value={kpiData?.totalStreams || 0}
          />
          <KpiCard
            label="Total Viewers"
            value={kpiData?.totalParticipants || 0}
          />
          <KpiCard
            label="Peak Viewers"
            value={kpiData?.peakParticipants || 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Table - Left Side */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 bg-muted/20 rounded animate-pulse" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted/20 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ) : isError ? (
              <ErrorState
                title="Failed to load streams"
                description={error?.message || "Something went wrong while loading the streams."}
                onAction={handleRefresh}
              />
            ) : filteredStreams.length === 0 ? (
              <EmptyState
                title="No streams found"
                description="Try adjusting your search or filters to find more streams."
                onAction={handleRefresh}
              />
            ) : (
              <div>
                <StreamTable
                  streams={filteredStreams}
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onSort={handleSort}
                  offset={filters.offset}
                />
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {filters.offset + 1} to {Math.min(filters.offset + limit, totalStreams)} of {totalStreams} streams
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={!hasPrevPage || isLoading}
                        className="px-3 py-2 text-sm border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          if (pageNum > totalPages) return null;
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={isLoading}
                              className={`px-3 py-2 text-sm border rounded-md ${
                                pageNum === currentPage
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'hover:bg-muted'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={!hasNextPage || isLoading}
                        className="px-3 py-2 text-sm border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Cards - Right Side */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Trending streams</h2>
              
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StreamCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredStreams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No streams to display</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredStreams.slice(0, 10).map((stream, index) => (
                    <StreamCard
                      key={stream.id || index}
                      item={stream}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>Powered by <a href="https://api.pulstream.so" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Pulstream API</a></p>
            <p>Built with Next.js 14 & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
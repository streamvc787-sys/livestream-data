'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function KpiSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

export function StreamCardSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StreamTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <Skeleton className="h-4 w-8" />
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

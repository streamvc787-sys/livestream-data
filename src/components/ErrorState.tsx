'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error while loading the streams. Please try again.',
  actionLabel = 'Try again',
  onAction,
  className = ''
}: ErrorStateProps) {
  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/50 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
        
        {onAction && (
          <Button onClick={onAction} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

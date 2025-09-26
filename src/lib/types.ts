import { z } from 'zod';

// Custom URL validator that handles invalid URLs gracefully
const flexibleUrl = z.string().nullable().optional().transform(val => {
  if (!val || val.trim() === '') return null;
  try {
    new URL(val);
    return val;
  } catch {
    return null; // Convert invalid URLs to null
  }
});

// Zod schema for API response with flexible field handling
export const StreamSchema = z.object({
  id: z.string(),
  mint: z.string().optional(), // PumpFun token mint address
  name: z.string().optional(),
  symbol: z.string().optional(),
  description: z.string().nullable().optional(),
  image_uri: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
  twitter: flexibleUrl,
  telegram: flexibleUrl,
  website: flexibleUrl,
  num_participants: z.number().optional(),
  chat_members: z.number().optional(),
  reply_count: z.number().optional(),
  counts_streams: z.number().optional(),
  market_cap: z.union([z.string(), z.number()]).optional().transform(val => 
    typeof val === 'string' ? parseFloat(val) : val
  ),
  usd_market_cap: z.union([z.string(), z.number()]).optional().transform(val => 
    typeof val === 'string' ? parseFloat(val) : val
  ),
  is_currently_live: z.boolean().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  created_timestamp: z.string().optional(),
  last_trade_timestamp: z.string().nullable().optional(),
  // Additional fields that can be null
  raydium_pool: z.string().nullable().optional(),
  hidden: z.boolean().nullable().optional(),
  market_id: z.string().nullable().optional(),
  video_uri: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  // Legacy fields for compatibility
  title: z.string().optional(),
  handle: z.string().optional(),
  viewer_count: z.number().optional(),
  thumbnail_url: z.string().url().optional(),
  status: z.string().optional(),
  started_at: z.string().datetime().optional(),
}).passthrough(); // Allow unknown fields

export const StreamsResponseSchema = z.object({
  statusCode: z.number().optional(),
  data: z.object({
    data: z.array(StreamSchema),
    metadata: z.object({
      total: z.number().optional(),
      offset: z.number().optional(),
      limit: z.number().optional(),
    }).optional(),
  }),
}).passthrough();

// TypeScript types derived from schemas
export type Stream = z.infer<typeof StreamSchema>;
export type StreamsResponse = z.infer<typeof StreamsResponseSchema>;
// API query parameters
export interface StreamQueryParams {
  limit?: number;
  offset?: number;
  sort_by?: 'num_participants' | 'created_at' | 'started_at' | 'viewer_count';
  sort_order?: 'ASC' | 'DESC';
}

// UI state types
export interface StreamFilters {
  search: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  limit: number;
  offset: number;
}

// KPI data type
export interface KpiData {
  totalStreams: number;
  totalParticipants: number;
  peakParticipants: number;
  lastUpdated: string;
}

// Sort options for UI
export const SORT_OPTIONS = [
  { value: 'num_participants', label: 'Viewers' },
  { value: 'created_at', label: 'Created' },
] as const;

// Limit options for UI
export const LIMIT_OPTIONS = [
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
] as const;


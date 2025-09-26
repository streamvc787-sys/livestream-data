import { StreamQueryParams, StreamsResponse, StreamsResponseSchema, Stream } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.pulstream.so';

/**
 * Fetch streams from the external API (server-side only)
 */
export async function fetchStreamsExternal(params: StreamQueryParams = {}): Promise<StreamsResponse> {
  const searchParams = new URLSearchParams();
  
  // Set default values
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;
  const sortBy = params.sort_by ?? 'num_participants';
  const sortOrder = params.sort_order ?? 'DESC';
  
  // Add parameters to search params
  searchParams.set('limit', limit.toString());
  searchParams.set('offset', offset.toString());
  searchParams.set('sort_by', sortBy);
  searchParams.set('sort_order', sortOrder);
  
  const url = `${API_BASE_URL}/streamstats?${searchParams.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control for real-time data
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response with Zod schema
    const validatedData = StreamsResponseSchema.parse(data);
    
    // Transform the response to match our expected format
    return {
      data: validatedData.data.data,
      total: validatedData.data.metadata?.total || validatedData.total,
      limit: validatedData.data.metadata?.limit || validatedData.limit,
      offset: validatedData.data.metadata?.offset || validatedData.offset,
    };
  } catch (error) {
    console.error('Error fetching streams:', error);
    
    // Return empty response on error to prevent crashes
    return {
      data: [],
      total: 0,
      limit,
      offset,
    };
  }
}

/**
 * Fetch streams from the Next.js API route (client-side)
 */
export async function fetchStreams(params: StreamQueryParams = {}): Promise<StreamsResponse> {
  const searchParams = new URLSearchParams();
  
  // Set default values
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;
  const sortBy = params.sort_by ?? 'num_participants';
  const sortOrder = params.sort_order ?? 'DESC';
  
  // Add parameters to search params
  searchParams.set('limit', limit.toString());
  searchParams.set('offset', offset.toString());
  searchParams.set('sort_by', sortBy);
  searchParams.set('sort_order', sortOrder);
  
  const url = `/api/streams?${searchParams.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching streams:', error);
    
    // Return empty response on error to prevent crashes
    return {
      data: [],
      total: 0,
      limit,
      offset,
    };
  }
}

/**
 * Calculate KPI data from streams
 */
export function calculateKpiData(streams: Stream[]): {
  totalStreams: number;
  totalParticipants: number;
  peakParticipants: number;
  lastUpdated: string;
} {
  const totalStreams = streams.length;
  const totalParticipants = streams.reduce((sum, stream) => sum + (stream.num_participants || 0), 0);
  const peakParticipants = Math.max(...streams.map(stream => stream.num_participants || 0), 0);
  const lastUpdated = new Date().toISOString();
  
  return {
    totalStreams,
    totalParticipants,
    peakParticipants,
    lastUpdated,
  };
}

/**
 * Fetch all streams to calculate total participants across all streams
 * Uses pagination to get all data in chunks
 */
export async function fetchAllStreamsForKpi(): Promise<{ totalParticipants: number; peakParticipants: number }> {
  try {
    let allStreams: Stream[] = [];
    let offset = 0;
    const limit = 50; // Use a safe limit
    let hasMore = true;
    let totalParticipants = 0;
    let peakParticipants = 0;

    // Fetch all streams in chunks
    while (hasMore) {
      const response = await fetchStreamsExternal({ 
        limit, 
        offset,
        sort_by: 'num_participants',
        sort_order: 'DESC'
      });
      
      if (response.data.length === 0) {
        hasMore = false;
        break;
      }
      
      allStreams = [...allStreams, ...response.data];
      
      // Calculate participants for this batch
      const batchParticipants = response.data.reduce((sum, stream) => sum + (stream.num_participants || 0), 0);
      const batchPeak = Math.max(...response.data.map(stream => stream.num_participants || 0), 0);
      
      totalParticipants += batchParticipants;
      peakParticipants = Math.max(peakParticipants, batchPeak);
      
      // Check if we've got all streams
      if (response.data.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
      
      // Safety check to prevent infinite loops
      if (offset > 1000) {
        console.warn('Reached safety limit of 1000 streams for KPI calculation');
        break;
      }
    }
    
    return {
      totalParticipants,
      peakParticipants,
    };
  } catch (error) {
    console.error('Error fetching all streams for KPI:', error);
    // Return zeros instead of throwing to prevent app crashes
    return {
      totalParticipants: 0,
      peakParticipants: 0,
    };
  }
}

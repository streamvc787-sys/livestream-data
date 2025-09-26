import { NextRequest, NextResponse } from 'next/server';
import { fetchStreamsExternal } from '@/lib/api';
import { StreamQueryParams } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract and validate query parameters
    const params: StreamQueryParams = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      sort_by: searchParams.get('sort_by') as StreamQueryParams['sort_by'] || undefined,
      sort_order: searchParams.get('sort_order') as StreamQueryParams['sort_order'] || undefined,
    };
    
    // Validate limit and offset
    if (params.limit && (params.limit < 1 || params.limit > 1000)) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 1000' },
        { status: 400 }
      );
    }
    
    if (params.offset && params.offset < 0) {
      return NextResponse.json(
        { error: 'Offset must be non-negative' },
        { status: 400 }
      );
    }
    
    // Fetch data from external API
    const data = await fetchStreamsExternal(params);
    
    // Transform the data to match the expected format
    const transformedData = {
      data: {
        data: data.data,
        metadata: {
          total: data.total,
          limit: data.limit,
          offset: data.offset,
        }
      }
    };
    
    // Return the data with appropriate headers
    return NextResponse.json(transformedData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch streams data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

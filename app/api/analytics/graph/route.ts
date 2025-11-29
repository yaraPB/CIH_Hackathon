import { NextResponse } from 'next/server';
import { getMockGraphData } from '@/lib/neo4j';

export async function GET() {
  try {
    const graphData = getMockGraphData();
    return NextResponse.json(graphData);
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch graph data' },
      { status: 500 }
    );
  }
}

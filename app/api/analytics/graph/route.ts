import { NextRequest, NextResponse } from 'next/server';
import { getMockGraphData } from '@/lib/neo4j';

export async function GET(request: NextRequest) {
  try {
    // For hackathon, return mock graph data
    // In production, this would query Neo4j
    const graphData = getMockGraphData();

    return NextResponse.json(graphData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get graph data' },
      { status: 500 }
    );
  }
}

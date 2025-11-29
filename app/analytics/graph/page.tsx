'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import GraphVisualization from '@/components/GraphVisualization';

export default function GraphPage() {
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/graph')
      .then(res => res.json())
      .then(data => {
        setGraphData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load graph data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading graph...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/analytics"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Network Graph</h1>
          <p className="text-gray-600 mt-1">
            Visualize relationships between users and groups
          </p>
        </div>

        {graphData && (
          <>
            <div className="mb-8">
              <GraphVisualization
                nodes={graphData.nodes}
                relationships={graphData.relationships}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Network Statistics
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Total Nodes:</dt>
                    <dd className="font-medium text-gray-900">{graphData.nodes.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Users:</dt>
                    <dd className="font-medium text-gray-900">
                      {graphData.nodes.filter((n: any) => n.type === 'user').length}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Groups:</dt>
                    <dd className="font-medium text-gray-900">
                      {graphData.nodes.filter((n: any) => n.type === 'group').length}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Relationships:</dt>
                    <dd className="font-medium text-gray-900">
                      {graphData.relationships.length}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Insights
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      Nodes represent users (blue) and groups (purple)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      Lines show membership and transaction relationships
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      Drag nodes to explore connections
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      Hover over nodes for detailed information
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

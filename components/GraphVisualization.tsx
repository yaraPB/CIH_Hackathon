'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'group';
  properties: Record<string, any>;
}

interface GraphRelationship {
  source: string;
  target: string;
  type: string;
}

interface GraphVisualizationProps {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}

export default function GraphVisualization({ nodes, relationships }: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = 800;
    const height = 600;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(relationships)
        .id((d: any) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(relationships)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Add circles to nodes
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d: GraphNode) => d.type === 'user' ? '#6366f1' : '#8b5cf6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels to nodes
    node.append('text')
      .text((d: GraphNode) => d.label.split(' ')[0])
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('font-size', '12px')
      .attr('fill', '#374151');

    // Add tooltip
    node.append('title')
      .text((d: GraphNode) => 
        `${d.label}\nType: ${d.type}\n${d.type === 'user' ? 'Balance' : 'Total'}: ${d.properties.balance} MAD`
      );

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, relationships]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Network Graph</h3>
        <p className="text-sm text-gray-600 mt-1">User and group relationships</p>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-indigo-600 mr-2"></div>
            <span className="text-xs text-gray-600">Users</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-600 mr-2"></div>
            <span className="text-xs text-gray-600">Groups</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex justify-center">
        <svg ref={svgRef} className="border border-gray-200 rounded"></svg>
      </div>
    </div>
  );
}

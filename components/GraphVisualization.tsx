'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GraphNode {
  id: string;
  label: string;
  type: string;
  properties: any;
  groupId?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphRelationship {
  source: any;
  target: any;
  type: string;
}

interface GroupCluster {
  id: string;
  name: string;
  color: string;
  members: string[];
}

interface Props {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
  clusters: GroupCluster[];
}

export default function GraphVisualization({ nodes, relationships, clusters }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = 1000;
    const height = 700;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create gradient for links
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'link-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8b5cf6');

    // Calculate cluster positions (create overlapping effect)
    const clusterPositions = new Map([
      ['group1', { x: width * 0.3, y: height * 0.4 }],
      ['group2', { x: width * 0.5, y: height * 0.5 }],
      ['group3', { x: width * 0.6, y: height * 0.6 }]
    ]);

    // Draw cluster backgrounds (wallet groups)
    const clusterGroup = svg.append('g').attr('class', 'clusters');
    
    clusters.forEach(cluster => {
      const pos = clusterPositions.get(cluster.id) || { x: width / 2, y: height / 2 };
      
      // Create rounded rectangle for cluster
      clusterGroup.append('rect')
        .attr('x', pos.x - 150)
        .attr('y', pos.y - 120)
        .attr('width', 300)
        .attr('height', 240)
        .attr('rx', 20)
        .attr('ry', 20)
        .attr('fill', cluster.color)
        .attr('stroke', cluster.color.replace('0.1', '0.4'))
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
      
      // Add cluster label
      clusterGroup.append('text')
        .attr('x', pos.x)
        .attr('y', pos.y - 100)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#374151')
        .text(cluster.name);
    });

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(relationships)
        .id((d: any) => d.id)
        .distance(120))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))
      // Attract users to their group clusters
      .force('x', d3.forceX((d: any) => {
        const pos = clusterPositions.get(d.groupId || 'group1');
        return pos ? pos.x : width / 2;
      }).strength(0.3))
      .force('y', d3.forceY((d: any) => {
        const pos = clusterPositions.get(d.groupId || 'group1');
        return pos ? pos.y : height / 2;
      }).strength(0.3));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(relationships)
      .join('line')
      .attr('stroke', 'url(#link-gradient)')
      .attr('stroke-opacity', 0.4)
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

    // Add shadow filter
    const filter = defs.append('filter')
      .attr('id', 'shadow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3);

    filter.append('feOffset')
      .attr('dx', 0)
      .attr('dy', 2)
      .attr('result', 'offsetblur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Add circles with gradients
    node.append('circle')
      .attr('r', 35)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 4)
      .style('filter', 'url(#shadow)')
      .style('cursor', 'pointer');

    // Add user initials
    node.append('text')
      .text((d: any) => d.label.split(' ').map((n: string) => n[0]).join(''))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .style('pointer-events', 'none');

    // Add name labels below
    node.append('text')
      .text((d: any) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', 50)
      .attr('font-size', '13px')
      .attr('fill', '#374151')
      .attr('font-weight', '600')
      .style('pointer-events', 'none');

    // Add balance below name
    node.append('text')
      .text((d: any) => `${d.properties.balance.toLocaleString()} MAD`)
      .attr('text-anchor', 'middle')
      .attr('dy', 66)
      .attr('font-size', '11px')
      .attr('fill', '#6b7280')
      .style('pointer-events', 'none');

    // Tooltip
    node.append('title')
      .text((d: any) => 
        `${d.label}\nBalance: ${d.properties.balance.toLocaleString()} MAD\nPhone: ${d.properties.phoneNumber || 'N/A'}`
      );

    // Tick function
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
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
  }, [nodes, relationships, clusters]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Network Graph - Wallet Groups</h3>
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 mr-2 border-2 border-white shadow"></div>
            <span className="text-sm text-gray-600">Users</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded mr-2 bg-blue-100 border border-blue-300 border-dashed"></div>
            <span className="text-sm text-gray-600">Weekend Trip Fund</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded mr-2 bg-purple-100 border border-purple-300 border-dashed"></div>
            <span className="text-sm text-gray-600">Office Lunch Pool</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded mr-2 bg-red-100 border border-red-300 border-dashed"></div>
            <span className="text-sm text-gray-600">Family Emergency Fund</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Users are positioned within their wallet groups (overlapping shows shared memberships)
        </p>
      </div>
      <div className="p-4 flex justify-center bg-gray-50">
        <svg ref={svgRef} className="border-2 border-gray-200 rounded-lg bg-white"></svg>
      </div>
    </div>
  );
}

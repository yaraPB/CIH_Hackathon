import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver | null = null;

export function getDriver(): Driver {
  if (!driver) {
    // For hackathon: using mock/local Neo4j or cloud instance
    const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return driver;
}

export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

// Mock graph data for when Neo4j is not available
export interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'group';
  properties: Record<string, any>;
}

export interface GraphRelationship {
  source: string;
  target: string;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}

// Generate mock graph data
export function getMockGraphData(): GraphData {
  const nodes: GraphNode[] = [
    { id: 'user1', label: 'Ahmed Benali', type: 'user', properties: { balance: 5000 } },
    { id: 'user2', label: 'Fatima Zahra', type: 'user', properties: { balance: 3200 } },
    { id: 'user3', label: 'Youssef Idrissi', type: 'user', properties: { balance: 7500 } },
    { id: 'user4', label: 'Samira Tazi', type: 'user', properties: { balance: 4100 } },
    { id: 'user5', label: 'Karim Alami', type: 'user', properties: { balance: 6800 } },
    { id: 'group1', label: 'Weekend Trip Fund', type: 'group', properties: { balance: 12000 } },
    { id: 'group2', label: 'Office Lunch Pool', type: 'group', properties: { balance: 3500 } },
    { id: 'group3', label: 'Family Emergency Fund', type: 'group', properties: { balance: 25000 } }
  ];

  const relationships: GraphRelationship[] = [
    { source: 'user1', target: 'group1', type: 'MEMBER_OF' },
    { source: 'user2', target: 'group1', type: 'MEMBER_OF' },
    { source: 'user3', target: 'group1', type: 'MEMBER_OF' },
    { source: 'user1', target: 'group2', type: 'MEMBER_OF' },
    { source: 'user4', target: 'group2', type: 'MEMBER_OF' },
    { source: 'user5', target: 'group2', type: 'MEMBER_OF' },
    { source: 'user2', target: 'group3', type: 'MEMBER_OF' },
    { source: 'user3', target: 'group3', type: 'MEMBER_OF' },
    { source: 'user4', target: 'group3', type: 'MEMBER_OF' },
    { source: 'user5', target: 'group3', type: 'MEMBER_OF' },
    { source: 'user1', target: 'user2', type: 'TRANSACTED_WITH' },
    { source: 'user2', target: 'user3', type: 'TRANSACTED_WITH' },
    { source: 'user4', target: 'user5', type: 'TRANSACTED_WITH' }
  ];

  return { nodes, relationships };
}

import neo4j from 'neo4j-driver';

// Neo4j connection (for production)
export function getDriver() {
  const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'password';
  
  return neo4j.driver(uri, neo4j.auth.basic(user, password));
}

export function closeDriver(driver: any) {
  return driver.close();
}

// Graph data types
export interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'group';
  properties: {
    balance: number;
    phoneNumber?: string;
    members?: number;
  };
  groupId?: string; // NEW: For users to know which group they belong to
}

export interface GraphRelationship {
  source: string;
  target: string;
  type: string;
}

export interface GroupCluster {
  id: string;
  name: string;
  color: string;
  members: string[];
}

// Mock graph data with wallet groups as background clusters
export function getMockGraphData() {
  // Define wallet groups as clusters
  const clusters: GroupCluster[] = [
    {
      id: 'group1',
      name: 'Weekend Trip Fund',
      color: 'rgba(59, 130, 246, 0.1)', // Light blue
      members: ['user1', 'user2', 'user3']
    },
    {
      id: 'group2',
      name: 'Office Lunch Pool',
      color: 'rgba(139, 92, 246, 0.1)', // Light purple
      members: ['user1', 'user4', 'user5']
    },
    {
      id: 'group3',
      name: 'Family Emergency Fund',
      color: 'rgba(239, 68, 68, 0.1)', // Light red
      members: ['user2', 'user3', 'user4', 'user5']
    }
  ];

  // User nodes only (no group nodes)
  const nodes: GraphNode[] = [
    {
      id: 'user1',
      label: 'Ahmed Benali',
      type: 'user',
      properties: {
        balance: 5000,
        phoneNumber: '212700446631'
      },
      groupId: 'group1' // Primary group for positioning
    },
    {
      id: 'user2',
      label: 'Fatima Zahra',
      type: 'user',
      properties: {
        balance: 3200,
        phoneNumber: '212700446211'
      },
      groupId: 'group1'
    },
    {
      id: 'user3',
      label: 'Youssef Idrissi',
      type: 'user',
      properties: {
        balance: 7500,
        phoneNumber: '212755123456'
      },
      groupId: 'group1'
    },
    {
      id: 'user4',
      label: 'Samira Tazi',
      type: 'user',
      properties: {
        balance: 4100,
        phoneNumber: '212666233333'
      },
      groupId: 'group2'
    },
    {
      id: 'user5',
      label: 'Karim Alami',
      type: 'user',
      properties: {
        balance: 6800,
        phoneNumber: '212669268097'
      },
      groupId: 'group2'
    }
  ];

  // Relationships between users (transactions)
  const relationships: GraphRelationship[] = [
    // Weekend Trip Fund transactions
    { source: 'user1', target: 'user2', type: 'TRANSACTED_WITH' },
    { source: 'user2', target: 'user3', type: 'TRANSACTED_WITH' },
    { source: 'user1', target: 'user3', type: 'TRANSACTED_WITH' },
    
    // Office Lunch Pool transactions
    { source: 'user1', target: 'user4', type: 'TRANSACTED_WITH' },
    { source: 'user4', target: 'user5', type: 'TRANSACTED_WITH' },
    
    // Family Emergency Fund transactions
    { source: 'user2', target: 'user4', type: 'TRANSACTED_WITH' },
    { source: 'user3', target: 'user5', type: 'TRANSACTED_WITH' },
    
    // Cross-group transactions (overlapping members)
    { source: 'user1', target: 'user5', type: 'TRANSACTED_WITH' },
    { source: 'user2', target: 'user5', type: 'TRANSACTED_WITH' }
  ];

  return { nodes, relationships, clusters };
}

// Mock database for the hackathon
export interface User {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  contractId: string;
  balance: number;
  location?: {
    lat: number;
    lng: number;
    city: string;
  };
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[]; // User IDs
  balance: number;
  contractId: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  groupId: string;
  type: 'cashin' | 'cashout' | 'w2w' | 'payment';
  amount: number;
  fees: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  proposedBy: string;
  approvedBy: string[];
  requiredApprovals: number;
  description: string;
  createdAt: string;
  beneficiary?: string;
}

// Mock data
export const mockUsers: User[] = [
  {
    id: 'user1',
    phoneNumber: '212700446631',
    firstName: 'Ahmed',
    lastName: 'Benali',
    email: 'ahmed.benali@example.com',
    contractId: 'LAN240478508299911',
    balance: 5000,
    location: { lat: 33.5731, lng: -7.5898, city: 'Casablanca' }
  },
  {
    id: 'user2',
    phoneNumber: '212700446211',
    firstName: 'Fatima',
    lastName: 'Zahra',
    email: 'fatima.zahra@example.com',
    contractId: 'LAN233460579578271',
    balance: 3200,
    location: { lat: 34.0209, lng: -6.8416, city: 'Rabat' }
  },
  {
    id: 'user3',
    phoneNumber: '212755123456',
    firstName: 'Youssef',
    lastName: 'Idrissi',
    email: 'youssef.idrissi@example.com',
    contractId: 'LAN193541347060001',
    balance: 7500,
    location: { lat: 31.6295, lng: -7.9811, city: 'Marrakech' }
  },
  {
    id: 'user4',
    phoneNumber: '212666233333',
    firstName: 'Samira',
    lastName: 'Tazi',
    email: 'samira.tazi@example.com',
    contractId: 'LAN252387936812761',
    balance: 4100,
    location: { lat: 35.7595, lng: -5.8340, city: 'Tangier' }
  },
  {
    id: 'user5',
    phoneNumber: '212669268097',
    firstName: 'Karim',
    lastName: 'Alami',
    email: 'karim.alami@example.com',
    contractId: 'LAN251276004694521',
    balance: 6800,
    location: { lat: 33.9716, lng: -6.8498, city: 'Sale' }
  }
];

export const mockGroups: Group[] = [
  {
    id: 'group1',
    name: 'Weekend Trip Fund',
    description: 'Save for our annual trip to Essaouira',
    members: ['user1', 'user2', 'user3'],
    balance: 12000,
    contractId: 'LAN250383003224941',
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'group2',
    name: 'Office Lunch Pool',
    description: 'Shared lunch budget for the team',
    members: ['user1', 'user4', 'user5'],
    balance: 3500,
    contractId: 'LAN251996372325421',
    createdAt: '2025-02-01T09:00:00Z'
  },
  {
    id: 'group3',
    name: 'Family Emergency Fund',
    description: 'Shared emergency savings',
    members: ['user2', 'user3', 'user4', 'user5'],
    balance: 25000,
    contractId: 'LAN251114678086481',
    createdAt: '2024-12-01T08:00:00Z'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn1',
    groupId: 'group1',
    type: 'cashin',
    amount: 2000,
    fees: 0,
    status: 'completed',
    proposedBy: 'user1',
    approvedBy: ['user1', 'user2'],
    requiredApprovals: 2,
    description: 'Monthly contribution',
    createdAt: '2025-11-01T14:30:00Z'
  },
  {
    id: 'txn2',
    groupId: 'group1',
    type: 'payment',
    amount: 3500,
    fees: 10,
    status: 'pending',
    proposedBy: 'user2',
    approvedBy: ['user2'],
    requiredApprovals: 2,
    description: 'Hotel booking payment',
    beneficiary: 'Hotel Atlas',
    createdAt: '2025-11-15T16:45:00Z'
  },
  {
    id: 'txn3',
    groupId: 'group2',
    type: 'cashout',
    amount: 500,
    fees: 5,
    status: 'approved',
    proposedBy: 'user4',
    approvedBy: ['user4', 'user1'],
    requiredApprovals: 2,
    description: 'Restaurant payment',
    createdAt: '2025-11-20T12:00:00Z'
  },
  {
    id: 'txn4',
    groupId: 'group3',
    type: 'cashin',
    amount: 5000,
    fees: 0,
    status: 'completed',
    proposedBy: 'user3',
    approvedBy: ['user3', 'user2', 'user4'],
    requiredApprovals: 3,
    description: 'Emergency fund contribution',
    createdAt: '2025-11-10T09:00:00Z'
  }
];

// Session management (simplified for hackathon)
export let currentUser: User | null = null;

export function setCurrentUser(user: User) {
  currentUser = user;
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

export function getGroupById(id: string): Group | undefined {
  return mockGroups.find(g => g.id === id);
}

export function getUserGroups(userId: string): Group[] {
  return mockGroups.filter(g => g.members.includes(userId));
}

export function getGroupTransactions(groupId: string): Transaction[] {
  return mockTransactions.filter(t => t.groupId === groupId);
}

export function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
  const newTxn: Transaction = {
    ...transaction,
    id: `txn${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  mockTransactions.push(newTxn);
  return newTxn;
}

export function approveTransaction(txnId: string, userId: string): boolean {
  const txn = mockTransactions.find(t => t.id === txnId);
  if (!txn || txn.approvedBy.includes(userId)) return false;
  
  txn.approvedBy.push(userId);
  if (txn.approvedBy.length >= txn.requiredApprovals) {
    txn.status = 'approved';
  }
  return true;
}

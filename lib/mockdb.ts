// Mock database with pending group proposals
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
  status: 'active' | 'pending'; // NEW: Status field
  proposedBy?: string; // NEW: Who proposed this group
  approvedBy?: string[]; // NEW: Who approved
  rejectedBy?: string[]; // NEW: Who rejected
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
  rejectedBy: string[];
  requiredApprovals: number;
  description: string;
  createdAt: string;
  beneficiary?: string;
  rib?: string;
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
    createdAt: '2025-01-15T10:00:00Z',
    status: 'active',
    proposedBy: 'user1',
    approvedBy: ['user1', 'user2', 'user3']
  },
  {
    id: 'group2',
    name: 'Office Lunch Pool',
    description: 'Shared lunch budget for the team',
    members: ['user1', 'user4', 'user5'],
    balance: 3500,
    contractId: 'LAN251996372325421',
    createdAt: '2025-02-01T09:00:00Z',
    status: 'active',
    proposedBy: 'user1',
    approvedBy: ['user1', 'user4', 'user5']
  },
  {
    id: 'group3',
    name: 'Family Emergency Fund',
    description: 'Shared emergency savings',
    members: ['user2', 'user3', 'user4', 'user5'],
    balance: 25000,
    contractId: 'LAN251114678086481',
    createdAt: '2024-12-01T08:00:00Z',
    status: 'active',
    proposedBy: 'user2',
    approvedBy: ['user2', 'user3', 'user4', 'user5']
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
    approvedBy: ['user1', 'user2', 'user3'],
    rejectedBy: [],
    requiredApprovals: 3,
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
    rejectedBy: [],
    requiredApprovals: 3,
    description: 'Hotel booking payment',
    beneficiary: 'Hotel Atlas',
    createdAt: '2025-11-15T16:45:00Z'
  }
];

// Session management
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
  return mockGroups.filter(g => g.members.includes(userId) && g.status === 'active');
}

export function getPendingGroups(userId: string): Group[] {
  return mockGroups.filter(g => g.members.includes(userId) && g.status === 'pending');
}

export function getAllUserGroups(userId: string): Group[] {
  return mockGroups.filter(g => g.members.includes(userId));
}

export function getGroupTransactions(groupId: string): Transaction[] {
  return mockTransactions.filter(t => t.groupId === groupId);
}

export function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'rejectedBy'>): Transaction {
  const group = getGroupById(transaction.groupId);
  if (!group) throw new Error('Group not found');

  const newTxn: Transaction = {
    ...transaction,
    id: `txn${Date.now()}`,
    createdAt: new Date().toISOString(),
    approvedBy: [transaction.proposedBy],
    rejectedBy: [],
    requiredApprovals: group.members.length
  };
  
  mockTransactions.push(newTxn);
  
  // Auto-complete cashin
  if (transaction.type === 'cashin' && transaction.requiredApprovals === 1) {
    newTxn.status = 'completed';
    group.balance += transaction.amount;
  }
  
  return newTxn;
}

export function approveTransaction(txnId: string, userId: string): boolean {
  const txn = mockTransactions.find(t => t.id === txnId);
  if (!txn || txn.status !== 'pending') return false;
  
  if (txn.approvedBy.includes(userId)) return false;
  if (txn.rejectedBy.length > 0) return false;
  
  txn.approvedBy.push(userId);
  
  const group = getGroupById(txn.groupId);
  if (group && txn.approvedBy.length === group.members.length) {
    txn.status = 'completed';
    group.balance -= txn.amount + txn.fees;
  }
  
  return true;
}

export function rejectTransaction(txnId: string, userId: string): boolean {
  const txn = mockTransactions.find(t => t.id === txnId);
  if (!txn || txn.status !== 'pending') return false;
  
  if (txn.rejectedBy.includes(userId)) return false;
  
  txn.rejectedBy.push(userId);
  txn.status = 'rejected';
  
  return true;
}

// NEW: Add group proposal (pending until all approve)
export function proposeGroup(group: Omit<Group, 'id' | 'contractId' | 'createdAt' | 'balance' | 'status' | 'rejectedBy'>): Group {
  const newGroup: Group = {
    ...group,
    id: `group${Date.now()}`,
    contractId: `LAN${Date.now()}${Math.floor(Math.random() * 1000)}`,
    balance: 0,
    createdAt: new Date().toISOString(),
    status: 'pending',
    approvedBy: [group.proposedBy!], // Proposer auto-approves
    rejectedBy: []
  };
  
  mockGroups.push(newGroup);
  return newGroup;
}

// NEW: Approve group
export function approveGroup(groupId: string, userId: string): boolean {
  const group = mockGroups.find(g => g.id === groupId);
  if (!group || group.status !== 'pending') return false;
  
  if (!group.approvedBy) group.approvedBy = [];
  if (!group.rejectedBy) group.rejectedBy = [];
  
  if (group.approvedBy.includes(userId)) return false;
  if (group.rejectedBy.length > 0) return false;
  
  group.approvedBy.push(userId);
  
  // Check if all members approved
  if (group.approvedBy.length === group.members.length) {
    group.status = 'active';
  }
  
  return true;
}

// NEW: Reject group
export function rejectGroup(groupId: string, userId: string): boolean {
  const group = mockGroups.find(g => g.id === groupId);
  if (!group || group.status !== 'pending') return false;
  
  if (!group.rejectedBy) group.rejectedBy = [];
  if (group.rejectedBy.includes(userId)) return false;
  
  group.rejectedBy.push(userId);
  
  // Remove group from list
  const index = mockGroups.indexOf(group);
  if (index > -1) {
    mockGroups.splice(index, 1);
  }
  
  return true;
}

export function updateGroupBalance(groupId: string, amount: number): boolean {
  const group = getGroupById(groupId);
  if (!group) return false;
  
  group.balance += amount;
  return true;
}

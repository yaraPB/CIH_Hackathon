import { NextRequest, NextResponse } from 'next/server';
import { mockUsers, mockGroups, mockTransactions } from '@/lib/mockdb';

export async function GET(request: NextRequest) {
  try {
    // Calculate KPIs
    const totalUsers = mockUsers.length;
    const totalGroups = mockGroups.length;
    const totalTransactions = mockTransactions.length;
    
    const totalVolume = mockTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const avgTransactionSize = totalVolume / totalTransactions;
    
    const completedTransactions = mockTransactions.filter(t => t.status === 'completed').length;
    const pendingTransactions = mockTransactions.filter(t => t.status === 'pending').length;
    const approvedTransactions = mockTransactions.filter(t => t.status === 'approved').length;
    
    const totalGroupBalance = mockGroups.reduce((sum, g) => sum + g.balance, 0);
    const avgGroupBalance = totalGroupBalance / totalGroups;
    
    // User engagement (transactions per user)
    const userTransactions: Record<string, number> = {};
    mockTransactions.forEach(txn => {
      userTransactions[txn.proposedBy] = (userTransactions[txn.proposedBy] || 0) + 1;
    });
    const avgTransactionsPerUser = Object.values(userTransactions).reduce((a, b) => a + b, 0) / totalUsers;
    
    // Transaction trends (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentTransactions = mockTransactions.filter(
      t => new Date(t.createdAt) > sevenDaysAgo
    );
    
    // Group activity
    const groupActivity = mockGroups.map(group => ({
      id: group.id,
      name: group.name,
      members: group.members.length,
      balance: group.balance,
      transactionCount: mockTransactions.filter(t => t.groupId === group.id).length
    }));

    return NextResponse.json({
      overview: {
        totalUsers,
        totalGroups,
        totalTransactions,
        totalVolume,
        avgTransactionSize,
        totalGroupBalance,
        avgGroupBalance,
        avgTransactionsPerUser
      },
      transactionStatus: {
        completed: completedTransactions,
        pending: pendingTransactions,
        approved: approvedTransactions
      },
      trends: {
        last7Days: recentTransactions.length,
        growthRate: ((recentTransactions.length / totalTransactions) * 100).toFixed(2)
      },
      groupActivity,
      userEngagement: Object.entries(userTransactions)
        .map(([userId, count]) => {
          const user = mockUsers.find(u => u.id === userId);
          return {
            userId,
            name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
            transactionCount: count
          };
        })
        .sort((a, b) => b.transactionCount - a.transactionCount)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}

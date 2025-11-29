'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, TrendingUp, Wallet, Users, QrCode } from 'lucide-react';
import Header from '@/components/Header';
import GroupCard from '@/components/GroupCard';
import BalanceCard from '@/components/BalanceCard';
import ActivityFeed from '@/components/ActivityFeed';
import NewGroupModal from '@/components/NewGroupModal';
import QRScanner from '@/components/QRScanner';
import { getCurrentUser, getUserGroups, mockTransactions, mockGroups } from '@/lib/mockdb';

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    loadDashboardData(user.id);
  }, [router]);

  const loadDashboardData = (userId: string) => {
    const userGroups = getUserGroups(userId);
    setGroups(userGroups);
    
    // Get recent activity
    const activity = mockTransactions
      .filter(txn => {
        const group = mockGroups.find(g => g.id === txn.groupId);
        return group && group.members.includes(userId);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setRecentActivity(activity);
  };

  const handleGroupCreated = () => {
    if (currentUser) {
      loadDashboardData(currentUser.id);
    }
  };

  const handleQRScan = (data: string) => {
    // Handle QR code data (e.g., navigate to payment or group)
    console.log('QR Code scanned:', data);
    alert(`QR Code scanned: ${data}`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const totalGroupFunds = groups.reduce((sum, group) => sum + group.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.welcome')}, {currentUser.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            {t('dashboard.manageGroups')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BalanceCard
            title={t('dashboard.personalBalance')}
            amount={currentUser.balance}
            change={12}
            changeLabel="+12% this month"
          />
          
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('dashboard.totalGroupFunds')}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalGroupFunds.toLocaleString()} MAD
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Wallet className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('dashboard.activeGroups')}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {groups.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowNewGroupModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('dashboard.newGroup')}
          </button>

          <button
            onClick={() => setShowQRScanner(true)}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-md hover:shadow-lg transition-all"
          >
            <QrCode className="h-5 w-5 mr-2" />
            {t('group.scanQR')}
          </button>
        </div>

        {/* Groups Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('dashboard.yourGroups')}
          </h2>
          
          {groups.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
              <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You're not part of any groups yet.</p>
              <button
                onClick={() => setShowNewGroupModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  description={group.description}
                  memberCount={group.members.length}
                  balance={group.balance}
                  createdAt={group.createdAt}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('dashboard.recentActivity')}
            </h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <ActivityFeed activities={recentActivity} />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewGroupModal && (
        <NewGroupModal
          onClose={() => setShowNewGroupModal(false)}
          onSuccess={() => {
            handleGroupCreated();
            setShowNewGroupModal(false);
          }}
        />
      )}

      {showQRScanner && (
        <QRScanner
          onScan={(data) => {
            handleQRScan(data);
            setShowQRScanner(false);
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, TrendingUp, Wallet, Users, QrCode, Clock, Check, X } from 'lucide-react';
import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import ActivityFeed from '@/components/ActivityFeed';
import QRScanner from '@/components/QRScanner';
import { getCurrentUser, getUserGroups, getPendingGroups, approveGroup, rejectGroup, proposeGroup, mockTransactions, mockGroups, getUserById, mockUsers } from '@/lib/mockdb';

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [pendingGroups, setPendingGroups] = useState<any[]>([]);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [newGroupForm, setNewGroupForm] = useState({ 
    name: '', 
    description: '',
    selectedMembers: [] as string[]
  });

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
    const userPendingGroups = getPendingGroups(userId);
    setGroups(userGroups);
    setPendingGroups(userPendingGroups);
    
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

  const handleMemberToggle = (userId: string) => {
    if (newGroupForm.selectedMembers.includes(userId)) {
      setNewGroupForm({
        ...newGroupForm,
        selectedMembers: newGroupForm.selectedMembers.filter(id => id !== userId)
      });
    } else {
      setNewGroupForm({
        ...newGroupForm,
        selectedMembers: [...newGroupForm.selectedMembers, userId]
      });
    }
  };

  const handleGroupCreated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // All selected members + current user
    const allMembers = Array.from(new Set([currentUser.id, ...newGroupForm.selectedMembers]));
    
    // Create pending group proposal
    proposeGroup({
      name: newGroupForm.name,
      description: newGroupForm.description,
      members: allMembers,
      proposedBy: currentUser.id
    });
    
    loadDashboardData(currentUser.id);
    setShowNewGroupModal(false);
    setNewGroupForm({ name: '', description: '', selectedMembers: [] });
    alert(`Group proposal "${newGroupForm.name}" created! All ${allMembers.length} members must approve.`);
  };

  const handleQRScan = (data: string) => {
    console.log('QR Code scanned:', data);
    alert(`QR Code scanned: ${data}`);
  };

  const handleApproveGroup = (groupId: string) => {
    if (!currentUser) return;
    const success = approveGroup(groupId, currentUser.id);
    if (success) {
      loadDashboardData(currentUser.id);
    }
  };

  const handleRejectGroup = (groupId: string) => {
    if (!currentUser) return;
    if (confirm('Reject this group proposal?')) {
      const success = rejectGroup(groupId, currentUser.id);
      if (success) {
        loadDashboardData(currentUser.id);
      }
    }
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

        {/* Stats Cards with QR Scanner in Personal Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Personal Balance Card with QR Scanner */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('dashboard.personalBalance')}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {currentUser.balance.toLocaleString()} MAD
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12% this month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Wallet className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            {/* QR Scanner Button */}
            <button
              onClick={() => setShowQRScanner(true)}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm"
            >
              <QrCode className="h-4 w-4 mr-2" />
              {t('group.scanQR')}
            </button>
          </div>
          
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

        {/* New Group Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowNewGroupModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('dashboard.newGroup')}
          </button>
        </div>

        {/* Groups Grid with QR Scanner in each card */}
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
                <div key={group.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <Link href={`/groups/${group.id}`}>
                    <div className="cursor-pointer">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{group.members.length} members</span>
                        </div>
                        <div className="flex items-center font-semibold text-gray-900">
                          <Wallet className="h-4 w-4 mr-1 text-green-600" />
                          <span>{group.balance.toLocaleString()} MAD</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* QR Scanner Button in Group Card */}
                  <button
                    onClick={() => setShowQRScanner(true)}
                    className="w-full inline-flex items-center justify-center px-3 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium text-sm"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    {t('group.scanQR')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Section with Pending Groups */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('dashboard.recentActivity')}
          </h2>
          
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {/* Pending Group Proposals */}
            {pendingGroups.length > 0 && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                  Pending Group Proposals
                </h3>
                <div className="space-y-4">
                  {pendingGroups.map(group => {
                    const proposer = getUserById(group.proposedBy);
                    const hasApproved = group.approvedBy?.includes(currentUser.id);
                    const approvalCount = group.approvedBy?.length || 0;
                    const totalMembers = group.members.length;

                    return (
                      <div key={group.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{group.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Proposed by {proposer?.firstName} • {approvalCount}/{totalMembers} approved
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(approvalCount / totalMembers) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {!hasApproved ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveGroup(group.id)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              {t('approval.approve')}
                            </button>
                            <button
                              onClick={() => handleRejectGroup(group.id)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                            >
                              <X className="h-4 w-4 mr-1" />
                              {t('approval.reject')}
                            </button>
                          </div>
                        ) : (
                          <div className="bg-green-50 border border-green-200 rounded-md p-2 text-center">
                            <p className="text-sm text-green-800 flex items-center justify-center">
                              <Check className="h-4 w-4 mr-1" />
                              You approved • Waiting for others...
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {recentActivity.length > 0 ? (
              <ActivityFeed activities={recentActivity} />
            ) : (
              !pendingGroups.length && (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )
            )}
          </div>
        </div>
      </div>

      {/* New Group Modal with Member Selection (Pending Logic) */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('newGroup.title')}
              </h3>
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleGroupCreated} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('newGroup.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={newGroupForm.name}
                  onChange={(e) => setNewGroupForm({...newGroupForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Weekend Trip Fund"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('newGroup.description')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newGroupForm.description}
                  onChange={(e) => setNewGroupForm({...newGroupForm, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Save money for our group activities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Users className="inline h-4 w-4 mr-1" />
                  Select Members * (including you)
                </label>
                <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
                  {/* Current user (auto-selected) */}
                  <div className="flex items-center p-3 bg-blue-50 rounded-md mb-2">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser?.firstName} {currentUser?.lastName} (You)
                      </p>
                      <p className="text-xs text-gray-600">{currentUser?.phoneNumber}</p>
                    </div>
                  </div>

                  {/* Other users */}
                  {mockUsers
                    .filter(user => user.id !== currentUser?.id)
                    .map(user => (
                      <div
                        key={user.id}
                        className={`flex items-center p-3 rounded-md mb-2 cursor-pointer hover:bg-gray-50 ${
                          newGroupForm.selectedMembers.includes(user.id) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleMemberToggle(user.id)}
                      >
                        <input
                          type="checkbox"
                          checked={newGroupForm.selectedMembers.includes(user.id)}
                          onChange={() => handleMemberToggle(user.id)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-600">{user.phoneNumber}</p>
                        </div>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select at least one other member. All members must approve this group before it becomes active.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This group will be pending until ALL {newGroupForm.selectedMembers.length + 1} members approve it.
                  If any member rejects, the proposal will be cancelled.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewGroupModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('payment.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={newGroupForm.selectedMembers.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Propose Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
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

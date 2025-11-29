'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Check, X, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { getCurrentUser, getPendingGroups, approveGroup, rejectGroup, getUserById } from '@/lib/mockdb';

export default function PendingGroupsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingGroups, setPendingGroups] = useState<any[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    loadPendingGroups(user.id);
  }, [router]);

  const loadPendingGroups = (userId: string) => {
    const groups = getPendingGroups(userId);
    setPendingGroups(groups);
  };

  const handleApprove = (groupId: string) => {
    if (!currentUser) return;
    
    const success = approveGroup(groupId, currentUser.id);
    if (success) {
      loadPendingGroups(currentUser.id);
      alert('Group approved! Waiting for other members...');
    }
  };

  const handleReject = (groupId: string) => {
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to reject this group proposal? This action cannot be undone.')) {
      const success = rejectGroup(groupId, currentUser.id);
      if (success) {
        loadPendingGroups(currentUser.id);
        alert('Group proposal rejected.');
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

  return (
    <div className="min-h-screen bg-gradient-light">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('group.backToDashboard')}
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Group Proposals</h1>
          <p className="text-gray-600">
            Review and approve group proposals. All members must approve for a group to become active.
          </p>
        </div>

        {pendingGroups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No pending group proposals</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingGroups.map(group => {
              const proposer = getUserById(group.proposedBy);
              const hasApproved = group.approvedBy?.includes(currentUser.id);
              const approvalCount = group.approvedBy?.length || 0;
              const totalMembers = group.members.length;

              return (
                <div key={group.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                      <p className="text-gray-600 mb-3">{group.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{totalMembers} members</span>
                        <span className="mx-2">•</span>
                        <span>Proposed by {proposer?.firstName} {proposer?.lastName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Approval Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">
                        {t('approval.approvals')}: {approvalCount}/{totalMembers}
                      </span>
                      <span className="text-xs text-red-600">
                        {t('approval.required')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(approvalCount / totalMembers) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Member List with Approval Status */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Members:</p>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((memberId: string) => {
                        const member = getUserById(memberId);
                        const approved = group.approvedBy?.includes(memberId);
                        return (
                          <div
                            key={memberId}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                              approved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {approved && <Check className="h-3 w-3 mr-1" />}
                            {member?.firstName}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!hasApproved ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(group.id)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        {t('approval.approve')}
                      </button>
                      <button
                        onClick={() => handleReject(group.id)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t('approval.reject')}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <p className="text-sm text-green-800 flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        You have approved this group. Waiting for others...
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Users } from 'lucide-react';
import { proposeGroup, getCurrentUser, mockUsers } from '@/lib/mockdb';

interface NewGroupModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewGroupModal({ onClose, onSuccess }: NewGroupModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedMembers: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const currentUser = getCurrentUser();
  
  const handleMemberToggle = (userId: string) => {
    if (formData.selectedMembers.includes(userId)) {
      setFormData({
        ...formData,
        selectedMembers: formData.selectedMembers.filter(id => id !== userId)
      });
    } else {
      setFormData({
        ...formData,
        selectedMembers: [...formData.selectedMembers, userId]
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    try {
      // All selected members + current user
      const allMembers = Array.from(new Set([currentUser.id, ...formData.selectedMembers]));
      
      // Create pending group proposal
      proposeGroup({
        name: formData.name,
        description: formData.description,
        members: allMembers,
        proposedBy: currentUser.id
      });
      
      setLoading(false);
      onSuccess();
      alert(`Group proposal "${formData.name}" created! All ${allMembers.length} members must approve before it becomes active.`);
    } catch (error) {
      console.error('Error creating group:', error);
      setLoading(false);
      alert('Error creating group. Please try again.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('newGroup.title')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
              {t('newGroup.name')} *
            </label>
            <input
              type="text"
              id="groupName"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Weekend Trip Fund"
            />
          </div>
          
          <div>
            <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-2">
              {t('newGroup.description')} *
            </label>
            <textarea
              id="groupDescription"
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                      formData.selectedMembers.includes(user.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleMemberToggle(user.id)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedMembers.includes(user.id)}
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
              <strong>Note:</strong> This group will be pending until ALL {formData.selectedMembers.length + 1} members approve it.
              If any member rejects, the proposal will be cancelled.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {t('payment.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || formData.selectedMembers.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('newGroup.creating') : 'Propose Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

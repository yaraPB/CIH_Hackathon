'use client';

import Link from 'next/link';
import { Users, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  balance: number;
  createdAt: string;
}

export default function GroupCard({
  id,
  name,
  description,
  memberCount,
  balance,
  createdAt
}: GroupCardProps) {
  return (
    <Link href={`/groups/${id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="bg-indigo-100 rounded-full p-2">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>{memberCount} members</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-medium">Balance</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>Created {formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

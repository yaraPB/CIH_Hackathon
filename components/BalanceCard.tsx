'use client';

import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface BalanceCardProps {
  title: string;
  amount: number;
  change?: number;
  changeLabel?: string;
}

export default function BalanceCard({
  title,
  amount,
  change,
  changeLabel
}: BalanceCardProps) {
  const isPositive = change ? change > 0 : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="bg-indigo-100 rounded-full p-2">
          <Wallet className="h-5 w-5 text-indigo-600" />
        </div>
      </div>

      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(amount)}
        </p>
      </div>

      {change !== undefined && (
        <div className="flex items-center text-sm">
          {isPositive ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{change}%</span>
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-red-600 font-medium">{change}%</span>
            </>
          )}
          {changeLabel && (
            <span className="text-gray-600 ml-2">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

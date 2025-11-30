'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Phone, Lock } from 'lucide-react';
import { mockUsers, setCurrentUser } from '@/lib/mockdb';

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.phoneNumber === phoneNumber);
      
      if (user) {
        setCurrentUser(user);
        router.push('/dashboard');
      } else {
        setError('User not found. Please try: 212700446631');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Wallet className="h-16 w-16 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
            Synergos
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Collaborative payment management for communities
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative flex gap-3 items-center justify-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none block w-full pr-3  py-2 border border-gray-300 rounded-md shadow-sm pl-20 placeholder-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="212700446631"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo accounts</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-600">Try these phone numbers:</p>
              {mockUsers.slice(0, 3).map(user => (
                <button
                  key={user.id}
                  onClick={() => setPhoneNumber(user.phoneNumber)}
                  className="w-full text-left text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50"
                >
                  {user.phoneNumber} - {user.firstName} {user.lastName}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Hackathon demo - No real authentication required
        </p>
      </div>
    </div>
  );
}

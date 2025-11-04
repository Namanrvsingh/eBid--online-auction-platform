import React from 'react';
import { Auction, User } from '../types';

interface AdminDashboardProps {
  users: User[];
  auctions: Auction[];
  onEndAuctionEarly: (auctionId: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, auctions, onEndAuctionEarly }) => {
    const totalValue = auctions
        .filter(a => a.status === 'ENDED' && a.highestBidderId)
        .reduce((sum, a) => sum + a.currentPrice, 0);
    const activeAuctionsCount = auctions.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{users.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Auctions</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{auctions.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Auctions</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{activeAuctionsCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Sales Value</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">${totalValue.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-100">Manage Auctions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {auctions.map(a => (
                <tr key={a.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{a.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{a.sellerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${a.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {a.status === 'ACTIVE' && (
                       <button 
                         onClick={() => onEndAuctionEarly(a.id)}
                         className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                       >
                         Close Deal
                       </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-100">All Users</h3>
          <ul className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {users.map(u => (
              <li key={u.id} className="p-3 rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                <span>{u.username}</span>
                <span className="text-sm font-mono px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">{u.role}</span>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default AdminDashboard;
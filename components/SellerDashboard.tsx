
import React, { useState } from 'react';
import { Auction, User } from '../types';
import CreateAuctionForm from './CreateAuctionForm';

interface SellerDashboardProps {
  user: User;
  auctions: Auction[];
  onCreateAuction: (auctionData: Omit<Auction, 'id' | 'sellerId' | 'sellerName' | 'bids' | 'status' | 'currentPrice' | 'startTime'>) => void;
  onGenerateAuction: (prompt: string) => Promise<{title: string, description: string, startingPrice: number, imageUrl: string} | null>;
  isGenerating: boolean;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, auctions, onCreateAuction, onGenerateAuction, isGenerating }) => {
  const myAuctions = auctions.filter(a => a.sellerId === user.id);
  const activeAuctions = myAuctions.filter(a => a.status === 'ACTIVE');
  const endedAuctions = myAuctions.filter(a => a.status === 'ENDED');

  const totalSales = endedAuctions
    .filter(a => a.highestBidderId)
    .reduce((sum, a) => sum + a.currentPrice, 0);

  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">${totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Listings</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{activeAuctions.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100">My Auctions</h3>
            <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
                {showCreateForm ? 'Cancel' : '＋ New Auction'}
            </button>
        </div>
        
        {showCreateForm && <CreateAuctionForm onCreateAuction={onCreateAuction} onGenerate={onGenerateAuction} isGenerating={isGenerating} onClose={() => setShowCreateForm(false)} />}
        
        <div className="mt-6">
            <h4 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-200">Active</h4>
            {activeAuctions.length > 0 ? (
                <ul className="space-y-2">{activeAuctions.map(a => <li key={a.id} className="p-2 rounded bg-gray-50 dark:bg-gray-700 flex justify-between"><span>{a.title}</span><span className="font-semibold">${a.currentPrice}</span></li>)}</ul>
            ) : <p className="text-gray-500 dark:text-gray-400">No active auctions.</p>}
        </div>
        <div className="mt-6">
            <h4 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-200">Ended</h4>
            {endedAuctions.length > 0 ? (
                <ul className="space-y-2">{endedAuctions.map(a => <li key={a.id} className="p-2 rounded bg-gray-50 dark:bg-gray-700 flex justify-between"><span>{a.title}</span><span className="font-semibold">{a.highestBidderId ? `$${a.currentPrice}`: 'No bids'}</span></li>)}</ul>
            ) : <p className="text-gray-500 dark:text-gray-400">No ended auctions.</p>}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

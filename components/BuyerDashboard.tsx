
import React from 'react';
import { Auction, User } from '../types';

interface BuyerDashboardProps {
  user: User;
  auctions: Auction[];
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ user, auctions }) => {
  const auctionsWithMyBids = auctions.filter(a => a.bids.some(b => b.userId === user.id) && a.status === 'ACTIVE');
  const wonAuctions = auctions.filter(a => a.highestBidderId === user.id && a.status === 'ENDED');
  const isHighestBidderOn = auctions.filter(a => a.highestBidderId === user.id && a.status === 'ACTIVE');
  
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-100">My Bidding Activity</h3>
        
        <div>
          <h4 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">Winning</h4>
          {isHighestBidderOn.length > 0 ? (
            <ul className="space-y-2">
              {isHighestBidderOn.map(a => (
                <li key={a.id} className="p-3 rounded bg-green-50 dark:bg-green-900/30 flex justify-between items-center">
                  <span>{a.title}</span>
                  <span className="font-bold text-green-700 dark:text-green-300">${a.currentPrice.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 dark:text-gray-400">You are not the highest bidder on any active items.</p>}
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-2 text-gray-700 dark:text-gray-200">Active Bids</h4>
          {auctionsWithMyBids.length > 0 ? (
            <ul className="space-y-2">
              {auctionsWithMyBids.map(a => {
                  const myHighestBid = Math.max(...a.bids.filter(b => b.userId === user.id).map(b => b.amount));
                  return (
                    <li key={a.id} className="p-3 rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                      <div>
                          <p>{a.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Your highest bid: ${myHighestBid.toLocaleString()}</p>
                      </div>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">Current: ${a.currentPrice.toLocaleString()}</span>
                    </li>
                  );
                })}
            </ul>
          ) : <p className="text-gray-500 dark:text-gray-400">You haven't bid on any active items yet.</p>}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-100">Auctions Won</h3>
        {wonAuctions.length > 0 ? (
          <ul className="space-y-2">
            {wonAuctions.map(a => (
              <li key={a.id} className="p-3 rounded bg-indigo-50 dark:bg-indigo-900/30 flex justify-between items-center">
                <span>{a.title}</span>
                <div className="text-right">
                    <p className="font-bold text-indigo-700 dark:text-indigo-300">Won at ${a.currentPrice.toLocaleString()}</p>
                    <button className="text-sm mt-1 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md transition">
                        Pay Now (Simulated)
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500 dark:text-gray-400">You haven't won any auctions yet.</p>}
      </div>
    </div>
  );
};

export default BuyerDashboard;

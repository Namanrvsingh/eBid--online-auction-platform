
import React from 'react';
import { Auction } from '../types';
import AuctionCard from './AuctionCard';

interface AuctionListProps {
  auctions: Auction[];
  onSelectAuction: (auctionId: number) => void;
}

const AuctionList: React.FC<AuctionListProps> = ({ auctions, onSelectAuction }) => {
    const activeAuctions = auctions.filter(a => a.status === 'ACTIVE');
  return (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Active Auctions</h1>
        {activeAuctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeAuctions.map(auction => (
                    <AuctionCard key={auction.id} auction={auction} onSelectAuction={onSelectAuction} />
                ))}
            </div>
        ) : (
            <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No Active Auctions</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Check back later for new items!</p>
            </div>
        )}
    </div>
  );
};

export default AuctionList;

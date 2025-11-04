
import React, { useState, useEffect } from 'react';
import { Auction, User } from '../types';

interface AuctionDetailProps {
  auction: Auction;
  onBack: () => void;
  onPlaceBid: (auctionId: number, amount: number) => void;
  currentUser: User;
}

const CountdownTimer: React.FC<{ endTime: Date; status: string }> = ({ endTime, status }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                total: difference,
            };
        }
        return timeLeft;
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearTimeout(timer);
    });

    if (status !== 'ACTIVE' || timeLeft.total <= 0) {
        return <div className="text-2xl font-bold text-red-500">Auction Ended</div>;
    }

    return (
        <div className="flex space-x-4 text-center">
            {timeLeft.days > 0 && <div><div className="text-4xl font-bold">{timeLeft.days}</div><div className="text-sm text-gray-500">Days</div></div>}
            <div><div className="text-4xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div><div className="text-sm text-gray-500">Hours</div></div>
            <div><div className="text-4xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div><div className="text-sm text-gray-500">Minutes</div></div>
            <div><div className="text-4xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div><div className="text-sm text-gray-500">Seconds</div></div>
        </div>
    );
};

const BidForm: React.FC<{ auction: Auction; onPlaceBid: (auctionId: number, amount: number) => void; currentUser: User }> = ({ auction, onPlaceBid, currentUser }) => {
    const minBid = auction.currentPrice + Math.max(1, Math.ceil(auction.currentPrice * 0.05));
    const [bidAmount, setBidAmount] = useState<number | string>(minBid);

    useEffect(() => {
        setBidAmount(auction.currentPrice + Math.max(1, Math.ceil(auction.currentPrice * 0.05)));
    }, [auction.currentPrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceBid(auction.id, Number(bidAmount));
    };

    if (auction.status !== 'ACTIVE' || currentUser.id === auction.sellerId) {
        return (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-center text-gray-600 dark:text-gray-300">
                {auction.status !== 'ACTIVE' ? "Bidding is closed for this item." : "You cannot bid on your own item."}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="bid" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Place your bid (min. ${minBid})
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 sm:text-sm">$</span>
                <input
                    type="number"
                    name="bid"
                    id="bid"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid}
                    required
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Bid
                </button>
            </div>
        </form>
    );
};

const AuctionDetail: React.FC<AuctionDetailProps> = ({ auction, onBack, onPlaceBid, currentUser }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 lg:p-8">
      <button onClick={onBack} className="mb-6 text-indigo-600 dark:text-indigo-400 hover:underline">
        &larr; Back to all auctions
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img src={auction.imageUrl} alt={auction.title} className="w-full rounded-lg shadow-md" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{auction.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Listed by {auction.sellerName}</p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{auction.description}</p>
          
          <div className="my-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                    <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">${auction.currentPrice.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-right">Time Left</p>
                    <CountdownTimer endTime={auction.endTime} status={auction.status}/>
                </div>
            </div>
          </div>
          <BidForm auction={auction} onPlaceBid={onPlaceBid} currentUser={currentUser} />
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Bid History</h2>
        {auction.bids.length > 0 ? (
          <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {auction.bids.map((bid, index) => (
              <li key={bid.id} className={`flex justify-between items-center p-3 rounded-md ${index === 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{bid.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(bid.timestamp).toLocaleString()}</p>
                </div>
                <p className={`font-bold text-lg ${index === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-200'}`}>${bid.amount.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No bids yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default AuctionDetail;

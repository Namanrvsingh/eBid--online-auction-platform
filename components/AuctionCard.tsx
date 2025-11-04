
import React, { useState, useEffect } from 'react';
import { Auction } from '../types';

interface AuctionCardProps {
  auction: Auction;
  onSelectAuction: (auctionId: number) => void;
}

const CountdownTimer: React.FC<{ endTime: Date }> = ({ endTime }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <span className="font-mono text-sm">
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {`${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
        </span>
    );
};

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onSelectAuction }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
      onClick={() => onSelectAuction(auction.id)}
    >
      <img className="w-full h-56 object-cover" src={auction.imageUrl} alt={auction.title} />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 truncate">{auction.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 truncate">{auction.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Bid</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${auction.currentPrice.toLocaleString()}</p>
          </div>
          <div className="text-right">
             <p className="text-sm text-gray-500 dark:text-gray-400">Ends in</p>
             <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {auction.status === 'ACTIVE' ? <CountdownTimer endTime={auction.endTime} /> : <span className="text-red-500">Ended</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;

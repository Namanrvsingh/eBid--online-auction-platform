import React from 'react';
import { Auction, User, Role } from '../types';
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';
import BuyerDashboard from './BuyerDashboard';

interface DashboardProps {
  user: User;
  auctions: Auction[];
  users: User[];
  onCreateAuction: (auctionData: Omit<Auction, 'id' | 'sellerId' | 'sellerName' | 'bids' | 'status' | 'currentPrice' | 'startTime'>) => void;
  onGenerateAuction: (prompt: string) => Promise<{title: string, description: string, startingPrice: number, imageUrl: string} | null>;
  isGenerating: boolean;
  onEndAuctionEarly: (auctionId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { user, auctions, users } = props;

  const renderDashboard = () => {
    switch (user.role) {
      case Role.ADMIN:
        return <AdminDashboard users={users} auctions={auctions} onEndAuctionEarly={props.onEndAuctionEarly} />;
      case Role.SELLER:
        return (
          <SellerDashboard 
            user={user} 
            auctions={auctions}
            onCreateAuction={props.onCreateAuction}
            onGenerateAuction={props.onGenerateAuction}
            isGenerating={props.isGenerating}
          />
        );
      case Role.BUYER:
        return <BuyerDashboard user={user} auctions={auctions} />;
      default:
        return <div>Invalid user role.</div>;
    }
  };

  return (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            {user.role === Role.SELLER ? 'My Listings' : `${user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()} Dashboard`}
        </h1>
        {renderDashboard()}
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { User, Role } from '../types';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onGoHome: () => void;
  onShowDashboard: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, onGoHome, onShowDashboard }) => {
  const getDashboardLabel = () => {
    switch(currentUser.role) {
      case Role.ADMIN: return 'Admin Panel';
      case Role.SELLER: return 'My Listings';
      case Role.BUYER: return 'My Bids';
      default: return 'Dashboard';
    }
  }

  const getHomeLabel = () => {
    switch(currentUser.role) {
      case Role.SELLER: return 'Browse Auctions';
      default: return 'Auctions';
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              BidFusion
            </h1>
             <button onClick={onGoHome} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
              {getHomeLabel()}
            </button>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-gray-700 dark:text-gray-300 hidden sm:block">
                Welcome, <span className="font-semibold">{currentUser.username}</span>
            </span>
            <button 
                onClick={onShowDashboard} 
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium"
            >
                {getDashboardLabel()}
            </button>
            <button 
                onClick={onLogout} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm"
            >
                Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
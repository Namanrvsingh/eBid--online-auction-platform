
import { useState, useEffect, useCallback } from 'react';
import { Auction, User, Bid, Notification, AppView, Role } from '../types';
import { MOCK_AUCTIONS, MOCK_USERS } from '../constants';
import { generateAuctionDetails } from '../services/geminiService';

export const useAuctionSystem = () => {
  const [auctions, setAuctions] = useState<Auction[]>(MOCK_AUCTIONS);
  const [users] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [view, setView] = useState<AppView>({ type: 'AUCTION_LIST' });
  const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);
  
  const checkAuctionStatus = useCallback(() => {
    setAuctions(prevAuctions =>
      prevAuctions.map(auction => {
        if (auction.status === 'ACTIVE' && new Date(auction.endTime) < new Date()) {
          const newStatus = 'ENDED';
          const winner = auction.highestBidderId ? users.find(u => u.id === auction.highestBidderId)?.username : 'No one';
            addNotification(
            `Auction for "${auction.title}" has ended. Winner: ${winner} at $${auction.currentPrice}.`,
            'info'
          );
          return { ...auction, status: newStatus };
        }
        return auction;
      })
    );
  }, [addNotification, users]);

  useEffect(() => {
    const interval = setInterval(checkAuctionStatus, 1000);
    return () => clearInterval(interval);
  }, [checkAuctionStatus]);


  const login = (username: string, password_param: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password_param);
    if (user) {
      setCurrentUser(user);
      addNotification(`Welcome back, ${user.username}!`, 'success');
      // Redirect sellers to their dashboard immediately upon login
      if (user.role === Role.SELLER) {
        setView({ type: 'DASHBOARD' });
      } else {
        setView({ type: 'AUCTION_LIST' });
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    if(currentUser){
        addNotification(`Goodbye, ${currentUser.username}!`, 'info');
        setCurrentUser(null);
    }
  };

  const placeBid = (auctionId: number, amount: number) => {
    if (!currentUser) {
      addNotification('You must be logged in to place a bid.', 'error');
      return;
    }
    if (currentUser.role !== Role.BUYER) {
      addNotification('Only buyers can place bids.', 'error');
      return;
    }

    setAuctions(prevAuctions => {
      const newAuctions = [...prevAuctions];
      const auctionIndex = newAuctions.findIndex(a => a.id === auctionId);
      if (auctionIndex === -1) return prevAuctions;

      const auction = newAuctions[auctionIndex];

      if (auction.status !== 'ACTIVE') {
        addNotification('This auction has already ended.', 'error');
        return prevAuctions;
      }
      if (amount <= auction.currentPrice) {
        addNotification('Your bid must be higher than the current price.', 'error');
        return prevAuctions;
      }
       if (currentUser.id === auction.sellerId) {
        addNotification('You cannot bid on your own auction.', 'error');
        return prevAuctions;
      }

      const newBid: Bid = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        amount,
        timestamp: new Date(),
      };

      const updatedAuction = {
        ...auction,
        currentPrice: amount,
        highestBidderId: currentUser.id,
        bids: [newBid, ...auction.bids],
      };

      newAuctions[auctionIndex] = updatedAuction;
      addNotification(`Successfully placed bid of $${amount} on "${auction.title}"!`, 'success');
      return newAuctions;
    });
  };
  
  const createAuction = (auctionData: Omit<Auction, 'id' | 'sellerId' | 'sellerName' | 'bids' | 'status'| 'currentPrice' | 'startTime'>) => {
    if (!currentUser || currentUser.role !== Role.SELLER) {
        addNotification('You must be a seller to create an auction.', 'error');
        return;
    }

    const newAuction: Auction = {
        id: Date.now(),
        ...auctionData,
        sellerId: currentUser.id,
        sellerName: currentUser.username,
        bids: [],
        status: 'ACTIVE',
        currentPrice: auctionData.startingPrice,
        startTime: new Date(),
    };

    setAuctions(prev => [newAuction, ...prev]);
    addNotification(`Auction "${newAuction.title}" created successfully!`, 'success');
  };

  const handleGenerateAuction = async (prompt: string) => {
    if (!prompt) return null;
    setIsGenerating(true);
    try {
        const details = await generateAuctionDetails(prompt);
        if (details) {
            addNotification('Auction details generated by AI!', 'success');
            return {
                ...details,
                imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(details.title)}`
            };
        } else {
            addNotification('Could not generate auction details. Please try again.', 'error');
            return null;
        }
    } catch (error) {
        console.error("Error generating auction details:", error);
        addNotification('An error occurred while generating details.', 'error');
        return null;
    } finally {
        setIsGenerating(false);
    }
  };


  const selectAuction = (auctionId: number) => {
    setSelectedAuctionId(auctionId);
    setView({ type: 'AUCTION_DETAIL' });
  };
  
  const goHome = () => {
      // For sellers, "home" is their dashboard.
      if (currentUser?.role === Role.SELLER) {
          showDashboard();
      } else {
        setView({type: 'AUCTION_LIST'});
        setSelectedAuctionId(null);
      }
  }
  
  const showDashboard = () => {
      setView({type: 'DASHBOARD'});
      setSelectedAuctionId(null);
  }

  const endAuctionEarly = (auctionId: number) => {
    if (currentUser?.role !== Role.ADMIN) {
        addNotification("You don't have permission to perform this action.", 'error');
        return;
    }

    setAuctions(prev => prev.map(auction => {
        if (auction.id === auctionId && auction.status === 'ACTIVE') {
            addNotification(`Auction for "${auction.title}" has been closed by an admin.`, 'info');
            return { ...auction, status: 'ENDED', endTime: new Date() };
        }
        return auction;
    }));
  };
  
  const selectedAuction = auctions.find(a => a.id === selectedAuctionId);

  return {
    auctions,
    users,
    currentUser,
    notifications,
    view,
    selectedAuction,
    isGenerating,
    login,
    logout,
    placeBid,
    createAuction,
    handleGenerateAuction,
    selectAuction,
    goHome,
    showDashboard,
    endAuctionEarly,
  };
};
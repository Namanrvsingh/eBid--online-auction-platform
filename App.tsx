import React from 'react';
import { useAuctionSystem } from './hooks/useAuctionSystem';
import Navbar from './components/Navbar';
import Login from './components/Login';
import AuctionList from './components/AuctionList';
import AuctionDetail from './components/AuctionDetail';
import Dashboard from './components/Dashboard';
import NotificationContainer from './components/NotificationContainer';

const App: React.FC = () => {
  const {
    auctions,
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
    users,
    endAuctionEarly,
  } = useAuctionSystem();

  const renderView = () => {
    if (!currentUser) {
      return <Login onLogin={login} />;
    }
    
    switch (view.type) {
      case 'AUCTION_LIST':
        return <AuctionList auctions={auctions} onSelectAuction={selectAuction} />;
      case 'AUCTION_DETAIL':
        if (selectedAuction) {
          return (
            <AuctionDetail
              auction={selectedAuction}
              onBack={goHome}
              onPlaceBid={placeBid}
              currentUser={currentUser}
            />
          );
        }
        goHome();
        return null;
      case 'DASHBOARD':
        return (
          <Dashboard
            user={currentUser}
            auctions={auctions}
            users={users}
            onCreateAuction={createAuction}
            onGenerateAuction={handleGenerateAuction}
            isGenerating={isGenerating}
            onEndAuctionEarly={endAuctionEarly}
          />
        );
      default:
        return <AuctionList auctions={auctions} onSelectAuction={selectAuction} />;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
      {currentUser && (
        <Navbar 
            currentUser={currentUser} 
            onLogout={logout} 
            onGoHome={goHome}
            onShowDashboard={showDashboard}
        />
      )}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
      <NotificationContainer notifications={notifications} />
    </div>
  );
};

export default App;
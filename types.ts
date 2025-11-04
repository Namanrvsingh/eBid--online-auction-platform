export enum Role {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  username: string;
  role: Role;
  password?: string; // Made optional for now to avoid breaking existing code immediately
}

export interface Bid {
  id: number;
  userId: number;
  username: string;
  amount: number;
  timestamp: Date;
}

export interface Auction {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  sellerId: number;
  sellerName: string;
  startingPrice: number;
  currentPrice: number;
  highestBidderId?: number;
  startTime: Date;
  endTime: Date;
  bids: Bid[];
  status: 'ACTIVE' | 'ENDED';
}

export type AppView =
  | { type: 'AUCTION_LIST' }
  | { type: 'AUCTION_DETAIL' }
  | { type: 'DASHBOARD' };

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

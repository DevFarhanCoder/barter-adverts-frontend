export type Listing = {
  id: string;
  title: string;
  category: string;
  city: string;
  status: "active" | "paused" | "archived";
  createdAt: string;
  views: number;
  ownerId: string;
};

export type Trade = {
  id: string;
  listingId: string;
  withUser: string;
  status: "proposed" | "countered" | "accepted" | "declined" | "completed";
  createdAt: string;
};

export type MessageThread = {
  id: string;
  listingId: string;
  otherUser: string;
  lastMessage: string;
  unread: number;
  updatedAt: string;
};

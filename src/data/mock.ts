import { Listing, Trade, MessageThread } from "../types/barter";

export const listings: Listing[] = [
  { id: "l1", title: "iPhone 13", category: "Electronics", city: "Mumbai", status: "active", createdAt: "2025-08-05", views: 143, ownerId: "u1" },
  { id: "l2", title: "Yamaha F310 Guitar", category: "Music", city: "Pune", status: "active", createdAt: "2025-08-03", views: 62, ownerId: "u1" },
  { id: "l3", title: "Ergo Office Chair", category: "Furniture", city: "Mumbai", status: "paused", createdAt: "2025-07-30", views: 29, ownerId: "u1" },
];

export const trades: Trade[] = [
  { id: "t1", listingId: "l1", withUser: "Riya", status: "proposed", createdAt: "2025-08-05T09:00:00Z" },
  { id: "t2", listingId: "l2", withUser: "Aman", status: "accepted", createdAt: "2025-08-04T13:30:00Z" },
  { id: "t3", listingId: "l1", withUser: "Sanjay", status: "countered", createdAt: "2025-08-03T16:10:00Z" },
];

export const threads: MessageThread[] = [
  { id: "m1", listingId: "l1", otherUser: "Riya", lastMessage: "Can we meet at Andheri?", unread: 2, updatedAt: "2025-08-05T10:12:00Z" },
  { id: "m2", listingId: "l2", otherUser: "Aman", lastMessage: "Sharing photos now.", unread: 0, updatedAt: "2025-08-04T15:02:00Z" },
  { id: "m3", listingId: "l3", otherUser: "Meera", lastMessage: "Is it still available?", unread: 1, updatedAt: "2025-08-03T18:44:00Z" },
];

// src/types.ts

// User roles in the app
export type UserRole = "advertiser" | "media_owner";

// Authentication modes
export type AuthMode = "login" | "signup";

// Authenticated user data
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  token: string;
}

// Barter post item (as stored/fetched from backend)
export interface BarterPost {
  id: string;
  title: string;
  location?: string;
  description: string;
  offerings?: string;
  contact?: string;
  referenceUrl?: string;
  role: UserRole; // ✅ Helps filter Media Owners / Advertisers
  createdAt: string;
  updatedAt?: string;
  ownerId: string; // user who posted
}

// Payload for creating a barter post
export interface CreateBarterPostPayload {
  title: string;
  location?: string;
  description: string;
  offerings?: string;
  contact?: string;
  referenceUrl?: string;
  role: UserRole; // ✅ Required to tag post
}

// API generic response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

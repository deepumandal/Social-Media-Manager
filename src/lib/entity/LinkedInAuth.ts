export interface LinkedInAuth {
  id: number;
  userId: number;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  linkedinUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLinkedInAuthData {
  userId: number;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  linkedinUserId: string;
}

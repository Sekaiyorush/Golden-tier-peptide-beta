// Invitation Code System

export type InvitationCodeType = 'admin_user' | 'admin_partner' | 'partner_user';

export interface InvitationCode {
  id: string;
  code: string;
  type: InvitationCodeType;
  createdBy: string; // User ID who created it
  createdByName: string;
  createdAt: string;
  expiresAt?: string;
  maxUses: number;
  usedCount: number;
  usedBy: { userId: string; userName: string; usedAt: string }[];
  isActive: boolean;
  notes?: string;
  // For partner codes - links to partner's network
  partnerId?: string;
  partnerName?: string;
  // Default discount rate for users created with this code
  defaultDiscountRate?: number;
}

// Mock invitation codes are removed in favor of Supabase DatabaseContext

// Helper functions
export const generateInvitationCode = (prefix: string = 'GT'): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = prefix;
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Validation and mutation Logic will now exist entirely within the AuthContext/DatabaseContext wrappers in Supabase.

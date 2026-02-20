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

// Mock invitation codes
export const invitationCodes: InvitationCode[] = [
  // Admin-generated codes
  {
    id: 'inv1',
    code: 'GTADMIN2024',
    type: 'admin_user',
    createdBy: '1',
    createdByName: 'Admin',
    createdAt: '2024-01-01',
    maxUses: 100,
    usedCount: 45,
    usedBy: [],
    isActive: true,
    notes: 'General user invitation code',
  },
  {
    id: 'inv2',
    code: 'GTPARTNER001',
    type: 'admin_partner',
    createdBy: '1',
    createdByName: 'Admin',
    createdAt: '2024-01-15',
    maxUses: 10,
    usedCount: 5,
    usedBy: [
      { userId: '3', userName: 'John Smith', usedAt: '2024-01-20' },
      { userId: '4', userName: 'Sarah Johnson', usedAt: '2024-02-01' },
    ],
    isActive: true,
    notes: 'Partner invitation code - 25% discount tier',
    defaultDiscountRate: 25,
  },
  // Partner-generated codes
  {
    id: 'inv3',
    code: 'JOHNREF2024',
    type: 'partner_user',
    createdBy: '3',
    createdByName: 'John Smith',
    partnerId: 'p1',
    partnerName: 'John Smith',
    createdAt: '2024-02-01',
    maxUses: 50,
    usedCount: 12,
    usedBy: [],
    isActive: true,
    notes: 'John\'s customer referral code',
  },
  {
    id: 'inv4',
    code: 'SARAHPARTNER',
    type: 'partner_user',
    createdBy: '4',
    createdByName: 'Sarah Johnson',
    partnerId: 'p2',
    partnerName: 'Sarah Johnson',
    createdAt: '2024-02-10',
    maxUses: 30,
    usedCount: 8,
    usedBy: [],
    isActive: true,
    notes: 'Sarah\'s customer referral code',
  },
  {
    id: 'inv5',
    code: 'MICHAELVIP',
    type: 'partner_user',
    createdBy: '5',
    createdByName: 'Michael Chen',
    partnerId: 'p3',
    partnerName: 'Michael Chen',
    createdAt: '2024-02-15',
    maxUses: 100,
    usedCount: 34,
    usedBy: [],
    isActive: true,
    notes: 'Michael\'s VIP customer code',
  },
  // Expired/Inactive codes
  {
    id: 'inv6',
    code: 'EXPIRED2023',
    type: 'admin_user',
    createdBy: '1',
    createdByName: 'Admin',
    createdAt: '2023-01-01',
    expiresAt: '2023-12-31',
    maxUses: 100,
    usedCount: 98,
    usedBy: [],
    isActive: false,
    notes: 'Expired code from 2023',
  },
];

// Helper functions
export const generateInvitationCode = (prefix: string = 'GT'): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = prefix;
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const validateInvitationCode = (code: string, expectedType?: InvitationCodeType): InvitationCode | null => {
  const invitation = invitationCodes.find(
    (inv) => inv.code === code && inv.isActive
  );
  
  if (!invitation) return null;
  
  // Check expiration
  if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
    return null;
  }
  
  // Check usage limit
  if (invitation.usedCount >= invitation.maxUses) {
    return null;
  }
  
  // Check type if specified
  if (expectedType && invitation.type !== expectedType) {
    return null;
  }
  
  return invitation;
};

export const useInvitationCode = (code: string, userId: string, userName: string): boolean => {
  const invitation = invitationCodes.find((inv) => inv.code === code);
  if (!invitation || !invitation.isActive) return false;
  if (invitation.usedCount >= invitation.maxUses) return false;
  if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) return false;
  
  invitation.usedCount++;
  invitation.usedBy.push({
    userId,
    userName,
    usedAt: new Date().toISOString().split('T')[0],
  });
  
  return true;
};

// Get codes by creator
export const getCodesByCreator = (creatorId: string): InvitationCode[] => {
  return invitationCodes.filter((inv) => inv.createdBy === creatorId);
};

// Get codes for partner's network
export const getCodesForPartner = (partnerId: string): InvitationCode[] => {
  return invitationCodes.filter((inv) => inv.partnerId === partnerId);
};

// Get network stats for a partner
export interface NetworkStats {
  totalReferrals: number;
  directReferrals: number;
  indirectReferrals: number;
  totalCustomerSignups: number;
  activeCodes: number;
  totalCodeUses: number;
}

export const calculateNetworkStats = (partnerId: string): NetworkStats => {
  const partnerCodes = getCodesForPartner(partnerId);
  const totalUses = partnerCodes.reduce((sum, code) => sum + code.usedCount, 0);
  
  return {
    totalReferrals: 0, // Will be calculated from partners data
    directReferrals: 0,
    indirectReferrals: 0,
    totalCustomerSignups: totalUses,
    activeCodes: partnerCodes.filter((c) => c.isActive).length,
    totalCodeUses: totalUses,
  };
};

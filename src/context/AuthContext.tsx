import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { validateInvitationCode, useInvitationCode, type InvitationCode } from '@/data/invitations';

export type UserRole = 'customer' | 'partner' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  partnerId?: string;
  discountRate?: number;
  invitedBy?: string; // ID of who invited them
  invitedByName?: string;
  invitationCode?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPartner: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, invitationCode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  validateCode: (code: string) => { valid: boolean; code?: InvitationCode; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: User[] = [
  { 
    id: '1', 
    email: 'admin@goldentier.com', 
    name: 'Admin', 
    role: 'admin',
    joinedAt: '2023-01-01',
  },
  { 
    id: '2', 
    email: 'user@example.com', 
    name: 'Test User', 
    role: 'customer',
    invitedBy: '1',
    invitedByName: 'Admin',
    invitationCode: 'GTADMIN2024',
    joinedAt: '2024-01-15',
  },
  { 
    id: '3', 
    email: 'john@researchlab.com', 
    name: 'John Smith', 
    role: 'partner', 
    partnerId: 'p1', 
    discountRate: 25,
    invitedBy: '1',
    invitedByName: 'Admin',
    invitationCode: 'GTPARTNER001',
    joinedAt: '2024-01-20',
  },
  { 
    id: '4', 
    email: 'sarah@biotech.com', 
    name: 'Sarah Johnson', 
    role: 'partner', 
    partnerId: 'p2', 
    discountRate: 20,
    invitedBy: '1',
    invitedByName: 'Admin',
    invitationCode: 'GTPARTNER001',
    joinedAt: '2024-02-01',
  },
  { 
    id: '5', 
    email: 'michael@peptideworld.com', 
    name: 'Michael Chen', 
    role: 'partner', 
    partnerId: 'p3', 
    discountRate: 30,
    invitedBy: '1',
    invitedByName: 'Admin',
    invitationCode: 'GTPARTNER001',
    joinedAt: '2024-02-18',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoaded(true);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = MOCK_USERS.find((u) => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const validateCode = (code: string): { valid: boolean; code?: InvitationCode; error?: string } => {
    const invitation = validateInvitationCode(code);
    
    if (!invitation) {
      return { valid: false, error: 'Invalid or expired invitation code' };
    }
    
    return { valid: true, code: invitation };
  };

  const register = async (
    name: string, 
    email: string, 
    _password: string, 
    invitationCode: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Validate invitation code
    const invitation = validateInvitationCode(invitationCode);
    
    if (!invitation) {
      return { success: false, error: 'Invalid, expired, or fully used invitation code' };
    }

    // Check if email already exists
    const existingUser = MOCK_USERS.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Determine role based on invitation type
    let role: UserRole = 'customer';
    let partnerId: string | undefined;
    let discountRate: number | undefined;

    switch (invitation.type) {
      case 'admin_partner':
        role = 'partner';
        partnerId = `p${Date.now()}`;
        discountRate = invitation.defaultDiscountRate || 20;
        break;
      case 'partner_user':
        role = 'customer';
        // Customer gets linked to partner who invited them
        break;
      case 'admin_user':
      default:
        role = 'customer';
        break;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      partnerId,
      discountRate,
      invitedBy: invitation.createdBy,
      invitedByName: invitation.createdByName,
      invitationCode: invitation.code,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    // Use the invitation code
    const codeUsed = useInvitationCode(invitationCode, newUser.id, name);
    if (!codeUsed) {
      return { success: false, error: 'Failed to use invitation code' };
    }

    MOCK_USERS.push(newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isPartner: user?.role === 'partner',
        isCustomer: user?.role === 'customer',
        login,
        register,
        logout,
        validateCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

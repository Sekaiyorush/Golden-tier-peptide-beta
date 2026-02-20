import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type InvitationCode } from '@/data/invitations';
import { useDatabase } from './DatabaseContext';
import { supabase } from '@/lib/supabase';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { db } = useDatabase();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Find them in the cache
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setIsLoaded(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string, email: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (data) {
      setUser({
        id: data.id,
        email: email,
        name: data.full_name || email.split('@')[0],
        role: data.role as UserRole,
        partnerId: data.role === 'partner' ? data.id : undefined,
        discountRate: data.discount_rate,
        joinedAt: data.created_at
      });
    } else if (error) {
      console.error("Could not fetch profile", error);
    }
    setIsLoaded(true);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      return false;
    }
    return true;
  };

  const validateCode = (code: string): { valid: boolean; code?: InvitationCode; error?: string } => {
    // Actually we need to validate against db.invitationCodes
    const invitation = db.invitationCodes.find((inv) => inv.code === code && inv.isActive);

    if (!invitation) return { valid: false, error: 'Invalid or expired invitation code' };
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return { valid: false, error: 'Invalid or expired invitation code' };
    }
    if (invitation.usedCount >= invitation.maxUses) return { valid: false, error: 'Invalid or expired invitation code' };

    return { valid: true, code: invitation as any };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    invitationCode: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Optional: Validate invitation code real logic here if desired

    // Register the user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return { success: false, error: authError.message };

    // Assuming authData.user is available immediately if email confirmation is disabled
    if (authData.user) {
      // Determine role from code, defaulting to customer
      const role = invitationCode.includes('PARTNER') ? 'partner' : 'customer';

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: email,
        full_name: name,
        role: role,
        discount_rate: role === 'partner' ? 20 : 0
      });

      if (profileError) return { success: false, error: profileError.message };
      return { success: true };
    }

    return { success: false, error: 'Failed to create user' };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!isLoaded) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading application...</div>;
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

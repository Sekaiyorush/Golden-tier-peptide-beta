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
  invitedBy?: string;
  invitedByName?: string;
  invitationCode?: string;
  joinedAt: string;
  company?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPartner: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, invitationCode: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordForEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  validateCode: (code: string) => { valid: boolean; code?: InvitationCode; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { db, refreshData } = useDatabase();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
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
        joinedAt: data.created_at,
        company: data.company_name,
        phone: data.phone_number,
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
    const invitation = db.invitationCodes.find((inv) => inv.code === code && inv.isActive);

    if (!invitation) return { valid: false, error: 'Invalid or expired invitation code' };
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return { valid: false, error: 'This invitation code has expired' };
    }
    if (invitation.usedCount >= invitation.maxUses) {
      return { valid: false, error: 'This invitation code has reached its maximum uses' };
    }

    return { valid: true, code: invitation };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    invitationCode: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Validate the invitation code from Supabase data
    const validation = validateCode(invitationCode);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const invCode = validation.code!;
    // Determine role from the invitation code's type/role, NOT from string matching
    const role: UserRole = invCode.type === 'admin_partner' || invCode.type === 'partner_user'
      ? 'partner'
      : 'customer';

    // Register the user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return { success: false, error: authError.message };

    if (authData.user) {
      // Create profile with the correct role from invitation code
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: email,
        full_name: name,
        role: role,
        discount_rate: invCode.defaultDiscountRate || (role === 'partner' ? 20 : 0),
        invited_by: invCode.partnerId || invCode.createdBy || null,
        status: role === 'partner' ? 'active' : 'active',
      });

      if (profileError) return { success: false, error: profileError.message };

      // Increment the invitation code's usage count
      await supabase.from('invitation_codes').update({
        current_uses: (invCode.usedCount || 0) + 1
      }).eq('code', invCode.code);

      // Refresh data
      await refreshData();
      return { success: true };
    }

    return { success: false, error: 'Failed to create user' };
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
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
        resetPasswordForEmail,
        updatePassword,
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

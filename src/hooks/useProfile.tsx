import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  pengguna_id: number;
  nama_pengguna: string;
  email_pengguna: string;
  created_at?: string;
  updated_at?: string;
}

interface UserHouse {
  id_rumah: number;
  nama_rumah: string;
  role: string;
  member_count: number;
  item_count: number;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [houses, setHouses] = useState<UserHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Mock profile data for now
      const mockProfile: UserProfile = {
        id: user.id,
        pengguna_id: 1,
        nama_pengguna: user.user_metadata?.nama_pengguna || user.email?.split('@')[0] || 'User',
        email_pengguna: user.email || '',
        created_at: user.created_at,
        updated_at: new Date().toISOString(),
      };
      
      setProfile(mockProfile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHouses = async () => {
    if (!user || !profile) return;

    try {
      // Mock houses data
      const mockHouses: UserHouse[] = [
        {
          id_rumah: 1,
          nama_rumah: "Rumah A",
          role: "admin",
          member_count: 4,
          item_count: 23
        },
        {
          id_rumah: 2,
          nama_rumah: "Kos B", 
          role: "member",
          member_count: 8,
          item_count: 18
        }
      ];

      setHouses(mockHouses);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return { error: new Error('Not authenticated') };

    try {
      // For now, just update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (profile) {
      fetchUserHouses();
    }
  }, [profile]);

  return {
    profile,
    houses,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
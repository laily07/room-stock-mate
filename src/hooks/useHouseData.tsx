import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useHouseData = (houseName: string) => {
  const { user } = useAuth();
  const [houseId, setHouseId] = useState<number | null>(null);
  const [userPenggunaId, setUserPenggunaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && houseName) {
      fetchHouseData();
    }
  }, [user, houseName]);

  const fetchHouseData = async () => {
    try {
      // Get user profile to get pengguna_id
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('pengguna_id')
        .eq('id', user?.id)
        .single();

      if (userProfile) {
        setUserPenggunaId(userProfile.pengguna_id);
        
        // Get house data
        const { data: rumah } = await supabase
          .from('rumah')
          .select('id_rumah')
          .eq('nama_rumah', houseName)
          .eq('id_pengguna', userProfile.pengguna_id)
          .single();

        if (rumah) {
          setHouseId(rumah.id_rumah);
        }
      }
    } catch (error) {
      console.error('Error fetching house data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { houseId, userPenggunaId, loading };
};
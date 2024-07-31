'use client'; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from './Contexts/AuthContext';


const ProtectedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedPage;

"use client";
import { AuthProvider } from "./Contexts/AuthContext";
import ProtectedPage from "./ProtectedPage"
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to login page or home page after successful logout
      router.push('/login'); // or '/'
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <AuthProvider>
      <ProtectedPage>
        <h1>Hello</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </ProtectedPage>
    </AuthProvider>
  );
}

"use client";
import { AuthProvider } from "./Contexts/AuthContext";
import ProtectedPage from "./ProtectedPage"
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { useRouter } from 'next/navigation';
import AddPantrySection from "./Pantry/AddPantrySection";
import ShowPantryList from "./Pantry/ShowPantryList";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); 
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
        <AddPantrySection/>
        <ShowPantryList/>
      </ProtectedPage>
    </AuthProvider>
  );
}

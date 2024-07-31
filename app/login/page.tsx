'use client';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Log In</h1>
      {error && <p>{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogIn();
        }}
      >
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded p-2 w-full text-black placeholder-gray-500"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded p-2 w-full text-black placeholder-gray-500"
          />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

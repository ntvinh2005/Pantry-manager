"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig'; // Adjust the path as needed

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    // Basic validation
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      // Perform sign-up logic
      await createUserWithEmailAndPassword(auth, email, password);

      // On success, redirect to the home page
      router.push('/');
    } catch (err) {
      // Handle errors
      if (err instanceof Error) {
        if (err.message.includes('auth/invalid-email')) {
          setError('Invalid email address.');
        } else if (err.message.includes('auth/weak-password')) {
          setError('Password should be at least 6 characters.');
        } else {
          setError('Sign-up failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p>{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;


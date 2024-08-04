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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full text-gray-900 placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign Up
          </button>
          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Log In!
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;


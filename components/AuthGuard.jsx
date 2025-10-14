"use client"
import React from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { assets } from "@/assets/assets";

const AuthGuard = ({ children, fallback = null }) => {
  const { isSignedIn, isLoaded } = useUser();
  const { router } = useAppContext();

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // If user is not signed in, show login prompt
  if (!isSignedIn) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-md">
          <Image 
            src={assets.user_icon} 
            alt="user icon" 
            className="w-16 h-16 mx-auto mb-6 text-gray-400"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-8">
            You need to be signed in to access this feature. Please sign in to continue.
          </p>
          <div className="space-y-4">
            <SignInButton mode="modal">
              <button className="w-full bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 transition font-medium">
                Sign In
              </button>
            </SignInButton>
            <button 
              onClick={() => router.push('/')}
              className="w-full text-gray-600 py-2 px-6 rounded-md hover:bg-gray-100 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is signed in, render the protected content
  return children;
};

export default AuthGuard;


"use client"
import { useState } from 'react';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import ListingCard from './ListingCard';
import ListingForm from './ListingForm';
import { useAuth } from '../app/hooks/useAuth';


export default function MarketplaceHome() {
  const { isAuthenticated, user, authError, isLoading, login, register, logout } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });


  const [listings, setListings] = useState([
    {
      title: "Vintage Leather Sofa",
      description: "Comfortable and in great condition",
      location: "Chennai",
      price: 15000,
      category: "Furniture",
      images: ["sofa1.jpg", "sofa2.jpg"],
      seller: "john@example.com"
    }
  ]);


  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await login(authForm);
      } else {
        await register(authForm);
      }
      setShowAuthModal(false);
    } catch (error) {
      console.log("Error during authentication:", error);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      {/* Hero */}
      <div className="bg-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Find Amazing Local Deals</h1>
          <div className="flex gap-4 justify-center">
            <input
              type="text"
              placeholder="Search items..."
              className="px-4 py-2 bg-white placeholder:text-black rounded-lg w-96 focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Listing Form */}
      <ListingForm/>

      {/* Listings */}
      <div className="max-w-6xl mx-auto mt-12 p-6">
        <h2 className="text-2xl text-black font-semibold mb-6">Latest Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, idx) => (
            <ListingCard key={idx} listing={listing} />
          ))}
        </div>
      </div>

      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSubmit={handleAuth}
        isLoginMode={isLoginMode}
        toggleMode={() => setIsLoginMode(!isLoginMode)}
        user={authForm}
        setUser={setAuthForm}
        authError={authError}
        isLoading={isLoading}
      />
    </div>
  );
}

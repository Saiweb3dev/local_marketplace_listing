"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../app/hooks/useAuth";
import { getListings } from "../app/services/api";
import AuthModal from "./AuthModal";
import ListingForm from "./Forms/ListingForm";
import UpdateListingForm from "./Forms/UpdateListingForm";
import DeleteListingForm from "./Forms/DeleteListingForm";
import ListingCard from "./ListingCard";
import Navbar from "./Navbar";

export default function MarketplaceHome() {
  const {
    isAuthenticated,
    user,
    authError,
    isLoading,
    login,
    register,
    logout,
  } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState(null);
  const [activeTab, setActiveTab] = useState('create');

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

  // Function to fetch listings
  const fetchListings = async () => {
    try {
      console.log("Fetching listings from API...");
      const data = await getListings();
      setListings(data);
      setListingsError(null);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListingsError("Failed to load listings. Please try again later.");
    } finally {
      setListingsLoading(false);
    }
  };

    // Function to render the active form component based on tab
    const renderActiveForm = () => {
      switch (activeTab) {
        case 'create':
          return <ListingForm onListingCreated={fetchListings} />;
        case 'update':
          return <UpdateListingForm onListingUpdated={fetchListings} />;
        case 'delete':
          return <DeleteListingForm onListingDeleted={fetchListings} />;
        default:
          return <ListingForm onListingCreated={fetchListings} />;
      }
    };

      // Function to get tab style based on active state
  const getTabStyle = (tabName) => {
    return `px-6 py-3 text-center font-medium rounded-t-lg ${
      activeTab === tabName 
        ? 'bg-gray-800 text-white' 
        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    }`;
  };

  // Initial fetch and set up interval for refreshing
  useEffect(() => {
    // Fetch listings immediately on component mount
    fetchListings();

    // Set up interval to fetch listings every 5 seconds
    const intervalId = setInterval(() => {
      fetchListings();
    }, 5000);
    console.log("Fetching listings every 5 seconds");
    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

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
          <h1 className="text-4xl font-bold text-white mb-6">
            Find Amazing Local Deals
          </h1>
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

      {/* Listing Form Tabs */}
      <div className="max-w-2xl mx-auto mt-12">
        <div className="flex justify-center space-x-2">
          <button 
            className={getTabStyle('create')}
            onClick={() => setActiveTab('create')}
          >
            Create Listing
          </button>
          <button 
            className={getTabStyle('update')}
            onClick={() => setActiveTab('update')}
          >
            Update Listing
          </button>
          <button 
            className={getTabStyle('delete')}
            onClick={() => setActiveTab('delete')}
          >
            Delete Listing
          </button>
        </div>
        
        {/* Active Form Container */}
        <div className="border border-gray-300 border-t-0 rounded-b-lg">
          {renderActiveForm()}
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-6xl mx-auto mt-12 p-6">
        <h2 className="text-2xl text-black font-semibold mb-6">
          Latest Listings
        </h2>

        {listingsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {listingsError}
          </div>
        )}

        {listingsLoading && listings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.length > 0 ? (
              listings.map((listing, idx) => (
                <ListingCard key={idx} listing={listing} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-600">No listings available yet.</p>
              </div>
            )}
          </div>
        )}
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

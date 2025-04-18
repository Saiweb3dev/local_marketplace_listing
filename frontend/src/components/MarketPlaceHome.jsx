"use client"
import { useState } from 'react';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import ListingCard from './ListingCard';

const categories = ['Furniture', 'Electronics', 'Fashion', 'Books', 'Sports', 'Others'];

export default function MarketplaceHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState({ email: '', password: '' });
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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: 0,
    category: "",
    images: [],
    seller: ""
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
      setShowAuthModal(false);
    } catch {
      setAuthError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setListings([...listings, { ...formData, seller: user.email }]);
    setFormData({
      title: "",
      description: "",
      location: "",
      price: 0,
      category: "",
      images: [],
      seller: ""
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={() => {
          setIsAuthenticated(false);
          setUser({ email: '', password: '' });
        }}
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

      {/* Add Listing Form */}
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-black rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Add New Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
            {isAuthenticated ? 'Add Listing' : 'Login to Add Listing'}
          </button>
        </form>
      </div>

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
        user={user}
        setUser={setUser}
        authError={authError}
        isLoading={isLoading}
      />
    </div>
  );
}

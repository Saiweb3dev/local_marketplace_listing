"use client";
import { useState } from 'react';
import { getListingById, updateListing } from '../../app/services/api';
import { useAuth } from '../../app/hooks/useAuth';

const categories = ['Furniture', 'Electronics', 'Fashion', 'Books', 'Sports', 'Others'];

export default function UpdateListingForm({ onListingUpdated }) {
  const { isAuthenticated, user, token } = useAuth();
  const [listingId, setListingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [foundListing, setFoundListing] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: 0,
    category: "",
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!listingId) {
      setError('Please enter a listing ID');
      return;
    }

    setIsSearching(true);
    setError(null);
    setFoundListing(null);
    
    try {
      const listing = await getListingById(listingId);
      setFoundListing(listing);
      
      // Populate the form with current listing data
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        location: listing.location || '',
        price: listing.price || 0,
        category: listing.category || '',
      });
      
    } catch (err) {
      setError('Listing not found. Please check the ID and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await updateListing(listingId, formData, token);
      setSuccess("Listing updated successfully!");
      
      // Call the callback to refresh listings if provided
      if (onListingUpdated) {
        onListingUpdated();
      }
    } catch (err) {
      setError(err.message || "Failed to update listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-black rounded-xl shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Update Listing</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {showAuthWarning && !isAuthenticated && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Please login to update a listing.
        </div>
      )}
      
      {/* Search for listing by ID */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Listing ID"
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg text-white placeholder:text-white"
            required
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      {/* Update form - only shown when a listing is found */}
      {foundListing && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-gray-700 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-2">Current Listing Details (ID: {foundListing.id})</h3>
            <p><strong>Title:</strong> {foundListing.title}</p>
            <p><strong>Price:</strong> ${foundListing.price}</p>
            <p><strong>Category:</strong> {foundListing.category}</p>
          </div>
          
          <h3 className="text-lg font-medium">Update Information</h3>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-white placeholder:text-white"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-white placeholder:text-white"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 border rounded-lg text-white placeholder:text-white"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="px-4 py-2 border rounded-lg text-white placeholder:text-white"
              required
            />
          </div>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-white placeholder:text-white"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Listing'}
          </button>
        </form>
      )}
    </div>
  );
}
"use client";
import { useState } from 'react';
import { getListingById, deleteListing } from '../../app/services/api';
import { useAuth } from '../../app/hooks/useAuth';

export default function DeleteListingForm({ onListingDeleted }) {
  const { isAuthenticated, user, token } = useAuth();
  const [listingId, setListingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [foundListing, setFoundListing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!listingId) {
      setError('Please enter a listing ID');
      return;
    }

    setIsSearching(true);
    setError(null);
    setFoundListing(null);
    setConfirmDelete(false);
    
    try {
      const listing = await getListingById(listingId);
      setFoundListing(listing);
    } catch (err) {
      setError('Listing not found. Please check the ID and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      return;
    }

    setIsDeleting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await deleteListing(listingId, token);
      setSuccess("Listing deleted successfully!");
      setFoundListing(null);
      setListingId('');
      setConfirmDelete(false);
      
      // Call the callback to refresh listings if provided
      if (onListingDeleted) {
        onListingDeleted();
      }
    } catch (err) {
      setError(err.message || "Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-black placeholder:text-white rounded-xl shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Delete Listing</h2>
      
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
          Please login to delete a listing.
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
      
      {/* Listing details and delete confirmation */}
      {foundListing && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Listing Details (ID: {foundListing.id})</h3>
            <p><strong>Title:</strong> {foundListing.title}</p>
            <p><strong>Description:</strong> {foundListing.description}</p>
            <p><strong>Price:</strong> ${foundListing.price}</p>
            <p><strong>Category:</strong> {foundListing.category}</p>
            <p><strong>Location:</strong> {foundListing.location}</p>
          </div>
          
          {!confirmDelete ? (
            <button 
              onClick={() => setConfirmDelete(true)}
              className="w-full bg-red-600 text-white py-2 rounded-lg"
            >
              Delete This Listing
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-400 font-semibold">Are you sure you want to delete this listing? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button 
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete It'}
                </button>
                <button 
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
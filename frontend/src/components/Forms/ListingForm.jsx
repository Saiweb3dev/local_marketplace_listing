"use client";
import { useState } from "react";
import { useAuth } from "../../app/hooks/useAuth";
import { createListing } from "../../app/services/api";

const categories = [
  "Furniture",
  "Electronics",
  "Fashion",
  "Books",
  "Sports",
  "Others",
];

export default function ListingForm({ onListingCreated }) {
  const { isAuthenticated, user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: 0,
    category: "",
    images: [],
  });

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
      const response = await createListing(formData, token);
      setSuccess("Listing created successfully!");

      // Clear form after successful submission
      setFormData({
        title: "",
        description: "",
        location: "",
        price: 0,
        category: "",
        images: [],
      });

      // Call the callback to refresh listings
      if (onListingCreated) {
        onListingCreated();
      }
    } catch (err) {
      setError(err.message || "Failed to create listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-black rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add New Listing</h2>

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
          Please login to create a listing.
        </div>
      )}

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
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            className="px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
          disabled={isLoading}
        >
          {isLoading
            ? "Creating..."
            : isAuthenticated
            ? "Add Listing"
            : "Login to Add Listing"}
        </button>
      </form>
    </div>
  );
}

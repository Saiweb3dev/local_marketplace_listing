<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Listing;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ListingController extends Controller
{
    use AuthorizesRequests;

    // GET /api/listings → fetch all listings
    public function index()
    {
        // ORDER BY created_at DESC + pagination
        return Listing::latest()->paginate(10);
    }

    // POST /api/listings → create a new listing
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|string',
            'images' => 'nullable|array',
        ]);

        // Create the listing. Automatically sets fields from request + adds logged-in user.
        $listing = Listing::create([
            ...$request->all(),
            'user_id' => Auth::id(),
        ]);

        return response()->json($listing,201);
    }

     // GET /api/listings/{id} → fetch one listing
    public function show(Listing $listing)
    {
        return $listing;
    }

     // PUT /api/listings/{id} → update listing
    public function update(Request $request, Listing $listing)
    {
        $this->authorize('update', $listing);

        $request->validate([
            'title'=> 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'location'=> 'sometimes|string',
            'price' => 'sometimes|numeric',
            'category' => 'sometimes|string',
            'images' => 'nullable|array',
        ]);

        $listing->update($request->all());

        return response()->json($listing);
    }

    // DELETE /api/listings/{id} → delete listing
    public function destroy(Listing $listing)
    {
        $this->authorize('delete', $listing); // optional if using policies

        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }
}



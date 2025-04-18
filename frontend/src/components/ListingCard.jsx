export default function ListingCard({ listing }) {
  return (
    <div className="bg-black rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex space-x-2 p-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{listing.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold">
            ₹{listing.price.toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm">{listing.location}</span>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="inline-block bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
            {listing.category}
          </span>
          <span className="text-gray-500 text-xs">{listing.seller}</span>
        </div>
      </div>
    </div>
  );
}

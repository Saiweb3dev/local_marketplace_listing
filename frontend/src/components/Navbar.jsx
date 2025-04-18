export default function Navbar({ isAuthenticated, user, onLogout, onAuthOpen }) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Local Marketplace</h1>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={onLogout}
                className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthOpen}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

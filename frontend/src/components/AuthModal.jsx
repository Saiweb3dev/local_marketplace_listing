export default function AuthModal({
  show,
  onClose,
  onSubmit,
  isLoginMode,
  toggleMode,
  user,
  setUser,
  authError,
  isLoading
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white text-black placeholder:text-blue-600 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">
          {isLoginMode ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name field - only shown in Sign Up mode */}
          {!isLoginMode && (
            <input
              type="text"
              value={user.name || ''}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          )}
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          {authError && <p className="text-red-600 text-sm">{authError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isLoginMode ? 'Login' : 'Sign Up'}
          </button>
          <button type="button" onClick={toggleMode} className="w-full text-blue-600 text-sm">
            {isLoginMode ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
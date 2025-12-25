import { useState } from 'react';
import { useAuth } from './AuthContext';

function LoginModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    
    if (result.success) {
      // Close modal
      document.getElementById('login_modal').close();
      setUsername('');
      setPassword('');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const openRegisterModal = () => {
    document.getElementById('login_modal').close();
    document.getElementById('register_modal').showModal();
  };

  return (
    <dialog id="login_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white border border-lighterGreen">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 className="font-bold text-2xl text-darkGreen mb-6 text-center">Welcome Back</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60"
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray disabled:opacity-50 font-semibold"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={openRegisterModal}
              className="text-darkGreen hover:underline font-semibold"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </dialog>
  );
}

export default LoginModal;
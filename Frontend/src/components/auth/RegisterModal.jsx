import { useState } from 'react';
import { useAuth } from './AuthContext';

function RegisterModal() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await register(formData);
    
    if (result.success) {
      // Close modal
      document.getElementById('register_modal').close();
      setFormData({
        email: '',
        username: '',
        password: '',
        password_confirm: ''
      });
    } else {
      setErrors(result.error);
    }
    
    setLoading(false);
  };

  const openLoginModal = () => {
    document.getElementById('register_modal').close();
    document.getElementById('login_modal').showModal();
  };

  return (
    <dialog id="register_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white border border-lighterGreen max-w-md">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 className="font-bold text-2xl text-darkGreen mb-6 text-center">Join YouMatter</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.non_field_errors && (
            <div className="alert alert-error text-sm">
              <span>{errors.non_field_errors[0]}</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username[0]}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
            {errors.password_confirm && <p className="text-red-500 text-xs mt-1">{errors.password_confirm[0]}</p>}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray disabled:opacity-50 font-semibold"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={openLoginModal}
              className="text-darkGreen hover:underline font-semibold"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </dialog>
  );
}

export default RegisterModal;
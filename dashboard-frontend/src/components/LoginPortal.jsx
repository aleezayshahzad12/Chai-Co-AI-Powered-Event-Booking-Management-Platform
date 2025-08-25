import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';

//the login portal will aloo the employees to enter the generated id and the password they have by themselves created. the username is the employee id 
//the system made for the employees. the portal will allow the employees to set new passwords if they have forgot there old one or they have forgot there employee ids

const LoginPortal = ({ onLogin, onToSignup, onToForgotId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const Submit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };
  return (
    <div className="fixed inset-0 bg-pink-950  flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-pink-900 mb-6 text-center">Employee Login</h2>
        
        <form onSubmit={Submit} 
        className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pink-800 mb-2">Employee ID</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-pink-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder="Enter your ID"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-800 mb-2">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-pink-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <button
            onClick={onToForgotId}
            className="text-pink-600 hover:text-pink-700 text-sm"
          >
            Forgot your ID? 
          </button>
          
          <div className="border-t border-pink-200 pt-3">
            <p className="text-sm text-pink-600">
              New User?{' '}
              <button
                onClick={onToSignup}
                className="text-pink-800 hover:text-pink-900 font-medium"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPortal;
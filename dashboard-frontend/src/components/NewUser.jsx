

import { useState } from 'react';
import { FaArrowLeft, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';


//create password is for the employees who already have the employee id generated in the backend. 
//once the id is generated the, employee will click on create passwords, enter the email to see if the employee is authorized
// and then crreate the password the employee wants for the login portal
const NewUser = ({ onSignup, onToLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const Submit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onSignup(employeeId, email, password);
  };

  return (
    <div className="fixed inset-0 bg-pink-950   flex items-center  justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center mb-6">
          <button onClick={onToLogin} className="text-pink-600 hover:text-pink-700 mr-2">
            <FaArrowLeft />
          </button>
          <h2 className="text-2xl font-bold text-pink-900 text-center flex-1">Create Password</h2>
        </div>
        
        <p className="text-sm text-pink-600 mb-4 text-center">
          Enter your Employee ID and email to create your password
        </p>
        
        <form onSubmit={Submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pink-800 mb-2">Employee ID</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-pink-400" />
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)} //when setting the password for the first time, the system must verify that the enterred id is matching the id saved in the system
                className="w-full pl-10 pr-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder="Enter your Employee ID"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-800 mb-2">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-pink-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder="Enter your company email"
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
                placeholder="Create password"
                required
              />
            </div>
            <p className="text-xs text-pink-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-800 mb-2">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-pink-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Create Password
          </button>
        </form>
      </div>
    </div>
  );
};
  export default NewUser;
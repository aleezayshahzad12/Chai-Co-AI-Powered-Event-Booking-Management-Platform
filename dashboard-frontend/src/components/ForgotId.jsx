
import React, { useState } from "react";

import { FaArrowLeft, FaEnvelope, } from 'react-icons/fa';

//this class is building the portal when the team memeber hits forgot id. in order to again the username aka id, the team memeber must type the email saved in the database 
//this will be cross examined and if verified, the id will be sent to the email. 
const ForgotId = ({ onRecoverId, onToLogin }) => {
    const [email, setEmail] = useState('');
  
    const Submit = (e) => {
      e.preventDefault();
      onRecoverId(email);
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
          <div className="flex items-center mb-6">
            <button 
            onClick={onToLogin} 
            className="text-pink-600 hover:text-pink-700 mr-2">
              <FaArrowLeft />
            </button>
            <h2 className="text-2xl font-bold text-pink-900 text-center flex-1">Recover Employee ID</h2>
          </div>
          
          <form 
          onSubmit={Submit} 
          className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pink-800 mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-pink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="Enter your registered email"
                  required
                />
              </div>
            </div>
  
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              Send Recovery Email
            </button>
          </form>
  
          <p className="mt-4 text-sm text-pink-600 text-center">
            We'll send your Employee ID to your registered email address.
          </p>
        </div>
      </div>
    );
  };
  export default ForgotId;
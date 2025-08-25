import { useState, useMemo, useEffect } from 'react';
import { FaCheck, FaTimes, FaEnvelope, FaPaperPlane, FaEye, FaSyncAlt, FaSearch, FaVideo } from 'react-icons/fa';

import LoginPortal from './LoginPortal';
import NewUser from './NewUser';
import ForgotId from './ForgotId';

const DashPortal = ({ 
  inquiryForms = [], 
  checkingStatus, 
  handleSendEmail, 
  setSelectedForm, 
  setShowFormModal, 
  setShowEmailModal, 
  onRefresh,
}) => {
    const [isRefreshing, setIsRefresh] = useState(false);
    const [selectedDraftIndex, setSelectedDraftIndex] = useState(0);
    const [underBarLine, setUnderBarLine] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const [query, setQuery] = useState('');
    const [filteredForms, setFilteredForms] = useState(inquiryForms);

    const [isAutho, setIsAutho] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [showSignup, setShowSignup] = useState(false);
    const [showForgotId, setShowForgotId] = useState(false);

    
    const Login = async (username, password) => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
    
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('employeeId', data.employeeId);
          setIsAutho(true);
        } else {
          alert(data.error || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
      }
    };

    const Signup = async (username, email, password) => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
    
        const data = await response.json();
        
        if (response.ok) {
          alert(data.message || 'Account created successfully! You can now login.');
          setShowSignup(false);
          setShowLogin(true);
        } else {
          alert(data.error || 'Signup failed');
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed');
      }
    };

    const RecoverId = async (email) => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/recover-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
    
        const data = await response.json();
        
        if (response.ok) {
          alert(`Your Employee ID is: ${data.employeeId}`);
          setShowForgotId(false);
          setShowLogin(true);
        } else {
          alert(data.error || 'Email not found in our system');
        }
      } catch (error) {
        console.error('Recovery error:', error);
        alert('Recovery failed');
      }
    };

    useEffect(() => {
        const approvedWithoutDrafts = inquiryForms.filter(
            f => f.status === 'approved' && (!f.emailDrafts || !f.emailDrafts.length)
        ).length;
        
        if (approvedWithoutDrafts > 0) {
            console.warn(`${approvedWithoutDrafts} approved forms missing drafts`);
        }
    }, [inquiryForms]);

    useEffect(() => {
        if (!query.trim()) {
            setFilteredForms(inquiryForms);
        } else {
            const searchTerm = query.toLowerCase().trim();
            const filtered = inquiryForms.filter(form => 
                form.name.toLowerCase().includes(searchTerm) || 
                form.email.toLowerCase().includes(searchTerm)
            );
            setFilteredForms(filtered);
        }
    }, [query, inquiryForms]);

    const newForms = useMemo(() => {
        const current = Date.now(); 
        return inquiryForms.filter(form => {
            const formDate = new Date(form.createdAt);
            return !isNaN(formDate) && current - formDate.getTime() < 3600;
        });
    }, [inquiryForms]);

    if (!isAutho) {
      return (
        <>
          {showLogin && (
            <LoginPortal
              onLogin={Login}
              onToSignup={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              onToForgotId={() => {
                setShowLogin(false);
                setShowForgotId(true);
              }}
            />
          )}
          
          {showSignup && (
            <NewUser
              onSignup={Signup}
              onToLogin={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            />
          )}
          
          {showForgotId && (
            <ForgotId
              onRecoverId={RecoverId}
              onToLogin={() => {
                setShowForgotId(false);
                setShowLogin(true);
              }}
            />
          )}
        </>
      );
    }

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
               
            })
            
    };
    //the db is storing the zoom dates in iso string hence in order for the team to see correct dates under the zoom meeting icon 
    //the dates must be pasrsed to mathc the excepted date the user booked the appointment at. 
    const formatBookingDate = (dateString, timeSlot) => {
      if (!dateString || !timeSlot) return 'No date/time set';
      
      try {
        const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
        
        if (!dateMatch) {
          return 'Invalid date format';
        }
        
        const year = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]) - 1; 
        const day = parseInt(dateMatch[3]);
        
        const date = new Date(Date.UTC(year, month, day));
        
        const formattedDate = date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC"
        });
        
        return `${formattedDate} at ${timeSlot}`;
      } catch (error) {
        console.error('Date formatting error:', error);
        return 'Date format error';
      }
    };
      
    if (!inquiryForms) {
        return (
            <div className="p-4 font-sans text-pink-300 animate-pulse">
                Loading forms...
            </div>
        );
    }

    

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-medium tracking-wide";
        if (status === 'approved') {
            return (
                <span className={`${baseClasses} bg-emerald-500/10 text-emerald-300`}>
                    Approved
                </span>
            );
        } else if (status === 'rejected') {
            return (
                <span className={`${baseClasses} bg-rose-500/10 text-rose-300`}>
                    Rejected
                </span>
            );
        } else if (status === 'booked') {
            return (
                <span className={`${baseClasses} bg-blue-500/10 text-blue-300`}>
                    Booked
                </span>
            );
        } else {
            return (
                <span className={`${baseClasses} bg-amber-500/10 text-amber-300`}>
                    Pending
                </span>
            );
        }
    };

    const handleReviewClick = (form, draftIndex = 0) => {
        if (!form.emailDrafts || !form.emailDrafts[draftIndex]) {
            return;
        }
        setSelectedForm(form);
        setSelectedDraftIndex(draftIndex);
        setShowEmailModal(true);
    };

    const handleStatusChange = async (formId, status) => {
        setProcessingId(formId);
        try {
            await checkingStatus(formId, status);
          
            onRefresh();
            setTimeout(onRefresh, 500);
        } catch (error) {
            console.error("Status change failed:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const changingStatusActions = (form) => {
        if (form.status === 'waiting') {
            let approveButtonClass = "bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full flex items-center text-sm font-medium hover:bg-emerald-500/30 transition-all hover:scale-[1.02] active:scale-95";
            let rejectButtonClass = "bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full flex items-center text-sm font-medium hover:bg-rose-500/30 transition-all hover:scale-[1.02] active:scale-95";
            
            if (processingId === form._id) {
                approveButtonClass += " opacity-50 cursor-not-allowed";
                rejectButtonClass += " opacity-50 cursor-not-allowed";
            }

            let approveButtonText;
            let rejectButtonText;
            
            if (processingId === form._id) {
                approveButtonText = 'Processing...';
                rejectButtonText = 'Processing...';
            } else {
                approveButtonText = 'Approve';
                rejectButtonText = 'Reject';
            }

            return (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleStatusChange(form._id, 'approved')}
                        disabled={processingId === form._id}
                        className={approveButtonClass}
                    >
                        <FaCheck className="mr-1" />
                        {approveButtonText}
                    </button>
                    <button
                        onClick={() => handleStatusChange(form._id, 'rejected')}
                        disabled={processingId === form._id}
                        className={rejectButtonClass}
                    >
                        <FaTimes className="mr-1" />
                        {rejectButtonText}
                    </button>
                </div>
            );
        } else {
            const actionButtons = [];
            
            if (form.emailDrafts && form.emailDrafts.length > 0) {
                actionButtons.push(
                    <button
                        key="review"
                        onClick={() => handleReviewClick(form)}
                        className="bg-pink-600/20 text-pink-300 px-3 py-1 rounded-full flex items-center text-sm font-medium hover:bg-pink-600/30 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <FaEnvelope className="mr-1" /> Review
                    </button>
                );
            }

            if (form.emailDrafts && form.emailDrafts.some(d => !d.sent)) {
                actionButtons.push(
                    <button
                        key="send"
                        onClick={() => handleSendEmail(form._id)}
                        className="bg-pink-400 text-pink-950 px-3 py-1 rounded-full flex items-center text-sm font-medium hover:bg-pink-300 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <FaPaperPlane className="mr-1" /> Send
                    </button>
                );
            }

            return <div className="flex space-x-2">{actionButtons}</div>;
        }
    };

    return (
        <div className="bg-pink-950 p-6 min-h-screen">
            <div className="max-w-7xl mx-auto relative">
                <div className="flex justify-between items-center mb-8">
                    <div 
                        className="relative group"
                        onMouseEnter={() => setUnderBarLine(true)}
                        onMouseLeave={() => setUnderBarLine(false)}
                    >
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 font-sans tracking-tight">
                            Chai&co
                            <span className="text-pink-400">.</span>
                        </h2>
                        {underBarLine && (
                            <div className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-300 w-full"></div>
                        )}
                        {!underBarLine && (
                            <div className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-300 w-0"></div>
                        )}
                        <p className="text-pink-400/70 font-medium mt-1">Client Management Portal</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsRefresh(true);
                            onRefresh();
                            setTimeout(() => setIsRefresh(false), 1000);
                        }}
                        className="flex items-center text-pink-300 hover:text-pink-200 font-medium transition-colors group"
                        disabled={isRefreshing}
                    >
                        {isRefreshing && (
                            <>
                                <FaSyncAlt className="mr-2 animate-spin" />
                                Refreshing...
                            </>
                        )}
                        {!isRefreshing && (
                            <>
                                <FaSyncAlt className="mr-2 transition-transform group-hover:rotate-180" />
                                Refresh
                            </>
                        )}
                    </button>
                </div>

                {/**Search bar */}
                <form onSubmit={handleSearch} className="flex max-w-xl gap-2 mb-6">
                    <div className="relative w-full">
                        
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaSearch className="text-pink-400" />
                        </span>
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name or email..."
                            aria-label="Search"
                            className="w-full rounded-lg px-3 py-2 pl-10 bg-pink-900 border border-pink-800 text-pink-200 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </form>

                <div className="bg-pink-900 border border-pink-900 rounded-xl shadow-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-pink-800">
                        <thead className="bg-pink-900/30">
                            <tr>
                                {['Client', 'Event', 'Status', 'Email Drafts', 'Actions'].map((header) => (
                                    <th 
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-medium text-pink-300 uppercase tracking-wider font-sans"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-800">
                          {(() => {
                            if (filteredForms.length === 0) {
                              return (
                                <tr>
                                  <td colSpan="5" className="px-6 py-8 text-center text-pink-400">
                                    {query ? `No results found for "${query}"` : 'No forms available'}
                                  </td>
                                </tr>
                              );
                            } else {
                              return filteredForms.map((form) => {
                                let isNew = false;
                                for (let i = 0; i < newForms.length; i++) {
                                  if (newForms[i]._id === form._id) {
                                    isNew = true;
                                    break;
                                  }
                                }
                                
                                let rowClasses = "transition-all";
                                
                                if (isNew) {
                                  rowClasses += " bg-pink-600";
                                } else {
                                  rowClasses += " hover:bg-pink-900";
                                }

                                return (
                                  <tr key={form._id} className={rowClasses}>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-pink-950 font-bold">
                                          {form.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-pink-100">
                                            {form.name}
                                          </div>
                                          <div className="text-sm text-pink-300/80">
                                            {form.email}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    
                                
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-pink-100 capitalize">
                                        {form.event.toLowerCase()}
                                      </div>
                                      <div className="text-xs text-pink-400/60">
                                        {new Date(form.createdAt).toLocaleDateString()}
                                      </div>
                                    </td>
                                    
                                
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex flex-col space-y-1">
                                        {getStatusBadge(form.status)}
                                        {form.status === 'approved' && form.accessCode && (
                                          <div className="text-xs bg-pink-800/30 text-pink-300 px-2 py-0.5 rounded">
                                            Code: {form.accessCode}
                                          </div>
                                        )}
                                        {form.status === 'booked' && form.booking && form.booking.zoomLink && (
                                          <div className="mt-2">
                                            <div className="text-xs font-medium text-pink-300 mb-1">Zoom Meeting:</div>
                                            <div className="flex items-center">
                                              <a 
                                                href={form.booking.zoomLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 text-xs flex items-center "
                                              >
                                                <FaVideo className="mr-1" />
                                                Join Meeting
                                              </a>
                                              <button 
                                                onClick={() => copyToClipboard(form.booking.zoomLink)}
                                                className="ml-2 text-pink-400 hover:text-pink-300 text-xs"
                                                title="Copy Zoom link"
                                              >
                                                📋
                                              </button>
                                            </div>
                                            {form.booking.date && form.booking.timeSlot && (
                                              <div className="text-xs text-pink-400/70 mt-1">
                                                {formatBookingDate(form.booking.date, form.booking.timeSlot)}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    
                                
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {form.emailDrafts && form.emailDrafts.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                          {form.emailDrafts.map((draft, index) => {
                                            let buttonClass = "px-2 py-1 rounded-full text-xs font-medium flex items-center transition-all";
                                            
                                            if (draft.sent) {
                                              buttonClass += " bg-pink-800 text-pink-400/70";
                                            } else {
                                              buttonClass += " bg-pink-600 text-pink-300 hover:bg-pink-600/30 hover:scale-[1.03]";
                                            }

                                            return (
                                              <button
                                                key={index}
                                                onClick={() => handleReviewClick(form, index)}
                                                className={buttonClass}
                                              >
                                                <FaEnvelope className="mr-1 text-xs" />
                                                Draft {index + 1}
                                                {draft.sent && ' (Sent)'}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      ) : ( // Fixed this line - changed => to :
                                        <span className="text-pink-500 italic">No drafts</span>
                                      )}
                                    </td>
                                    
                                
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => {
                                            setSelectedForm(form);
                                            setShowFormModal(true);
                                          }}
                                          className="text-pink-300 hover:text-pink-200 text-sm flex items-center  transition-transform"
                                        >
                                          <FaEye className="mr-1" /> View
                                        </button>
                                        {changingStatusActions(form)}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              });
                            }
                          })()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashPortal;
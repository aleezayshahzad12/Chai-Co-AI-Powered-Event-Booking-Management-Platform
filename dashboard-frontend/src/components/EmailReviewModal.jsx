import { useState } from 'react';
import EmailEdits from "./EmailEdits";
import { FaTimes, FaPaperPlane } from 'react-icons/fa';

export default function EmailReviewModal({ selectedForm, onSend, onClose }) {
    const [refresh, setRefresh] = useState(false);
    const [activeDraftIndex, setActiveDraftIndex] = useState(0);

    if (!selectedForm?.emailDrafts || selectedForm.emailDrafts.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-pink-200 shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-pink-900 font-serif">
                            Email Draft Error
                        </h2>
                        <button 
                            onClick={onClose} 
                            className="text-pink-700 hover:text-pink-900 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                    <p className="text-red-500">No email drafts available for this form.</p>
                    <button 
                        onClick={onClose} 
                        className="mt-4 px-4 py-2 bg-pink-100 text-pink-800 rounded-full font-serif hover:bg-pink-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const currentDraft = selectedForm.emailDrafts[activeDraftIndex] || {};
    
    let emailsStatus;
    if (currentDraft.type === 'accepted') {
        emailsStatus = 'Approval Email';
    } else {
        emailsStatus = 'Rejection Email';
    }

    const getDraftStatus = (draft) => {
        if (draft.type === 'accepted') {
            return 'Approval Email';
        } else {
            return 'Rejection Email';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-pink-200 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-pink-900 font-serif">
                        {emailsStatus}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-pink-700 hover:text-pink-900 transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {selectedForm.emailDrafts.length > 1 && (
                    <div className="flex space-x-2 mb-6">
                        {selectedForm.emailDrafts.map((draft, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveDraftIndex(index)}
                                className={`px-4 py-2 rounded-full font-serif text-sm ${
                                    activeDraftIndex === index 
                                        ? 'bg-pink-600 text-white' 
                                        : 'bg-pink-100 text-pink-800 hover:bg-pink-200'
                                }`}
                            >
                                {getDraftStatus(draft)}
                            </button>
                        ))}
                    </div>
                )}

                <EmailEdits 
                    userForm={selectedForm} 
                    draftIndex={activeDraftIndex}
                    makesEdits={() => setRefresh(!refresh)} 
                />

                <div className="flex justify-end space-x-3 mt-6">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full font-serif hover:bg-pink-200 transition-colors"
                    >
                        Cancel
                    </button>
                    {!currentDraft.sent && (
                        <button
                            onClick={() => onSend(activeDraftIndex)}
                            className="px-4 py-2 bg-pink-600 text-white rounded-full font-serif hover:bg-pink-700 transition-colors flex items-center"
                        >
                            <FaPaperPlane className="mr-2" />
                            Send Email
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
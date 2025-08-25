import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';

const EmailEdits = ({ userForm, draftIndex = 0, makesEdits }) => {
    const [emailInfo, setEmailInfo] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [hasDraft, setHasDraft] = useState(false);
//the class ensure the logic of ai emails being parked in the dash paortal and the team ebing able to make any changes to parked emails. 
    useEffect(() => {
        if (userForm.emailDrafts && userForm.emailDrafts[draftIndex]) {
            const draft = userForm.emailDrafts[draftIndex];
            setEmailSubject(draft.subject);
            setEmailInfo(draft.content);
            setHasDraft(true); //ai has parked the email and hence need the review by the team. all fileds are able to be editied. 
        } else {
            setEmailSubject('');
            setEmailInfo('');
            setHasDraft(false);
        }
    }, [userForm, draftIndex]);

    const saveDraft = async () => {
        if (!hasDraft) {
            setSaveMessage('No draft available to save');
            return;
        }

        setIsSaving(true);
        setSaveMessage('');

        //the team must be able to make edits tot the accpetance and rejection emails drafted by ai as these emails are the most important ones. 
        //hence once the changes are made to the ai emails, the draft must be saved. the team will be alreted that the draft needs there attention 
        //as the review flage will be on. 
        
        try {
            const response = await fetch(`http://localhost:3000/api/forms/${userForm._id}/update-draft`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    draftIndex,
                    updates: {
                        subject: emailSubject,
                        content: emailInfo,
                        requiresReview: true 
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            await response.json();
            makesEdits(); //allows the team to make any edits 
            setSaveMessage('Draft saved successfully!');
        } catch (error) {
            console.error('Error saving draft:', error);
            setSaveMessage(`Failed to save draft: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };
//ai hasnt writtent any emails yet and have not be parked for the required review. 
    if (!hasDraft) {
        return (
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                No email draft available for this form. Please approve or reject the form first.
            </div>
        );
    }

    let savingButton;
    if (isSaving) {
        savingButton = 'Saving...';
    } else {
        savingButton = 'Save Draft';
    }
    
    return (
        <div className="space-y-4">
            <div>
                <label className="block font-serif text-pink-800 font-medium mb-2">Subject</label>
                <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent font-serif"
                />
            </div>
            <div>
                <label className="block font-serif text-pink-800 font-medium mb-2">Email Content</label>
                <textarea
                    value={emailInfo}
                    onChange={(e) => setEmailInfo(e.target.value)}
                    className="w-full p-3 border border-pink-200 rounded-lg h-64 focus:ring-2 focus:ring-pink-300 focus:border-transparent font-serif"
                />
            </div>
            <div className="flex justify-between items-center">
                {saveMessage && (
                    <span className={`font-serif ${saveMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                        {saveMessage}
                    </span>
                )}
                <button
                    onClick={saveDraft}
                    disabled={isSaving || !hasDraft}
                    className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full flex items-center font-serif hover:bg-pink-200 transition-colors disabled:opacity-50"
                >
                    <FaSave className="mr-2" />
                    {savingButton}
                </button>
            </div>
        </div>
    );
};

export default EmailEdits;
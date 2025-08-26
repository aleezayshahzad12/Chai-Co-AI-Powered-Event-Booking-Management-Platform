import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import DashPortal from './DashPortal';
import FormDetailModal from "./FormDetailModal";
import EmailReviewModal from "./EmailReviewModal";

const SavedUserForms = ({ setchosenForms, setClicked }) => {
    const [inquiryForms, setInquiryForms] = useState([]);
    const [chosing, setChosing] = useState(true);
    const [selectedForm, setSelectedForm] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [error, setError] = useState(null);

    const fetchInquiryForms = async () => {
        try {
            const response = await fetch('https://chainco-backend.onrender.com/api/userForms');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
            }

            const data = await response.json();
            setInquiryForms(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching forms:', error);
            setError(error.message);
        }
        setChosing(false);
    };

    useEffect(() => {
        let intervalId;

        fetchInquiryForms();
        intervalId = setInterval(fetchInquiryForms, 30000); // 30 seconds

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    const checkingStatus = async (userFormId, responseStatus) => {
        try {
            const response = await fetch(`https://chainco-backend.onrender.com/api/forms/${userFormId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: responseStatus })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const updatedForm = await response.json();

            setInquiryForms(prevForms =>
                prevForms.map(form => {
                    if (form._id === userFormId) {
                        return updatedForm;
                    } else {
                        return form;
                    }
                })
            );

            if (responseStatus === 'approved' || responseStatus === 'rejected') {
                setchosenForms(updatedForm);
                setClicked('email-review-await');
                setSelectedForm(updatedForm);
                setShowEmailModal(true);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            setError(error.message);
        }
    };

    const handleSendEmail = async (formId, draftIndex) => {
        try {
            const response = await fetch(`https://chainco-backend.onrender.com/api/forms/${formId}/send-email`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draftIndex })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            // Refresh the forms list after successful send
            await fetchInquiryForms();
            setShowEmailModal(false);
        } catch (error) {
            console.error('Error sending email:', error);
            setError(error.message);
            alert(`Failed to send email: ${error.message}`);
        }
    }
    const handleRefresh = () => {
        fetchInquiryForms();
    };

    return (
        <>
            <DashPortal
                inquiryForms={inquiryForms}
                checkingStatus={checkingStatus}
                handleSendEmail={handleSendEmail}
                setSelectedForm={setSelectedForm}
                setShowFormModal={setShowFormModal}
                setShowEmailModal={setShowEmailModal}
                onRefresh={handleRefresh}
            />

            {showFormModal && selectedForm && (
                <FormDetailModal
                    selectedForm={selectedForm}
                    onClose={() => setShowFormModal(false)}
                />
            )}

            {showEmailModal && selectedForm && (
                <EmailReviewModal
                    selectedForm={selectedForm}
                    onSend={(draftIndex) => handleSendEmail(selectedForm._id, draftIndex)}
                    onClose={() => setShowEmailModal(false)}
                />
            )}
        </>
    );
};

export default SavedUserForms;
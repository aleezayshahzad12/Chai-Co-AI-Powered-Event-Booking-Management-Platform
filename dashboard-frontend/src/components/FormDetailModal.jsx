export default function FormDetailModal({ selectedForm, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-pink-900 font-serif mb-4">
            {selectedForm.name}'s Event Details
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-pink-800">Contact Information</h3>
              <p>Email: {selectedForm.email}</p>
            </div>
            {/**in order for the team to use the form on there end, the form must be translated as it was sumbitted by the users and must show up on the portal for the team to etiher accept or rejec the forms */}
            <div>
              <h3 className="font-semibold text-pink-800">Event Details</h3>
              <p>Event Type: {selectedForm.event}</p>
              <p>Guest Size: {selectedForm.guestSize}</p>
              <p>Budget: {selectedForm.budget}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-pink-800">Description</h3>
              <p>{selectedForm.briefDescription}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-pink-800">Status</h3>
              <p className="capitalize">{selectedForm.status}</p>
            </div>
            {/**by using createdat and converting them to new york time string, the employees will be able to see the details of the forms the users have 
             * created. this is saving the details of the form on the dashportal in order to communicate the details withn the team aka a reminder */}
            <div>
              <h3 className="font-semibold text-pink-800">Dates</h3>
              <p>Submitted: {new Date(selectedForm.createdAt).toLocaleString()}</p>
              <p>Last Updated: {new Date(selectedForm.updatedAt).toLocaleString()}</p>
              {selectedForm.codeExpixing && (
                <p>Code Expires: {new Date(selectedForm.codeExpixing).toLocaleString()}</p>
              )}
            </div>
            
            {selectedForm.accessCode && (
              <div>
                <h3 className="font-semibold text-pink-800">Access Code</h3>
                <p>{selectedForm.accessCode}</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={onClose} 
            className="mt-6 bg-pink-500 text-white px-4 py-2 rounded-full font-serif hover:bg-pink-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
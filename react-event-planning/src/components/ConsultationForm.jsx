import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";


const ConsultationForm = ({ onClose, onCompleted }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    event: "",
    guestSize: "",
    budget: "",
    briefDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userInput = (i) => {
    const { name, value } = i.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputSubmitation = async (i) => {
    i.preventDefault();

    if (isSubmitting) {
      return;
    } //stopping multiple clicks
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User form successfully submitted");
        onClose();
        if (onCompleted) {
          onCompleted();
        }
      } else {
        alert("User form failed to submit. Please try again");
      }
    } catch (mishap) {
      console.error("Error submitting the form:", mishap);
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorField = (value) => {
    if (value && value.trim() !== "") {
      return "bg-pink-50 border-pink-600";
    }
    return "";
  };

  let buttonSubmission;
  if (isSubmitting) {
    buttonSubmission = (
      <>
        <FaSpinner className="animate-spin" /> Submitting...
      </>
    );
  } else {
    buttonSubmission = "Submit";
  }

  return (
    <form onSubmit={inputSubmitation} className="flex flex-col space-y-4 w-full">
      <div className="text-center w-full">
        <label className="block mb-1 font-bold">Name</label>
        <input
          type="text"
          name="name"
          required
          className={`w-full max-w-xs mx-auto border border-pink-950 px-4 py-2 rounded ${colorField(formData.name)}`}
          value={formData.name}
          onChange={userInput}
        />
      </div>

      <div className="text-center w-full">
        <label className="block mb-1 font-bold">Email</label>
        <input
          type="email"
          name="email"
          required
          className={`w-full max-w-xs mx-auto border px-3 py-2 rounded ${colorField(formData.email)}`}
          value={formData.email}
          onChange={userInput}
        />
      </div>

      <div className="text-center w-full">
        <label className="block mb-1 font-bold">Event</label>
        <input
          type="text"
          name="event"
          required
          className={`w-full max-w-xs mx-auto border px-4 py-2 rounded ${colorField(formData.event)}`}
          value={formData.event}
          onChange={userInput}
        />
      </div>

      <div className="text-center w-full">
        <label className="block mb-1 font-bold">Guest size</label>
        <input
          type="number"
          name="guestSize"
          required
          min="1"
          className={`w-full max-w-xs mx-auto border px-3 py-2 rounded ${colorField(formData.guestSize)}`}
          value={formData.guestSize}
          onChange={userInput}
        />
      </div>

      <div className="text-center w-full">
        <label className="block mb-1 font-bold">Estimated Budget</label>
        <input
          type="text"
          name="budget"
          required
          className={`w-full max-w-xs mx-auto border px-3 py-2 rounded ${colorField(formData.budget)}`}
          value={formData.budget}
          onChange={userInput}
        />
      </div>

      <div className="text-center w-full">
        <label className="block mb-1 font-bold">Brief Description</label>
        <input
          type="text"
          name="briefDescription"
          required
          rows={5}
          className={`w-full max-w-xs mx-auto border h-20 px-3 py-2 rounded placeholder-pink-950 placeholder-opacity-60 ${colorField(formData.briefDescription)}`}
          value={formData.briefDescription}
          onChange={userInput}
          placeholder="Spill the chai on your event"
        />
      </div>

      <div className="text-center w-full">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-pink-900 text-white px-4 py-2 rounded hover:bg-pink-700 mx-auto flex items-center justify-center gap-2"
        >
          {buttonSubmission}
        </button>
      </div>
    </form>
  );
};

export default ConsultationForm;
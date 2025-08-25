import React, { useState } from "react";
import CustomCalendar from "./customCalendar";

const BookingAppointment = ({ accessCode }) => {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async (date, selectedTime) => {
    if (!accessCode) {
      setErrorMsg("No access code provided. Please verify your code first.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (!date) throw new Error("Invalid date selected");
  
      // Get the weekday for the selected date
      const weekday = date.toLocaleDateString("en-US", { 
        weekday: "long", 
        timeZone: "America/New_York" 
      });
  
      const response = await fetch("http://localhost:3000/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessCode: accessCode.trim(),
          date: date.toISOString(),
          time: selectedTime,
          weekday
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Booking failed");

      console.log("Booking response:", data);
      setBookingConfirmed(true);

    } catch (err) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!accessCode) {
    return <div className="p-4 text-center text-pink-900 font-poppins">
      Please verify your access code first to book a consultation.
    </div>;
  }

  if (bookingConfirmed) {
    return <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-poppins text-pink-900 mb-4">Booking Confirmed!</h2>
      <p>We've sent you a confirmation email with your appointment details. Please check your Spam folder</p>
    </div>;
  }

  return (
    <div className="p-2">
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMsg}
        </div>
      )}
      {isLoading && (
        <div className="text-center py-4"><p>Processing your booking...</p></div>
      )}
      <CustomCalendar onSlotSelect={handleBooking} />
    </div>
  );
};

export default BookingAppointment;

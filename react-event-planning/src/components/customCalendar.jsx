import React, { useState, useEffect } from "react";

const weekdaySlots = {
  sunday: ["9:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "1:30 PM", "2:30 PM", "3:30 PM", "4:30 PM"],
  monday: ["9:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "1:30 PM", "2:30 PM", "3:30 PM", "4:30 PM"],
  tuesday: ["9:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "1:30 PM", "2:30 PM", "3:30 PM", "4:30 PM"],
  saturday: ["3:30 PM", "4:30 PM", "5:30 PM", "6:00 PM"],
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CustomCalendar = ({ onSlotSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmTime, setConfirmTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const today = new Date();
  const estOffset = -5 * 60;
  const todayEST = new Date(today.getTime() + (estOffset - today.getTimezoneOffset()) * 60000);
  todayEST.setHours(0, 0, 0, 0);
  //in order for the calender to take out the slots which are already booked, the system must get bookings from the database. 
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('https://chainco-backend.onrender.com/api/bookings');
        const data = await response.json();
        setBookedSlots(data);
      } catch (error) {
        console.log('Could not fetch bookings');
      }
    };
    fetchBookings();
  }, []);

  //this part of the code takes care of the setting up the calender dynamics such as the zones, the taking out past dates. 
  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);

      const dateEST = new Date(date.getTime() + (estOffset - date.getTimezoneOffset()) * 60000);


      if (dateEST < todayEST) {
        continue;
      }

      const weekday = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      if (weekdaySlots[weekday]) {
        dates.push({ date, weekday, dayNumber: day });
      }
    }
    setAvailableDates(dates);
  }, [currentMonth, currentYear]);

  const changeMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);
    setConfirmTime(null);
    setTimeSlots([]);
  };

  const isTimeBooked = (slot) => {
    if (!selectedDate) {
      return false;
    }

    for (let i = 0; i < bookedSlots.length; i++) {
      const booking = bookedSlots[i];
      const bookingDate = new Date(booking.booking.date);

      const selectedDateEST = new Date(selectedDate.date.getTime() + (estOffset - selectedDate.date.getTimezoneOffset()) * 60000);
      const bookingDateEST = new Date(bookingDate.getTime() + (estOffset - bookingDate.getTimezoneOffset()) * 60000);

      if (bookingDateEST.toDateString() === selectedDateEST.toDateString()) {
        if (booking.booking.timeSlot === slot) {
          return true;
        }
      }
    }

    return false;
  };

  const handleDateSelect = (dateObj) => {
    setSelectedDate(dateObj);
    setConfirmTime(null);

    let slots = [];

    //seeting up the customed slots which are giving by the team. 
    if (weekdaySlots[dateObj.weekday]) {
      slots = weekdaySlots[dateObj.weekday];
    } else {
      slots = [];
    }

    const bookedForThisDate = [];
    // in order to stop the system from booking multiple users on a same slot, the code is preventing double bookings 
    for (let i = 0; i < bookedSlots.length; i++) {
      const booking = bookedSlots[i];
      const bookingDate = new Date(booking.booking.date);

      const selectedDateEST = new Date(dateObj.date.getTime() + (estOffset - dateObj.date.getTimezoneOffset()) * 60000);
      const bookingDateEST = new Date(bookingDate.getTime() + (estOffset - bookingDate.getTimezoneOffset()) * 60000);

      if (bookingDateEST.toDateString() === selectedDateEST.toDateString()) {
        bookedForThisDate.push(booking.booking.timeSlot);
      }
    }

    const availableSlots = [];
    //logic: the booked slots can either be grayed out or must be taken out. in order to make the experince better and less consuming and confusing only nonbooked slots will be shown to the user to select
    //once the slots are booked, the are taken away from the calender. 
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      let isBooked = false;

      for (let j = 0; j < bookedForThisDate.length; j++) {
        if (bookedForThisDate[j] === slot) {
          isBooked = true;
          break;
        }
      }

      if (!isBooked) {
        availableSlots.push(slot);
      }
    }

    setTimeSlots(availableSlots);
  };

  const handleConfirmBooking = () => {
    if (selectedDate && confirmTime) {
      onSlotSelect(selectedDate.date, confirmTime);
    }
  };

  const isPastDate = (date) => {
    const dateEST = new Date(date.getTime() + (estOffset - date.getTimezoneOffset()) * 60000);
    return dateEST < todayEST;
  };

  const dateButtonClass = (date) => {
    if (isPastDate(date)) {
      return "p-2 w-12 h-12 flex flex-col items-center justify-center rounded-lg font-bold bg-gray-200 text-gray-400 cursor-not-allowed";
    } else if (selectedDate && selectedDate.date.getTime() === date.getTime()) {
      return "p-2 w-12 h-12 flex flex-col items-center justify-center rounded-lg font-bold transition-all bg-pink-900 text-white shadow-lg";
    } else {
      return "p-2 w-12 h-12 flex flex-col items-center justify-center rounded-lg font-bold transition-all bg-pink-100 hover:bg-pink-200 text-pink-900";
    }
  };

  const timeSlotClass = (slot) => {
    if (isTimeBooked(slot)) {
      return "p-2 rounded text-center font-bold w-full bg-gray-200 text-gray-400 cursor-not-allowed";
    } else if (confirmTime === slot) {
      return "p-2 rounded text-center font-bold w-full bg-pink-900 text-white shadow-lg";
    } else {
      return "p-2 rounded text-center font-bold w-full bg-pink-100 hover:bg-pink-200 text-pink-900";
    }
  };

  const confirmButtonClass = () => {
    if (selectedDate && confirmTime && !isTimeBooked(confirmTime)) {
      return "w-full py-2 rounded font-bold bg-pink-900 text-white hover:bg-pink-800 cursor-pointer";
    } else {
      return "w-full py-2 rounded font-bold bg-gray-300 text-gray-600 cursor-not-allowed";
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button

          onClick={() => changeMonth(-1)}
          className="px-3 py-1 bg-pink-100 hover:bg-pink-200 rounded font-bold text-pink-900"
        >{"<"}</button>
        <h2 className="text-xl font-bold text-pink-900">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-3 py-1 bg-pink-100 hover:bg-pink-200 rounded font-bold text-pink-900"
        >{">"}</button>
      </div> {/**allows the functionality of moving to past/foward months */}

      <div className="grid grid-cols-7 gap-2 mb-4">
        {availableDates.map(({ date, weekday, dayNumber }) => (
          <button
            key={date.toISOString()}
            onClick={() => !isPastDate(date) && handleDateSelect({ date, weekday })}
            className={dateButtonClass(date)}
            disabled={isPastDate(date)}
          >
            <span className="text-xs">{weekday.slice(0, 3)}</span>
            <span className="text-sm">{dayNumber}</span>
          </button>
        ))}
      </div>

      {selectedDate && timeSlots.length > 0 && (
        <div className="bg-pink-50 p-3 rounded-lg mb-3">
          <h3 className="text-lg font-bold text-pink-900 mb-2">
            {selectedDate.date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              timeZone: "America/New_York"
            })}
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {timeSlots.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => !isTimeBooked(slot) && setConfirmTime(slot)}
                className={timeSlotClass(slot)}
                disabled={isTimeBooked(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
          <button
            disabled={!(selectedDate && confirmTime && !isTimeBooked(confirmTime))}
            onClick={handleConfirmBooking}
            className={`${confirmButtonClass()} mt-10`}
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
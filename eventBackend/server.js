
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
  debug: true
});
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userForm = require('./formDB');
const { generateEmailDraft } = require('./aiPrompts');
const sendEmail = require('./emailGenerator');
const axios = require('axios');
const qs = require('qs');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chainco';
const HARDCODED_ACCESS_CODE = "TEST1234";

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


//the access codes are generated randomly and then accessed to the user in the db and will be triggered once the acceptance if hit and ai email triggers. 
const generatingCode = () => Math.floor(10000 + Math.random() * 90000).toString();

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
  },
  name: String,
  email: { type: String, unique: true },
  password: String,
  position: String
});
const Employee = mongoose.model('Employee', employeeSchema);

// Function to generate consistent employee IDs based on name
function generateConsistentEmployeeId(name) {
  let firstTwo;
  if (name) {
    firstTwo = name.substring(0, 2).toLowerCase();
  } else {
    firstTwo = "xx";
  }

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }

  const consistentNumber = Math.abs(hash % 9000) + 1000;
  return firstTwo + consistentNumber;
}

const predefinedEmployeeData = [
  {
    email: "iqra.shahzad87@gmail.com",
    name: "Iqra",
    position: "Manager"
  },
  {
    email: "9217502@gmail.com",
    name: "Amna",
    position: "Manager"
  },
  {
    email: "Aleezay.shahzad12@gmail.com",
    name: "Aleezay",
    position: "Manager"
  },
];

async function initializeEmployees() {
  try {
    const employees = [];

    for (let i = 0; i < predefinedEmployeeData.length; i++) {
      const empData = predefinedEmployeeData[i];

      const employeeId = generateConsistentEmployeeId(empData.name);

      const employee = await Employee.findOne({ email: empData.email });

      if (!employee) {
        const newEmployee = new Employee({
          employeeId,
          email: empData.email,
          name: empData.name,
          position: empData.position
        });
        await newEmployee.save();
        console.log(`Created employee: ${empData.name} with ID: ${employeeId}`);
        employees.push(newEmployee);
      } else {
        if (employee.employeeId !== employeeId) {
          employee.employeeId = employeeId;
          await employee.save();
          console.log(`Updated employee: ${empData.name} with ID: ${employeeId}`);
        }
        employees.push(employee);
      }
    }

    // Log all employees using a for loop
    console.log("EMPLOYEE IDs");
    for (let j = 0; j < employees.length; j++) {
      const emp = employees[j];
      console.log(` ${emp.name} | ${emp.email} | ${emp.employeeId}`);
    }

    return employees;
  } catch (error) {
    throw error;
  }
}

// Connect to MongoDB and initialize employees
let predefinedEmployees = [];

mongoose.connect(mongoURI)
  .then(async function () {
    console.log('MongoDB connected');
    predefinedEmployees = await initializeEmployees();
  })
  .catch(function (err) {
    console.log(err);
  });

async function createZoomLinks(meetingTopic) {
  try {
    const authString = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(
      'https://zoom.us/oauth/token',
      qs.stringify({
        grant_type: 'account_credentials',
        account_id: process.env.ZOOM_ACCOUNT_ID
      }),
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = response.data.access_token;

    const meetingResponse = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: meetingTopic || 'Consultation Meeting',
        type: 2,
        start_time: new Date().toISOString(),
        duration: 60,
        timezone: 'UTC',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          approval_type: 0,
          audio: 'both'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return meetingResponse.data.join_url;
  } catch (error) {
    console.error('Zoom meeting creation failed:', error.response?.data || error.message);
    throw new Error('Failed to create Zoom meeting');
  }
}




app.post('/api/form', async (req, res) => {
  try {
    const request = req.body;
    const newuserForm = new userForm(request);
    await newuserForm.save();

    const clientEmail = await generateEmailDraft(request, 'initial');
    const teamEmail = await generateEmailDraft(request, 'teamNotification');

    await sendEmail(request.email, clientEmail.subject, clientEmail.body);
    await sendEmail(process.env.TEAM_EMAILS, teamEmail.subject, teamEmail.body);

    res.status(201).json({ message: 'Initial inquiry submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Inquiry was not saved in the database' });
  }
});

// Get all forms
app.get('/api/userForms', async (req, res) => {
  try {
    const forms = await userForm.find().sort({ createdAt: 1 });
    res.json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch forms', details: error.message });
  }
});

app.put('/api/forms/:id', async (req, res) => {
  try {
    console.log("acceptance");
    const { status } = req.body;
    const form = await userForm.findById(req.params.id);

    if (!form) {
      console.log("Form not found");
      return res.status(404).json({ error: 'Form not found' });
    }

    form.status = status;
    console.log(`cilent status ${status}`);

    if (status === 'approved') {
      form.accessCode = generatingCode();
      form.codeExpixing = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      console.log(`access code: ${form.accessCode}`);
    }

    if (status === 'approved' || status === 'rejected') {
      console.log(" email draft: ");
      try {
        const draft = await generateEmailDraft(form.toObject(), status);
        console.log("draft made:", draft);

        form.emailDrafts = form.emailDrafts || [];

        const checkingExist = (status) => {
          if (status === 'approved') {
            return 'accepted';
          } else {
            return 'rejected';
          }
        };
        const existingDraftIndex = form.emailDrafts.findIndex(
          d => d.type === checkingExist(status)
        );

        if (existingDraftIndex >= 0) {
          form.emailDrafts[existingDraftIndex] = {
            ...form.emailDrafts[existingDraftIndex],
            subject: draft.subject,
            content: draft.body,
            requiresReview: true,
            updatedAt: new Date()
          };
        } else {
          let draftChecking;
          if (status === 'approved') {
            draftChecking = 'accepted';
          } else {
            draftChecking = 'rejected';
          }
          form.emailDrafts.push({
            type: draftChecking,
            subject: draft.subject,
            content: draft.body,
            requiresReview: true,
            sent: false,
            createdAt: new Date()
          });
        }
        console.log("draft added to form");
      } catch (draftError) {
        console.error("draft was failed:", draftError);
        throw new Error("failed to make email draft");
      }
    }

    const savedForm = await form.save();
    console.log("form saved successfully");
    res.json(savedForm);

  } catch (error) {
    console.error("was not accepted", error);
    res.status(500).json({
      error: 'update failed',
      details: error.message
    });
  }
});

app.put('/api/forms/:id/update-draft', async (req, res) => {
  try {
    const { draftIndex, updates } = req.body;
    const form = await userForm.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ error: 'form not found' });
    }
    if (!form.emailDrafts || !form.emailDrafts[draftIndex]) {
      return res.status(400).json({ error: 'invalid draft' });
    }
    //changes were only made to the provided format
    if (updates.subject !== undefined) {
      form.emailDrafts[draftIndex].subject = updates.subject;
    }
    if (updates.content !== undefined) {
      form.emailDrafts[draftIndex].content = updates.content;
    }
    if (updates.requiresReview !== undefined) {
      form.emailDrafts[draftIndex].requiresReview = updates.requiresReview;
    }

    form.markModified('emailDrafts'); // This tells mongoose that the array was modified

    await form.save();
    res.json(form);
  } catch (error) {
    console.error('Error updating draft:', error);
    res.status(500).json({ error: 'Failed to update draft', details: error.message });
  }
});

//this is the backend route which will help verify the access code the user trys to put. once the code has been used to book appoinmnet
//user must not be able to use the same code to enter the portal and double appoinment. 
app.get('/api/validate-code/:code', async (req, res) => {
  try {
    const code = req.params.code.trim();
    if (code === HARDCODED_ACCESS_CODE) return res.json({ valid: true, debug: 'Used hardcoded test code' });

    const form = await userForm.findOne({
      accessCode: code,
      codeExpixing: { $gt: new Date() }
    });

    let response;
    if (form) { //this checks if the code was used to book, if yes then the code must be invalid. 
      if (form.status === 'booked') {
        response = {
          valid: false,
          debug: 'access code already used'
        };
      } else {
        response = {
          valid: true,
          debug: 'booking not made'
        };
      }
    } else {
      response = {
        valid: false,
        debug: 'invalid or expired code'
      };
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'code validation failed', details: error.message });
  }
});


app.put('/api/forms/:id/send-email', async (req, res) => {
  try {
    const { draftIndex } = req.body;
    const form = await userForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const draft = form.emailDrafts?.[draftIndex];
    if (!draft) {
      return res.status(400).json({ error: 'Draft not found' });
    }

    if (draft.sent) {
      return res.status(400).json({ error: 'Email already sent' });
    }

    await sendEmail(form.email, draft.subject, draft.content);

    draft.sent = true;
    draft.requiresReview = false;
    await form.save();

    res.json({ message: 'Email sent successfully', form });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/book-appointment', async (req, res) => {
  try {
    let { accessCode, date, time, weekday } = req.body;
    accessCode = accessCode.trim();

    console.log('Booking request:', { accessCode, date, time, weekday });

    if (!accessCode || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (accessCode === HARDCODED_ACCESS_CODE) {
      return res.json({
        success: true,
        message: 'Booking confirmed! (Test code)',
        booking: { date, time, weekday: weekday || 'weekday-not-specified' }
      });
    }

    //in order to have correct date for the booking, the system is giving date string in iso, hence the string must be parsed into est
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const estDateString = appointmentDate.toLocaleDateString('en-CA', {
      timeZone: 'America/New_York'
    });

    console.log('EST Date String:', estDateString);

    //there should not be any double booking therefore, teh system must check if the user is trying to book a slot which is already booked by another cilent.
    const existingBooking = await userForm.findOne({
      'booking.date': estDateString,
      'booking.timeSlot': time,
      status: 'booked'
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'This time slot is already booked. Please choose another time.' });
    }

    const alreadyBooked = await userForm.findOne({
      accessCode: accessCode,
      status: 'booked'
    });

    if (alreadyBooked) {
      return res.status(400).json({ error: 'This access code has already been used to book an appointment' });
    }

    const form = await userForm.findOneAndUpdate({
      accessCode: accessCode,
      codeExpixing: { $gt: new Date() },
      status: { $ne: 'booked' }
    }, {
      $set: {
        'booking.date': estDateString,
        'booking.timeSlot': time,
        status: 'booked'
      }
    }, { new: true });

    if (!form) {
      return res.status(404).json({ error: 'Invalid, expired access code, or code already used' });
    }

    //this line of code is for creating zoom links 
    let zoomLink;
    try {
      zoomLink = await createZoomLinks(`Consultation with ${form.name}`);
      form.booking.zoomLink = zoomLink;
      await form.save();
    } catch (zoomError) {
      console.error('Zoom creation failed, but booking still saved:', zoomError);
      // Continue without zoom link
    }


    //parsing of the string in order to mathc the timezones of iso string 
    const timeParts = time.match(/(\d+):(\d+) (AM|PM)/i);
    if (!timeParts) {
      throw new Error('Invalid time format');
    }

    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const period = timeParts[3].toUpperCase();

    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const estDateTime = new Date(appointmentDate);
    estDateTime.setHours(hours, minutes, 0, 0);

    const formattedDate = estDateTime.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York"
    });

    // Send confirmation email
    try {
      const email = await generateEmailDraft({
        name: form.name,
        bookedDate: formattedDate,
        bookedTime: time,
        zoomLink: zoomLink || 'Zoom link will be provided separately'
      }, 'bookingConfirmation');

      await sendEmail(form.email, email.subject, email.body);
    } catch (emailError) {
      console.error('Email sending failed, but booking still saved:', emailError);
    }

    res.json({
      success: true,
      message: 'Booking confirmed!',
      booking: {
        date: estDateString,
        time,
        weekday: weekday || 'weekday-not-specified',
        zoomLink
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }

  console.log('est Date String being stored:', estDateString);
  console.log('time slot being stored:', time);
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await userForm.find({
      status: 'booked',
      'booking.date': { $exists: true }
    }).select('name email booking.date booking.timeSlot booking.zoomLink');

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});


app.get('/api/team-bookings', async (req, res) => {
  try {
    const bookings = await userForm.find({
      status: 'booked',
      'booking.date': { $exists: true },
      'booking.zoomLink': { $exists: true, $ne: null }
    }).select('name email booking.date booking.timeSlot booking.zoomLink');

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch team bookings' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    console.log('Signup attempt:', { username, email });

    const employee = await Employee.findOne({
      employeeId: username,
      email: email
    });

    if (!employee) {
      return res.status(400).json({ error: 'Invalid employee ID or email' });
    }

    if (employee.password) {
      return res.status(400).json({ error: 'Employee already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    employee.password = hashedPassword;
    await employee.save();

    res.json({ message: 'Password created successfully! You can now login.' });
  } catch (error) {
    console.error('signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const employee = await Employee.findOne({ employeeId: username });
    if (!employee) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!employee.password) {
      return res.status(400).json({ error: 'Please complete your registration first' });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { employeeId: employee.employeeId, email: employee.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      employeeId: employee.employeeId,
      name: employee.name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/recover-id', async (req, res) => {
  try {
    const { email } = req.body;

    const employee = await Employee.findOne({ email: email });
    if (!employee) {
      return res.status(404).json({ error: 'Email not found in our system' });
    }

    res.json({
      employeeId: employee.employeeId,
      message: 'Employee ID sent successfully'
    });
  } catch (error) {
    console.error('Recovery error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
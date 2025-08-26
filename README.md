# Chai-Co-AI-Powered-Event-Booking-Management-Platform
This project is a full-stack event inquiry and booking system designed to streamline client communication and internal team workflows. It integrates AI-generated email drafting with a human-in-the-loop review process, ensuring efficiency without losing personalization.

## 📋 Key Features

💡 AI Email Generation: Context-aware email drafting for different scenarios

💡 Access Code System: Secure, one-time codes for appointment booking

💡 Real-time Availability: Prevents double-booking and manages time slots

💡 Email Review System: Human oversight before sending communications

💡 Automated Zoom Integration: Creates meeting links for confirmed appointments

💡 Employee Authentication: Secure internal dashboard access

💡 Status Tracking: Full lifecycle management from inquiry to booking



## 🌟 Project Overview

Unlike generic booking platforms, Chai & Co was built to streamline the booking process for both clients and the team, while preserving a personalized, high-end experience.

👥 Client Experience

1. Clients browse the company’s past work and submit a short inquiry form (name, contact, guest size, event details).

2. All communication shifts to email for a seamless experience.

3. Accepted clients receive a custom access code that unlocks a scheduling modal — allowing them to directly book consultations based on both client and team availability.

4. Booking confirmation emails include a unique Zoom link, so clients simply click to join on the day of their consultation.

5. This process creates an exclusive club feel — clients know their ideas are being taken seriously, not lost in generic event planning.

🛠 Team Workflow

1. Instead of juggling Instagram DMs, emails, and texts, the team manages all inquiries through a central dashboard.

2. Inquiry forms automatically sync to the dashboard, where the team can filter, accept, or reject clients.

3. With one click, the system generates AI-written draft emails (acceptance or rejection).

      . Drafts include custom access codes.

      . Drafts are parked in the dashboard until reviewed, personalized, and approved for sending.

      . All drafts remain saved and editable until finalized.

4. Rejection emails follow the same workflow, ensuring consistency.

5. Client statuses (Pending, Accepted, Rejected, Booked) are tracked live in the dashboard.

6. Once a client books, their status updates to “Booked,” and the dashboard logs their unique Zoom link and appointment time.

➡️ This system reduces manual back-and-forth by up to 80% while still delivering a luxury, client-first experience.


## 🚀 Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Auth & Security:** JWT, bcryptjs  
- **Frontend:** React, Vite

  ## 🔌 APIs & Services
- OpenAI API – AI-powered email generation  
- Zoom API – Meeting creation/management  
- SendGrid / Nodemailer – Email delivery


  ## 🛠 Development Tools
- dotenv – Environment variable management  
- CORS – Cross-origin resource sharing  
- Axios – HTTP client


##🏗️ Architecture
The platform follows a RESTful API architecture with:
      . React Frontend: Responsive client-facing interface and admin dashboard
      . Express Backend: Robust API handling business logic and integrations
      . MongoDB Database: Scalable data storage for inquiries, users, and bookings
      . Third-party Integrations: Seamless connections with email and video services

## 🔧 Installation & Setup
# Clone the repository
git clone https://github.com/your-username/Chai-Co-AI-Powered-Event-Booking-Management-Platform.git
cd Chai-Co-AI-Powered-Event-Booking-Management-Platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure your API keys and database URI

# Start development servers
npm run dev  # Frontend (Vite)
npm run server  # Backend (Node.js)

##📁 Environment Variables
Create a .env file with:

env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_ACCOUNT_ID=your_zoom_account_id
SENDGRID_API_KEY=your_sendgrid_api_key
TEAM_EMAILS=team@example.com
PORT=3000

##📄 License
This project is proprietary and maintained by Chai & Co.

##🏆 Acknowledgments
OpenAI for powerful language model capabilities

Zoom for seamless video meeting integration

SendGrid for reliable email delivery services

MongoDB for robust data storage solutions










# Chai-Co-AI-Powered-Event-Booking-Management-Platform
This project is a full-stack event inquiry and booking system designed to streamline client communication and internal team workflows. It integrates AI-generated email drafting with a human-in-the-loop review process, ensuring efficiency without losing personalization.

## 📑 Table of Contents
- [Key Features](#-key-features)  
- [Project Overview](#-project-overview)  
- [Client Experience](#-client-experience)  
- [Team Workflow](#-team-workflow)  
- [Tech Stack](#-tech-stack)  
- [Setup](#-installation--setup)  


## 📋 Key Features

- **AI-Powered Email Drafting – Generates context-aware acceptance/rejection emails, parked in the dashboard for review and personalization.
- **Custom Access Codes – Secure, one-time codes unlock the scheduling modal for consultations.
- **Real-Time Scheduling – Clients book based on shared availability, preventing double-booking.
- **Automated Zoom Integration – Confirmation emails include unique Zoom links for consultations.
- **Client Lifecycle Tracking – Dashboard tracks every stage: Pending → Accepted/Rejected → Booked.
- **Employee Authentication – Secure internal access for team members only.


## 🌟 Project Overview

Unlike generic booking platforms, Chai & Co is a full-stack system that streamline the booking process for both clients and the team, while preserving a personalized, high-end experience.

## 👥 Client Experience

- **Browse past work and submit a short inquiry form (name, contact, guest size, event details).

- **All further communication happens via email for simplicity.

- **Accepted clients receive a custom access code to unlock a scheduling modal, booking directly from shared availability.

- **Booking confirmation emails include a unique Zoom link for their consultation.

- **Clients feel valued and exclusive, knowing their ideas are prioritized over generic event templates.

## 🛠 Team Workflow

- **Manage all inquiries through a central dashboard instead of scattered emails/DMs.

- **Inquiry forms sync automatically, allowing quick accept/reject decisions.

- **One-click triggers AI-generated draft emails (acceptance or rejection), including access codes when relevant.

- **Drafts are saved and editable in the dashboard until approved and sent.

- **Client statuses (Pending, Accepted, Rejected, Booked) update live, keeping the team aligned.

- **Booked clients’ Zoom links and appointment times are automatically logged in the dashboard.

➡️ This system reduces manual back-and-forth by up to 80% while still delivering a luxury, client-first experience.


## 🚀 Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Auth & Security:** JWT, bcryptjs  
- **Frontend:** React, Vite, Tailwind CSS

  ## 🔌 APIs & Services
- OpenAI API – AI-powered email generation  
- Zoom API – Meeting creation/management  
- SendGrid / Nodemailer – Email delivery


  ## 🛠 Development Tools
- dotenv: Environment variable management  
- CORS: Cross-origin resource sharing  
- Axios: HTTP client
- deployment: Railway and Netlify


## 🏗️ Architecture  
The platform follows a RESTful API architecture with:  
- **React Frontend**: Responsive client interface + admin dashboard  
- **Express Backend**: Handles business logic & integrations  
- **MongoDB Database**: Stores inquiries, users, and bookings  
- **Third-party Integrations**: Email + video services  


## 🔧 Installation & Setup
```bash
# 1) Clone the repository
git clone https://github.com/your-username/Chai-Co-AI-Powered-Event-Booking-Management-Platform.git
cd Chai-Co-AI-Powered-Event-Booking-Management-Platform

# 2) Install dependencies
npm install

# 3) Set up environment variables
cp .env.example .env
 Configure your API keys and database URI

# 4)  Start development servers
npm run dev  # Frontend (Vite)
npm run server  # Backend (Node.js)
```

## 📁 Environment Variables
Create a .env file with:
```bash
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
```

## 📄 License
This project is proprietary and maintained by Chai & Co.

## 🏆 Acknowledgments
OpenAI for powerful language model capabilities

Zoom for seamless video meeting integration

SendGrid for reliable email delivery services

MongoDB for robust data storage solutions










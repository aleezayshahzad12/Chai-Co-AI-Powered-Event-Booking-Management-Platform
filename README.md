## Chai-Co-AI-Powered-Event-Booking-Management-Platform
This project is a full-stack event inquiry and booking system designed to streamline client communication and internal team workflows. It integrates AI-generated email drafting with a human-in-the-loop review process, ensuring efficiency without losing personalization.

## 🌵How it solves the Pain?

While keeping in mind the struggles of small business owners, where companies often lack optimized systems and end up juggling dozens of client emails, scheduling conflicts, and scattered approvals across platforms like social media, messaging apps, and third-party tools, Chai & Co was built with the intention of eliminating this friction. By combining AI-assisted communication, real-time scheduling, and seamless team collaboration into one system, Chai & Co delivers faster decisions, reduces frustrating back-and-forth communication, minimizes errors, and ensures a luxury-level client experience.

## 📑 Table of Contents
- [📋 Key Features](#-key-features)  
- [🚀 Why This Project Stands Out](#-project-overview)  
- [📌 Client Experience](#-client-experience)  
- [🛠 Team Workflow](#-team-workflow)  
- [🚀 Tech Stack](#-tech-stack)
- [🚀 🏗️ Architecture ](#-architecture)  
- [🔧Setup](#-installation--setup)  


## 📋 Key Features

- **AI-Powered Email Drafting** – Generates context-aware acceptance/rejection emails, parked in the dashboard for review and personalization.
- **Custom Access Codes** – Adds a layer of exclusivity and security by generating one-time codes for approved clients to schedule consultations.
- **Real-Time Scheduling** – Clients book based on shared availability, preventing double-booking.
- **Automated Zoom Integration** – Confirmation emails include unique Zoom links for consultations.
- **Client Lifecycle Tracking** – Dashboard tracks every stage: Pending → Accepted/Rejected → Booked.
- **Employee Authentication** – Secure internal access for team members only.


## 📌 Client Experience

- **Event Inquiry Form** – Clients submit booking requests via the website.

- **Instant Confirmation** - AI sends a personalized confirmation email.

- **Unique Access Code** – Every booking is paired with a secure event code

- **Booking confirmation emails include a unique Zoom link** for their consultation.


## 🛠 Team Workflow

- **Central Dashboard** - Team views incoming event requests.

- **Inquiry forms sync automatically** allowing quick accept/reject decisions.
- **One-click triggers AI-generated draft emails:**
    - **✅ Accepted** - AI drafts an email with an access code → team edits → sends.
    - **❌ Rejected** - AI drafts a polite decline email → team edits → sends.
- **Client statuses (Pending → Accepted → Rejected → Booked) update live** keeping the team aligned.
- **Drafts are saved and editable** in the dashboard until approved and sent.
- **Booked clients’ Zoom links and appointment times are automatically logged** in the dashboard.

➡️ This system reduces manual back-and-forth by up to **80%** while still delivering a luxury, client-first experience.


## 🚀 Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Auth & Security:** JWT, bcryptjs  
- **Frontend:** React, Vite, Tailwind CSS

  ## 🔌 APIs & Services
- **OpenAI API:** AI-powered email generation  
- **Zoom API:** Meeting creation/management  
- **SendGrid / Nodemailer:** Email delivery


  ## 🛠 Development Tools
- **dotenv:** Environment variable management  
- **CORS:** Cross-origin resource sharing  
- **Axios:** HTTP client
- **Deployment:** Railway and Netlify

## 🚀 Why This Project Stands Out
- deployed for a real event company based in New York City. 
- Human-in-the-loop AI workflows (balancing automation with personalization).
- End-to-end lifecycle management (inquiry → decision → booking → consultation).
- Real-world integrations (Zoom, SendGrid, OpenAI) instead of mock APIs.
- Designed with scalability and team collaboration in mind.


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










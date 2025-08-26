## Chai-Co-AI-Powered-Event-Booking-Management-Platform

**Full-stack, AI-integrated event inquiry and booking system** designed for luxury client experiences and optimized team workflows.

**🚀 Impact:** Reduces manual back-and-forth by **80%**, prevents scheduling conflicts, and delivers a **luxury client experience**.



## 🌟 Why This Project Stands Out

- **AI + Human-in-the-Loop:** Automatically drafts context-aware acceptance/rejection emails while letting the team personalize them.  
- **Real-World Integrations:** Zoom API, SendGrid/Nodemailer, OpenAI API—**no mock data**.  
- **End-to-End Workflow Management:** Tracks inquiries from Pending → Accepted/Rejected → Booked, with live updates.
- **Security & Access Control:** Employee authentication and custom access codes ensure secure management of bookings.   
- **Production-Ready:** Fully deployable on Railway (backend) + Netlify (frontend).
- **Designed and deployed** for a real event company in New York City. 
  
## 🛠 Tech Stack
- **Frontend:** React + Vite + Tailwind CSS (responsive UI + admin dashboard)  
- **Backend:** Node.js + Express.js (RESTful API with secure business logic)  
- **Database:** MongoDB + Mongoose  
- **Authentication & Security:** JWT, bcryptjs  
- **Integrations:** OpenAI (AI email generation), Zoom (consultation scheduling), SendGrid/Nodemailer (email delivery)  
- **Deployment:** Railway + Netlify  

## ⚡ Key Features
- **AI-Powered Email Drafting** – Generates context-aware acceptance/rejection emails, parked in the dashboard for review and personalization.
- **Custom Access Codes** – Adds a layer of exclusivity and security by generating one-time codes for approved clients to schedule consultations.
- **Real-Time Scheduling** – Clients book based on shared availability, preventing double-booking.
- **Automated Zoom Integration** – Confirmation emails include unique Zoom links for consultations.
- **Client Lifecycle Tracking** – Dashboard tracks every stage: Pending → Accepted/Rejected → Booked.
- **Employee Authentication** – Secure internal access for team members only.


### 📌 Client Experience

- **Event Inquiry Form** – Clients submit booking requests via the website.

- **Instant Confirmation** - AI sends a personalized confirmation email.

- **Unique Access Code** – Every booking is paired with a secure event code

- **Booking confirmation emails include a unique Zoom link** for their consultation.


### 🛠 Team Workflow

- **Central Dashboard** - Team views incoming event requests.

- **Inquiry forms sync automatically** allowing quick accept/reject decisions.
- **One-click triggers AI-generated draft emails:**
    - **✅ Accepted** - AI drafts an email with an access code → team edits → sends.
    - **❌ Rejected** - AI drafts a polite decline email → team edits → sends.
- **Client statuses (Pending → Accepted → Rejected → Booked) update live** keeping the team aligned.
- **Drafts are saved and editable** in the dashboard until approved and sent.
- **Booked clients’ Zoom links and appointment times are automatically logged** in the dashboard.

### 🤖 AI & Automation
- **Human-in-the-loop AI emails:** Balances automation with personalization.  
- Context-aware acceptance/rejection messages save time and reduce errors.  




  ## 🔌 APIs & Services
- **OpenAI API:** AI-powered email generation  
- **Zoom API:** Meeting creation/management  
- **SendGrid / Nodemailer:** Email delivery


  ## 🛠 Development Tools
- **dotenv:** Environment variable management  
- **CORS:** Cross-origin resource sharing  
- **Axios:** HTTP client
- **Deployment:** Railway and Netlify


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










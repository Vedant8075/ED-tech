# 🎓 StudyNotion - Full Stack EdTech Platform

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern **MERN Stack EdTech platform** that enables students to discover and purchase courses while empowering instructors to create, manage, and monetize educational content.

</div>

---

# 📑 Table of Contents

- Overview
- Features
- Tech Stack
- System Architecture
- Folder Structure
- User Roles
- Authentication Flow
- Frontend
- Backend
- Database Schema
- API Overview
- Installation
- Environment Variables
- Running the Project
- Screenshots
- Future Improvements
- Author

---

# 📖 Overview

StudyNotion is a full-stack Learning Management System (LMS) built using the MERN stack.

The platform provides a complete ecosystem where:

- Students can browse, purchase, and learn from courses.
- Instructors can publish and manage their own courses.
- Secure authentication protects user accounts.
- Integrated online payments enable course purchases.
- Reviews and ratings help maintain course quality.

The project follows modern web development practices using React, Express, MongoDB, JWT Authentication, Cloudinary, Razorpay, and REST APIs.

---

# ✨ Features

## 👨‍🎓 Student

- User Registration & Login
- Email Verification (OTP)
- Password Reset
- Browse Courses
- Search Courses
- Purchase Courses
- Razorpay Payment Integration
- Watch Course Videos
- Track Learning Progress
- Add Reviews & Ratings
- Edit Profile
- Upload Profile Picture

---

## 👨‍🏫 Instructor

- Instructor Dashboard
- Create Courses
- Upload Course Thumbnail
- Create Sections
- Upload Lecture Videos
- Manage Course Content
- Publish / Edit Courses
- View Course Analytics

---

## 🔐 Authentication

- JWT Authentication
- Protected Routes
- OTP Email Verification
- Forgot Password
- Reset Password
- Secure Password Hashing (bcrypt)

---

## ⭐ Reviews & Ratings

- Add Review
- Course Rating System
- Display Average Ratings

---

## 💳 Payments

- Razorpay Integration
- Secure Checkout
- Payment Verification
- Enrollment after Successful Payment
- Payment Success Email

---

## 📧 Email Notifications

Automatic emails for

- Email Verification
- Password Reset
- Contact Form
- Course Enrollment
- Payment Success

---

# 🛠 Tech Stack

## Frontend

- React 19
- React Router DOM
- Redux
- React Hook Form
- Axios
- React Hot Toast
- Tailwind CSS
- React Markdown
- React Icons
- Swiper.js
- Dropzone

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Cloudinary
- Razorpay
- Nodemailer
- Cookie Parser
- Express File Upload

---

## Database

- MongoDB Atlas

---

## Deployment

Frontend

- Vercel / Netlify

Backend

- Render / Railway

Database

- MongoDB Atlas

Media Storage

- Cloudinary

---

# 🏗 System Architecture

```
                    +----------------+
                    |    React App   |
                    +-------+--------+
                            |
                            |
                     REST APIs (Axios)
                            |
                +-----------v-----------+
                |      Express API      |
                +-----------+-----------+
                            |
      +---------------------+----------------------+
      |                     |                      |
      |                     |                      |
MongoDB Atlas         Cloudinary            Razorpay
(Database)          (Media Storage)       (Payments)
```

---

# 📂 Project Structure

```text
Directory structure:
└── vedant8075-ed-tech/
    ├── README.md
    ├── backend/
    │   ├── index.js
    │   ├── package.json
    │   ├── config/
    │   │   ├── cloudinary.js
    │   │   ├── database.js
    │   │   └── razorpay.js
    │   ├── controllers/
    │   │   ├── Auth.js
    │   │   ├── Category.js
    │   │   ├── ContactUs.js
    │   │   ├── Course.js
    │   │   ├── courseProgress.js
    │   │   ├── Payment.js
    │   │   ├── Profile.js
    │   │   ├── RatingAndReviews.js
    │   │   ├── ResetPassword.js
    │   │   ├── Section.js
    │   │   └── SubSection.js
    │   ├── mail/
    │   │   ├── contactFormRes.js
    │   │   ├── courseEnrollmentEmail.js
    │   │   ├── emailVerification.js
    │   │   ├── passwordUpdate.js
    │   │   └── paymentSuccessEmail.js
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── models/
    │   │   ├── Category.js
    │   │   ├── Course.js
    │   │   ├── CourseProgress.js
    │   │   ├── OTP.js
    │   │   ├── Profile.js
    │   │   ├── RatingAndReviews.js
    │   │   ├── Section.js
    │   │   ├── SubSection.js
    │   │   ├── Tags.js
    │   │   └── User.js
    │   ├── routes/
    │   │   ├── Contact.js
    │   │   ├── Course.js
    │   │   ├── Payments.js
    │   │   ├── profile.js
    │   │   └── user.js
    │   └── utils/
    │       ├── imageUploader.js
    │       ├── mailSender.js
    │       └── secToDuration.js
    └── frontend/
        ├── README.md
        ├── eslint.config.js
        ├── index.html
        ├── package.json
        ├── prettier.config.js
        ├── vite.config.js
        ├── .editorconfig
        ├── .npmrc
        └── src/
            ├── App.css
            ├── App.jsx
            ├── main.jsx
            ├── assets/
            │   └── Images/
            │       ├── aboutus1.webp
            │       ├── aboutus2.webp
            │       ├── aboutus3.webp
            │       ├── login.webp
            │       └── signup.webp
            ├── components/
            │   ├── Common/
            │   │   ├── ConfirmationModal.jsx
            │   │   ├── Footer.jsx
            │   │   ├── IconBtn.jsx
            │   │   ├── Navbar.jsx
            │   │   ├── RatingStars.jsx
            │   │   ├── ReviewSlider.jsx
            │   │   └── Tab.jsx
            │   ├── ContactPage/
            │   │   ├── ContactDetails.jsx
            │   │   ├── ContactForm.jsx
            │   │   └── ContactUsForm.jsx
            │   └── core/
            │       ├── AboutPage/
            │       │   ├── ContactFormSection.jsx
            │       │   ├── LearningGrid.jsx
            │       │   ├── Quote.jsx
            │       │   └── Stats.jsx
            │       ├── Auth/
            │       │   ├── LoginForm.jsx
            │       │   ├── OpenRoute.jsx
            │       │   ├── PrivateRoute.jsx
            │       │   ├── ProfileDropdown.jsx
            │       │   ├── SignupForm.jsx
            │       │   └── Template.jsx
            │       ├── Catalog/
            │       │   ├── Course_Card.jsx
            │       │   └── Course_Slider.jsx
            │       ├── Course/
            │       │   ├── CourseAccordionBar.jsx
            │       │   ├── CourseDetailsCard.jsx
            │       │   └── CourseSubSectionAccordion.jsx
            │       ├── Dashboard/
            │       │   ├── EnrolledCourses.jsx
            │       │   ├── MyCourses.jsx
            │       │   ├── MyProfile.jsx
            │       │   ├── Sidebar.jsx
            │       │   ├── SidebarLink.jsx
            │       │   ├── AddCourse/
            │       │   │   ├── index.jsx
            │       │   │   ├── RenderSteps.jsx
            │       │   │   ├── Upload.jsx
            │       │   │   ├── CourseBuilder/
            │       │   │   │   ├── CourseBuilderForm.jsx
            │       │   │   │   ├── NestedView.jsx
            │       │   │   │   └── SubSectionModal.jsx
            │       │   │   ├── CourseInformation/
            │       │   │   │   ├── ChipInput.jsx
            │       │   │   │   ├── CourseInformationForm.jsx
            │       │   │   │   └── RequirementsField.jsx
            │       │   │   └── PublishCourse/
            │       │   │       └── index.jsx
            │       │   ├── Cart/
            │       │   │   ├── index.jsx
            │       │   │   ├── RenderCartCourses.jsx
            │       │   │   └── ResetTotalAmount.jsx
            │       │   ├── EditCourse/
            │       │   │   └── index.jsx
            │       │   ├── InstructorCourses/
            │       │   │   └── CoursesTable.jsx
            │       │   ├── InstructorDashboard/
            │       │   │   ├── Instructor.jsx
            │       │   │   └── InstructorChart.jsx
            │       │   └── Settings/
            │       │       ├── ChangeProfilePicture.jsx
            │       │       ├── DeleteAccount.jsx
            │       │       ├── EditProfile.jsx
            │       │       ├── index.jsx
            │       │       └── UpdatePassword.jsx
            │       ├── HomePage/
            │       │   ├── Button.jsx
            │       │   ├── CodeBlocks.jsx
            │       │   ├── CourseCard.jsx
            │       │   ├── ExploreMore.jsx
            │       │   ├── HighlightText.jsx
            │       │   ├── InstructorSection.jsx
            │       │   ├── LearningLanguageSection.jsx
            │       │   └── Timeline.jsx
            │       └── ViewCourse/
            │           ├── CourseReviewModal.jsx
            │           ├── VideoDetails.jsx
            │           └── VideoDetailsSidebar.jsx
            ├── data/
            │   ├── countrycode.json
            │   ├── dashboard-links.js
            │   ├── footer-links.js
            │   ├── homepage-explore.js
            │   └── navbar-links.js
            ├── hooks/
            │   └── useOnClickOutside.js
            ├── pages/
            │   ├── About.jsx
            │   ├── Catalog.jsx
            │   ├── Contact.jsx
            │   ├── CourseDetails.jsx
            │   ├── Dashboard.jsx
            │   ├── Error.jsx
            │   ├── ForgotPassword.jsx
            │   ├── Home.jsx
            │   ├── Login.jsx
            │   ├── Signup.jsx
            │   ├── UpdatePassword.jsx
            │   ├── VerifyEmail.jsx
            │   └── ViewCourse.jsx
            ├── services/
            │   ├── apiConnector.js
            │   ├── apis.js
            │   ├── formatDate.js
            │   └── operations/
            │       ├── authAPI.js
            │       ├── courseDetailsAPI.js
            │       ├── pageAndComponentData.js
            │       ├── profileAPI.js
            │       ├── SettingsAPI.js
            │       └── studentFeaturesAPI.js
            ├── store/
            │   └── useStore.js
            └── utils/
                ├── avgRating.js
                ├── constants.js
                └── dateFormatter.jsx

```

---

## 📁 Folder Responsibilities

| Folder | Description |
|---------|-------------|
| **backend/config** | Configuration files for MongoDB, Cloudinary, and Razorpay. |
| **backend/controllers** | Contains the business logic for authentication, courses, payments, profiles, and reviews. |
| **backend/models** | Mongoose schemas defining the application's database structure. |
| **backend/routes** | Express route definitions that map incoming requests to controller functions. |
| **backend/middleware** | Custom middleware for JWT authentication, authorization, and request validation. |
| **backend/mail** | HTML email templates for OTP verification, enrollment, password reset, and payment success. |
| **backend/utils** | Helper functions such as image uploading, email sending, and video duration formatting. |
| **frontend/assets** | Stores images, logos, and other static resources used across the application. |
| **frontend/components** | Reusable UI components organized into common components and feature-specific modules. |
| **frontend/pages** | Top-level page components corresponding to application routes. |
| **frontend/services** | Centralized API configuration and functions for communicating with the backend. |
| **frontend/store** | Redux store setup and global state management. |
| **frontend/hooks** | Custom React hooks to encapsulate reusable logic. |
| **frontend/utils** | Utility functions and constants shared across the frontend. |

---

# 👥 User Roles

## Student

- Register
- Login
- Browse Courses
- Purchase Courses
- Learn
- Rate Courses

---

## Instructor

- Login
- Create Courses
- Upload Videos
- Manage Sections
- View Dashboard
- Publish Courses

---

# 🔑 Authentication Flow

```
User
  │
  ▼
Register
  │
  ▼
OTP Verification
  │
  ▼
Login
  │
  ▼
JWT Token
  │
  ▼
Protected Routes
```

---

# 💻 Frontend

The frontend is developed using React and follows a component-based architecture.

### Main Pages

- Home
- About
- Catalog
- Course Details
- Dashboard
- Login
- Signup
- Forgot Password
- Reset Password
- Verify Email

---

### Components

- Navbar
- Footer
- Rating Stars
- Review Slider
- Confirmation Modal
- Dashboard Components
- Course Builder
- Video Player
- Forms
- Cards

---

### State Management

Redux is used for

- User Authentication
- Course Data
- Cart
- Loading States

---

# ⚙ Backend

The backend is developed using Express.js.

### Features

- Authentication
- Authorization
- Course Management
- Category Management
- Payments
- Ratings
- Profile Management
- Cloudinary Uploads
- Email Services

---

### Middleware

- JWT Verification
- Authentication
- Instructor Authorization
- File Upload
- Error Handling

---

# 🗄 Database Models

The application uses MongoDB with Mongoose.

Main Collections

- User
- Profile
- Course
- Category
- Section
- SubSection
- RatingAndReviews
- CourseProgress
- OTP

---

# 🔌 API Overview

## Authentication

```
POST /auth/signup
POST /auth/login
POST /auth/sendotp
POST /auth/changepassword
POST /auth/reset-password
```

---

## Course

```
GET /course/getAllCourses
POST /course/createCourse
POST /course/addSection
POST /course/addSubSection
POST /course/editCourse
DELETE /course/deleteCourse
```

---

## Profile

```
GET /profile/getUserDetails
PUT /profile/updateProfile
DELETE /profile/deleteProfile
```

---

## Payment

```
POST /payment/capturePayment
POST /payment/verifyPayment
```

---

## Ratings

```
POST /course/createRating
GET /course/getReviews
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Protected APIs
- Environment Variables
- Role-Based Access Control
- Secure Cookies
- Input Validation

---


---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/Vedant8075/studynotion.git
```

Move into the project

```bash
cd studynotion
```

Install backend dependencies

```bash
cd backend
npm install
```

Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

# 🔑 Environment Variables

## Backend

Create a `.env` file

```env
PORT=5000

MONGODB_URL=

JWT_SECRET=

CLOUD_NAME=

API_KEY=

API_SECRET=

RAZORPAY_KEY=

RAZORPAY_SECRET=

MAIL_HOST=

MAIL_USER=

MAIL_PASS=

FOLDER_NAME=
```

---

## Frontend

```env
VITE_BASE_URL=http://localhost:5000/api/v1
```

---

# ▶ Running the Project

Backend

```bash
cd backend
npm run dev
```

Frontend

```bash
cd frontend
npm run dev
```

---

# 🚀 Future Improvements

- Live Classes
- Video Streaming Optimization
- AI Course Recommendation
- Certificates
- Discussion Forum
- Instructor Analytics
- Admin Dashboard
- Course Wishlist
- Mobile Application
- Dark Mode
- Real-time Notifications
- Multi-language Support

---

# 📊 Project Highlights

- MERN Stack Application
- 25+ REST APIs
- JWT Authentication
- OTP Verification
- Razorpay Integration
- Cloudinary Media Uploads
- Role-Based Authorization
- Responsive UI
- Instructor & Student Dashboards
- Modular MVC Backend
- Redux State Management

---

# 👨‍💻 Author

**Vedant**

GitHub: https://github.com/Vedant8075

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

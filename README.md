# 🎯 Focus Desk - Personal Task Manager

![Project Status](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-9.x-orange?logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green)

**Focus Desk** is a modern, responsive task management application built with **React** and **Firebase**. It helps users organize their daily activities with a clean, distraction-free interface. The app features secure authentication, real-time data storage, and insightful profile statistics.

---

## ✨ Features

### 🔐 **Authentication & Security**
- **Sign Up & Login:** Secure email/password authentication.
- **Google Sign-In:** One-click login with Google.
- **Password Management:** Reset password and update password functionality.
- **Email Verification:** Verify email addresses for account security.

### 📝 **Task Management**
- **Create Tasks:** Quickly add new tasks to your list.
- **Real-time Updates:** Tasks sync instantly across devices using Firestore.
- **Task Actions:** Mark tasks as completed or delete them.
- **Data Persistence:** Your data is saved safely in the cloud (Firebase).

### 👤 **User Profile & Stats**
- **Dashboard:** View your email and profile details.
- **Productivity Stats:** Track your completion rate and pending/completed task counts.
- **Customization:** Update your display name.
- **Dynamic Avatars:** Auto-generated colored avatars based on your email.

### 📱 **Responsive Design**
- Fully responsive UI that works seamlessly on **Desktop**, **Tablets**, and **Mobile**.
- Custom hamburger menu for mobile navigation.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, CSS3 (Custom Styles)
- **Backend-as-a-Service:** Firebase (Auth, Firestore)
- **Fonts:** Inter (via `@fontsource/inter`)
- **Icons:** React Icons

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
Make sure you have **Node.js** installed. You can check by running:
```bash
node -v
npm -v
```

### Step 1: Clone the Repository
Open your terminal or command prompt and run:

```bash
git clone https://github.com/SAIRAJA2005/focus-desk.git
cd focus-desk
```

### Step 2: Install Dependencies
Install all the necessary libraries (React, Firebase, etc.):

```bash
npm install
```

### Step 3: Firebase Configuration (Crucial Step!)

This project uses Firebase for backend services. You need to connect it to your own Firebase project.

1. Go to the Firebase Console.

2. Click "Add project" and give it a name (e.g., focus-desk).

3. Once created, click the Web icon (</>) to register an app.

4. Copy the firebaseConfig object provided by Firebase.

5. Open the file src/firebase.js in your code editor.

6. Replace the existing firebaseConfig with your own keys:

```bash
// src/firebase.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 4: Enable Firebase Services
In your Firebase Console dashboard:

1. Authentication: Go to Build > Authentication > Sign-in method. Enable Email/Password and Google.

2. Firestore Database: Go to Build > Firestore Database > Create Database. Start in Test mode for easier development.

### Step 5: Run the Project
Start the development server:

```bash
npm start
```
Open http://localhost:3000 to view it in your browser.

## 📂 Project Structure
A quick look at the top-level files and directories:

```bash
focus-desk/
├── public/              # Static assets (images, favicon)
├── src/
│   ├── components/
│   │   ├── Login.jsx    # Handles Login, Signup, and Reset Password
│   │   ├── Tasks.jsx    # Main dashboard, task list, and add task form
│   │   └── Profile.jsx  # User profile settings and statistics
│   ├── App.jsx          # Main application component & routing logic
│   ├── App.css          # Main application styles
│   ├── firebase.js      # Firebase configuration file
│   └── index.js         # Entry point
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation

```

## 📸 Screenshots

### Login Screen 

<img width="1823" height="923" alt="image" src="https://github.com/user-attachments/assets/1a97f1dc-b16d-438f-8c7c-5b2e28b358b4" />
    
Clean login interface with Google support 

### Task Dashboard

<img width="1866" height="849" alt="image" src="https://github.com/user-attachments/assets/74a6ba2a-812f-4386-8750-4eb7c19188e7" />

Manage your daily tasks efficiently

### User Profile

<img width="1823" height="906" alt="image" src="https://github.com/user-attachments/assets/135cc140-2425-4630-8b8a-134d1a4d8106" />

Track your productivity stats

# 👨‍💻 Author
Saride Sai Raja

GitHub: @SAIRAJA2005

LinkedIn: [SaiRaja Saride](https://www.linkedin.com/in/sairaja-saride-b4292725b/)

Built with ❤️ using React and Firebase


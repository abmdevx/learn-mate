# 📚 LearnMate

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Appwrite](https://img.shields.io/badge/Appwrite-20.0.0-F02E65?logo=appwrite&logoColor=white)](https://appwrite.io/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.9.0-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.13-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> A collaborative learning platform that helps students find the right people to learn with.

## 🎓 About LearnMate

LearnMate connects students with compatible study partners based on shared interests, learning goals, skill level, availability, and timezone.

The platform brings profile discovery, partner matching, and direct communication into one focused experience. Instead of learning alone, users can build meaningful study connections and collaborate with people who have similar goals.

## ✨ Main Features

### Authentication and Onboarding

- Create an account with email and password.
- Sign in securely and maintain an active session.
- Complete a guided profile setup during registration.
- Access protected areas of the application after authentication.

### Personalized Learning Profiles

Users can create and manage a profile containing:

- Learning topics and interests
- Current learning level
- Preferred availability
- Timezone
- Personal bio
- Custom avatar

### Study Partner Matching

LearnMate helps users discover potential study partners using shared learning interests and compatible preferences. Users can review profiles, express interest, and connect through the matching experience.

### Direct Messaging

Matched users can communicate through private conversations. The messaging experience keeps study discussions connected to the people and learning goals that matter to each user.

### Profile Management

Users can update their learning goals and personal preferences whenever they change. Profile forms include validation, structured selections, and save or discard actions for unsaved changes.

### Responsive User Experience

The interface is designed for both desktop and mobile screens, with clear navigation, helpful loading states, form feedback, and notifications throughout the application.

## 🛠️ Technology Stack

### Frontend

- **React** - Builds the component-based user interface.
- **Vite** - Provides the development server and production build tooling.
- **React Router** - Handles navigation and protected application routes.
- **Redux Toolkit** - Manages shared authentication and application state.
- **React Hook Form** - Handles form state, validation, and profile editing.
- **Tailwind CSS** - Provides responsive utility-first styling.

### Backend and Data Services

- **Appwrite** - Provides authentication, database services, user profiles, matches, messages, and notifications.
- **Appwrite Auth** - Manages email and password authentication and sessions.
- **Appwrite Tables** - Stores application data for profiles, matches, messages, and notifications.

### UI, Animation, and Supporting Libraries

- **Motion** - Adds interface transitions and component animations.
- **GSAP** - Supports advanced animation effects.
- **Lucide React** - Provides interface icons.
- **React Icons** - Provides additional icon options.
- **Swiper** - Supports interactive sliders and carousels.
- **React Timezone Select** - Provides timezone selection for user profiles.
- **React Nice Avatar**, **Avataaars2**, and **Multiavatar** - Support profile avatar creation.

## 🔄 How LearnMate Works

1. A student creates an account and completes their learning profile.
2. LearnMate uses the profile information to present compatible study partners.
3. The student reviews other profiles and expresses interest in suitable matches.
4. Once a connection is established, matched users can start a private conversation.
5. Users can continue updating their profile as their learning goals and availability change.

## 🎯 Product Goals

LearnMate is built around three simple goals:

- **Personalized learning** - Help users find partners who match their goals and interests.
- **Consistent collaboration** - Make it easier to maintain productive study relationships.
- **Accessible communication** - Keep discovery, matching, and messaging in one place.

## 📜 License

This project is proprietary and confidential. The source code, design, concept, and content may not be copied, reused, distributed, or used for commercial or personal projects without prior written permission from the author.

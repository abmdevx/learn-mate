import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import Store from "./Redux/Store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import LandingPage from "@/features/landing/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupWizard from "@/features/auth/SignupWizard";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Features from "./pages/Features";
import Copyright from "./pages/Copyright";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgetPassword";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import DashboardPage from "@/features/dashboard/DashboardPage";
import Profile from "./pages/Profile";
import MatchHub from "@/features/matching/MatchHub";
import MatchDiscoveryPage from "@/features/matching/MatchDiscovery";
import Settings from "./pages/Settings";
import UserProfile from "@/features/matching/UserProfile";
import MessageChat from "@/features/messaging/MessageChat";
import MessagingPage from "@/features/messaging/MessagingPage";
import "./index.css"; // your custom styles (optional)
import faviconUrl from "../assets/favicon.png";

const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = faviconUrl;
document.head.appendChild(favicon);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // ----- Public -----

      { index: true, element: <PublicRoute><LandingPage /></PublicRoute> },
      { path: "/features", element: <PublicRoute><Features /></PublicRoute> },
      { path: "/about", element: <PublicRoute><About /></PublicRoute> },
      { path: "/copyright", element: <PublicRoute><Copyright /></PublicRoute> },

      // ✅ Group auth-related routes
      {
        path: "/auth",
        children: [
          { index: true, element: <PublicRoute> <LoginPage /> </PublicRoute> },
          { path: "login", element: <PublicRoute> <LoginPage /> </PublicRoute> },
          { path: "signup", element: <PublicRoute> <SignupWizard /> </PublicRoute> },
          { path: "forget-password", element: <PublicRoute> <ForgotPassword /> </PublicRoute> },
          { path: "reset-password", element: <PublicRoute> <ResetPassword /> </PublicRoute> },
        ],
      },
       // ----- Private -----
      {
        element: <PrivateRoute />, // wrapper for all private pages
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/profile", element: <Profile /> },
          { path: "/settings", element: <Settings /> },
          { path: "/match", element: <MatchHub /> },
          { path: "/find-match", element: <MatchDiscoveryPage /> },
          { path: "/user/:id", element: <UserProfile /> },
          { path: "/messages", element: <MessagingPage /> },
          { path: "/messages/:userId", element: <MessagingPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <Provider store={Store}>
    <RouterProvider router={router} />
  </Provider>
);
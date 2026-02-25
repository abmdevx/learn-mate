import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import Store from "./Redux/Store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import LoginPage from "./pages/LoginPage";
import SignupWizard from "./components/SignupComponents/SignupWizard";
import About from "./pages/About";
import Features from "./pages/Features";
import Copyright from "./pages/Copyright";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgetPassword";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Dashboard from "./components/Dashboard";
import Profile from "./pages/Profile";
import Match from "./components/Matches/Match";
import FindMatchPage from "./components/Matches/FindMatches";
import Settings from "./pages/Settings";
import UserProfile from "./components/Matches/UserProfile";
import MessageChat from "./components/Messages/MessageChat";
import MessageDashboard from "./components/Messages/MessageDashboard";
import "./index.css"; // your custom styles (optional)

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // ----- Public -----

      { index: true, element: <PublicRoute><Home /></PublicRoute> },
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
        ],
      },
       // ----- Private -----
      {
        element: <PrivateRoute />, // wrapper for all private pages
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/profile", element: <Profile /> },
          { path: "/settings", element: <Settings /> },
          { path: "/match", element: <Match /> },
          { path: "/find-match", element: <FindMatchPage /> },
          { path: "/user/:id", element: <UserProfile /> },
          { path: "/messages", element: <MessageDashboard /> },
          { path: "/messages/:userId", element: <MessageChat /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <RouterProvider router={router} />
  </Provider>
);

// Remove loader once React is ready
window.addEventListener("load", () => {
  const loader = document.getElementById("global-loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("fade-out"); // trigger fade animation
      setTimeout(() => {
        loader.style.display = "none"; // fully remove after fade
      }, 600); // match fade duration
    }, 3000); // ✅ keep loader visible for 3s
  }
});
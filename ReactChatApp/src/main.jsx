import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import LoginPage from "./pages/LoginPage";
import SignupWizard from "./components/SignupComponents/SignupWizard";
import About from "./pages/About";
import Features from "./pages/Features";
import Copyright from "./pages/Copyright";
import NotFound from "./pages/NotFound";
import "./index.css"; // your custom styles (optional)

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/features", element: <Features /> },
      { path: "/about", element: <About /> },
      { path: "/copyright", element: <Copyright /> },

      // ✅ Group auth-related routes
      {
        path: "/auth",
        children: [
          { index: true, element: <LoginPage /> },  // default for /auth
          { path: "login", element: <LoginPage /> },
          { path: "signup", element: <SignupWizard /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
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
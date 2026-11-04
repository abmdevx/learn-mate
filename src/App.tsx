import { useAppDispatch, useAppSelector } from "./Redux/Hooks";
import { Outlet } from "react-router-dom";
import PublicNavbar from "@/layout/navigation/PublicNavbar";
import AuthenticatedNavbar from "@/layout/navigation/AuthenticatedNavbar";
import Footer from "@/layout/footer/Footer";
import ScrollToTop from "@/layout/ScrollToTop";
import { checkSession } from "./Redux/AuthThunks";
import { useEffect } from "react";

const MIN_INITIAL_LOADER_TIME = 1500;

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loaderStartedAt = Date.now();

    dispatch(checkSession()).finally(() => {
      const initialLoader = document.getElementById("initial-loader");
      if (!initialLoader) return;

      const elapsedTime = Date.now() - loaderStartedAt;
      const remainingTime = Math.max(0, MIN_INITIAL_LOADER_TIME - elapsedTime);

      setTimeout(() => {
        initialLoader.classList.add("fade-out");
        setTimeout(() => initialLoader.remove(), 600);
      }, remainingTime);
    });
  }, [dispatch]);

  const { userData } = useAppSelector((state) => state.auth);
  console.log("Current user in App.jsx:", userData);
  
  const isLoggedIn = !!userData;

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop /> 
      
      {/* Navbar switches based on login status */}
      {isLoggedIn ? <AuthenticatedNavbar /> : <PublicNavbar />}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer only for guests */}
      {!isLoggedIn && <Footer />}
    </div>
  );
}

export default App;
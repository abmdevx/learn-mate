import { Outlet } from "react-router-dom";
import HomeNavbar from "./components/Navbar/HomeNavbar";
import LoggedInNavbar from "./components/Navbar/LoggedinNavbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollTop";
import { useSelector } from "react-redux";
import { checkSession } from "./Redux/AuthThunks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const MIN_INITIAL_LOADER_TIME = 1500;

function App() {
  const dispatch = useDispatch();

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

  const { userData } = useSelector((state) => state.auth);
  console.log("Current user in App.jsx:", userData);
  
  const isLoggedIn = !!userData;

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop /> 
      
      {/* Navbar switches based on login status */}
      {isLoggedIn ? <LoggedInNavbar /> : <HomeNavbar />}

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
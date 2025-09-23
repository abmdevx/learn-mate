import { Outlet } from "react-router-dom";
import HomeNavbar from "./components/Navbar/HomeNavbar";
import LoggedInNavbar from "./components/Navbar/LoggedinNavbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollTop";
import { useSelector } from "react-redux";
import { checkSession } from "./Redux/AuthThunks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Loader from "./Loader";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  const { userData, loading } = useSelector((state) => state.auth);
  console.log("Current user in App.jsx:", userData);
  
  const isLoggedIn = !!userData;

  if (loading) return <Loader />;

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
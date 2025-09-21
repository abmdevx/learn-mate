import { Outlet } from "react-router-dom";
import HomeNavbar from "./components/Navbar/HomeNavbar";
import LoggedInNavbar from "./components/Navbar/LoggedinNavbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollTop";

// Temporary: mock login state (later you’ll replace with real auth context)
const isLoggedIn = false; // change to false to test guest view

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop /> 
      
      {/* Navbar switches based on login status */}
      {isLoggedIn ? <LoggedInNavbar /> : <HomeNavbar />}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
import Navbar from "./components/Navbar/HomeNavbar";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Main Content (changes with route) */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer stays at the bottom */}
      <Footer />
    </div>
  );
}

export default App;
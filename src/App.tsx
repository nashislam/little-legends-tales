
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

// Import components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          {/* Add additional routes as needed */}
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;

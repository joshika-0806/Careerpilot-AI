import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Report from "./pages/Report";

import InterviewDashboard from "./pages/InterviewDashboard";
import CompanyPrep from "./pages/CompanyPrep";
import CodingWorkspace from "./pages/CodingWorkspace";
import TechnicalQuestions from "./pages/TechnicalQuestions";
import HRInterview from "./pages/HRInterview";
import MockInterview from "./pages/MockInterview";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            
            {/* Interview Prep Routes */}
            <Route path="/interview" element={<InterviewDashboard />} />
            <Route path="/interview/company/:id" element={<CompanyPrep />} />
            <Route path="/interview/coding/:id" element={<CodingWorkspace />} />
            <Route path="/interview/technical/:id" element={<TechnicalQuestions />} />
            <Route path="/interview/hr" element={<HRInterview />} />
            <Route path="/interview/mock" element={<MockInterview />} />
            
            {/* Admin */}
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
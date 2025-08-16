import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Roadmap from "./pages/Roadmap";
import BlogList from "./pages/BlogList";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

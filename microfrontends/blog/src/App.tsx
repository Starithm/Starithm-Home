import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import Roadmap from "./pages/Roadmap";
import BlogList from "./pages/BlogList";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
              <Routes>
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/roadmap" element={<Roadmap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '../../../shared/components/ThemeProvider';
import Roadmap from "./pages/Roadmap";
import BlogList from "./pages/BlogList";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <div className="min-h-screen bg-white dark:bg-starithm-bg-black">
          <Routes>
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/roadmap" element={<Roadmap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Analytics />
      </Router>
    </ThemeProvider>
  );
}

export default App;

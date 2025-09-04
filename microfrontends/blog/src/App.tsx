import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { StyledThemeProviderNew } from '@shared/components/StyledThemeProviderNew';
import Roadmap from "./pages/Roadmap";
import BlogList from "./pages/BlogList";
import NotFound from "./pages/NotFound";

function App() {
  return (
      <StyledThemeProviderNew>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/roadmap" element={<Roadmap />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Analytics />
        </Router>
      </StyledThemeProviderNew>
  );
}

export default App;

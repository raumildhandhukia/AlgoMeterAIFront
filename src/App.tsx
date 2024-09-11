import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import About from "./components/About";
import FAQ from "./components/FAQ";
import Blog from "./components/Blog";
import BlogPost from "./components/BlogPost";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

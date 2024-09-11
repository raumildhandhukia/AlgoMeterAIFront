import { Link } from "react-router-dom";
import Logo from "../assets/Logo";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 shadow-lg">
      <nav className="container px-8 lg:px-0 lg:mx-auto py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 lg:w-10 lg:h-10" />
          <h1 className="text-md lg:text-2xl text-white">AlgoMeter AI</h1>
        </Link>
        <ul className="flex items-center gap-4">
          <li>
            <Link to="/blog" className="hover:text-gray-300">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-gray-300">
              FAQ
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-gray-300 hover:text-white transition duration-300"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

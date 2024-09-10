import { Link } from "react-router-dom";
import Logo from "../assets/Logo";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 shadow-lg">
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="w-10 h-10" />
          <h1 className="text-2xl text-white">AlgoMeter AI</h1>
        </Link>
        <ul>
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

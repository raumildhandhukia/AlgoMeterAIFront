import { Social } from "./Social";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-10 flex flex-col gap-5">
      <div className="flex justify-center items-center">
        <Social />
      </div>
      <div className="flex justify-center items-center">
        <p>
          made with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/raumild/"
            className="hover:underline text-red-400 font-bold tracking-widest"
          >
            @raumildhandhukia
          </a>
        </p>
      </div>
      <div className="flex justify-center items-center">
        <p>&copy; 2024 AlgoMeter AI</p>
      </div>
    </footer>
  );
}

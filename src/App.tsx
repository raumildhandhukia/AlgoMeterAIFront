import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <Main />
      </main>
      <Footer />
    </div>
  );
}

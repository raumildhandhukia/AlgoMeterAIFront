import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AlgoMeter AI",
  description:
    "Calculate the time and space complexity of your code using Big O notation. ",

  authors: [{ name: "Raumil Dhandhukia" }],
  openGraph: {
    title: "AlgoMeter AI",
    description:
      "Analyze your algorithms using AI. Get the time and space complexity. Visualize the iterations.",
    url: "https://algometerai.com",
    siteName: "AlgoMeter AI",
    images: "./opengraph-image.png",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoMeter AI",
    description:
      "Analyze your algorithms using AI. Get the time and space complexity. Visualize the iterations.",
    images: ["./opengraph-image.png"],
  },
  robots: "index, follow",
  icons: {
    icon: "./favicon.ico",
    apple: "./favicon.ico",
  },
  verification: {
    google: "cUGlFZICfpCSMLBBnjP29rvDYmv4_TG313JnLv0W1gs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="keywords"
          content="Big O notation, code analysis, algorithm analysis tool, ai algorithm analyzer, time complexity calculator, space complexity calculator, big o notation tool, analyze code performance, visualize algorithm complexity, code complexity checker, ai-driven algorithm insights, time and space complexity analysis, algorithm performance visualization, code benchmarking tool, measure algorithm efficiency, ai-powered code analysis, big o notation calculator, code complexity analysis tool, multi-language code analysis, ai code optimizer, predict time complexity, ai-based algorithm performance tool
, algorithm, algorithm analysis, ai check, ai, ai for code,ai to code,my ai,ai bubble, ai searching, ai blog, ai blogspot, big o notation, time complexity, space complexity, code optimization, AI, AlgoMeter AI, algorithm visualization, time and space complexity, algometer, algometer ai, search ai, ai analysis, machine learning, leetcode, dsa, striver, neetcode, neet code, amazon, google, apple, faang, faamg"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/big-o-notation.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <main className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Header />
          <div className="flex-grow flex flex-col items-center justify-center">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}

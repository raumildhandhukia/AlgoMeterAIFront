import React from "react";
import { BuyMeCoffee } from "./Coffee";

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About AlgoMeter AI</h1>
      <p className="mb-4">
        AlgoMeter AI is a website designed to help developers understand and
        visualize the time and space complexity of their algorithms. This tool
        analyzes code snippets and provides detailed insights into their
        performance characteristics.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Support This Project</h2>
      <p className="mb-4">
        AlgoMeter AI is a labor of love, created to benefit the developer
        community. However, maintaining and improving this tool requires
        resources. Hosting platforms and AI tools used to power AlgoMeter AI
        are not cheap. If you find this project helpful, please consider
        supporting it. Your contribution will help keep AlgoMeter AI running,
        up-to-date, and free for everyone. Every little bit helps in our mission
        to make algorithm analysis accessible to all developers. Thank you for
        your support!
      </p>
      <BuyMeCoffee />
      <h2 className="text-2xl font-semibold mt-8 mb-4">The Developer</h2>
      <p className="mb-4">
        Hello, world! I'm{" "}
        <span className="text-gradient text-2xl hover:underline">
          <a href="https://www.linkedin.com/in/raumild/" target="_blank">
            Raumil Dhandhukia
          </a>
        </span>
        , the creator of AlgoMeter AI. As a passionate software engineer, I've
        always been fascinated by algorithm analysis and its impact on code
        performance. I built this tool to make algorithm complexity more
        accessible and intuitive for developers at all levels. Whether you're a
        student learning about Big O notation or a seasoned programmer
        optimizing your code, I hope AlgoMeter AI helps you on your journey.
        Let's demystify algorithms together!
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Technologies Used</h2>
      <p className="text-lg font-semibold mb-4 text-gradient">
        &lt;/&gt; Unveiling the Tech Stack Behind the Magic &lt;/&gt;
      </p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Frontend</h3>
      <ul className="list-disc list-inside mb-4">
        <li>React with TypeScript</li>
        <li>Tailwind CSS for styling</li>
        <li>Vite as the build tool</li>
        <li>MUI Charts for data visualization</li>
        <li>CodeMirror for the code editor</li>
      </ul>
      <h3 className="text-xl font-semibold mt-4 mb-2">Backend</h3>
      <ul className="list-disc list-inside mb-4">
        <li>Python</li>
        <li>FastAPI</li>
        <li>Gemini API for AI-powered analysis</li>
        <li>Redis for rate limiting</li>
      </ul>
      <p className="mt-8">
        For more information or to connect with the developer, visit the links
        in the footer.
      </p>
    </div>
  );
};

export default About;

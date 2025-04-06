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
        AlgoMeter AI is created to benefit the developer community. However,
        maintaining and improving this tool requires resources. Hosting
        platforms and AI tools used to power AlgoMeter AI are not cheap. If you
        find this project helpful, please consider supporting it. Your
        contribution will help keep AlgoMeter AI running, up-to-date, and free
        for everyone. Every little bit helps in our mission to make algorithm
        analysis accessible to all developers. Thank you for your support!
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

      <h2 className="text-2xl font-semibold mt-8 mb-4">Company-Wise Questions</h2>
      <p className="mb-4">
        Our platform now features a comprehensive collection of company-wise interview questions sorted by frequency. This powerful tool allows you to:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>Browse questions from top tech companies like Google, Amazon, Meta, and Microsoft</li>
        <li>See questions ranked by their frequency in actual interviews</li>
        <li>Access detailed frequency data showing which companies have asked each question in the last 3 months, 6 months, and beyond</li>
        <li>Prepare more effectively by focusing on the questions most likely to appear in your upcoming interviews</li>
      </ul>
      <p className="mb-4">
        The frequency data is regularly updated to reflect the latest interview trends, giving you the most current information to guide your preparation strategy.
      </p>

      <p className="mt-8">
        For more information or to connect with the developer, visit the links
        in the footer.
      </p>
    </div>
  );
};

export default About;

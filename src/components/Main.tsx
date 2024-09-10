import { useState } from "react";
import CodeEditor from "./CodeEditor";
import PulsatingButton from "./ui/pulsating-button";
import { useCodeAnalysis } from "../hooks/useCodeAnalysis";

const Main = () => {
  const [code, setCode] = useState<string>("");
  const { result, indices, isLoading, error, analyze } = useCodeAnalysis();
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };
  const handleAnalyze = () => {
    analyze(code);
  };
  console.log(indices);
  return (
    <>
      {result && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-md max-w-[70vw] mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Analysis Result
          </h2>
          <div className="space-y-4">
            <div className="flex gap-12 items-center">
              <p className="flex items-center gap-3">
                <span className="font-semibold text-gray-300">
                  Time Complexity:
                </span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded">
                  {result.time_complexity}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <span className="font-semibold text-gray-300">
                  Space Complexity:
                </span>
                <span className="bg-green-600 text-white px-2 py-1 rounded">
                  {result.space_complexity}
                </span>
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-300 mb-2">Explanation:</p>
              <p className="text-gray-300 bg-gray-700 p-3 rounded">
                {result.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center items-center mt-10">
        <CodeEditor initialValue={code} onChange={handleCodeChange} />
      </div>
      <PulsatingButton
        onClick={handleAnalyze}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Click to start analysis"}
      </PulsatingButton>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </>
  );
};

export default Main;

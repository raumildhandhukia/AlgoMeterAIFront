import { useState } from "react";
import CodeEditor from "./CodeEditor";
import PulsatingButton from "./ui/pulsating-button";
import { useCodeAnalysis } from "../hooks/useCodeAnalysis";
import Chart from "./Chart";

const Main = () => {
  const [code, setCode] = useState<string>("");
  const { result, indices, isLoading, error, analyze } = useCodeAnalysis();
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };
  const handleAnalyze = () => {
    analyze(code);
  };
  return (
    <>
      {result && (
        <div className="flex gap-20 mt-6 p-6 bg-gray-800 rounded-lg shadow-md max-w-[90vw] ">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              Analysis Result
            </h2>
            <div className="space-y-20">
              <div>
                <p className="font-semibold text-gray-300 mt-10 mb-2 text-2xl">
                  Explanation:
                </p>
                <p className="text-gray-300 bg-gray-700 p-3 mt-5 rounded-lg text-xl">
                  {result.explanation}
                </p>
              </div>
              <div className="flex gap-8 flex-col">
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-gray-300 text-4xl">
                    Time Complexity:
                  </span>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-5xl">
                    {result.time_complexity}
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-gray-300 text-4xl">
                    Space Complexity:
                  </span>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-5xl">
                    {result.space_complexity}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {indices && indices.length > 0 && (
            <div className="flex justify-center items-center mt-10">
              <Chart indices={indices} />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center items-center mt-10">
        <CodeEditor initialValue={code} onChange={handleCodeChange} />
      </div>
      <PulsatingButton
        onClick={handleAnalyze}
        className="text-2xl mt-16 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Click to start analysis"}
      </PulsatingButton>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </>
  );
};

export default Main;

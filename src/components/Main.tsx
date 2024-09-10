import { useState } from "react";
import CodeEditor from "./CodeEditor";
import PulsatingButton from "./ui/pulsating-button";
import { useCodeAnalysis } from "../hooks/useCodeAnalysis";
import Chart from "./Chart";

type Examples = {
  [key: string]: string;
};

const examples: Examples = {
  recursive_fibonacci:
    "function fibonacci(n) {\n  if (n <= 1) { \n    return n; \n  }\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",

  binary_search:
    "function binary_search(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return -1;\n}",

  quick_sort:
    "function quick_sort(arr) {\n  if (arr.length <= 1) {\n    return arr;\n  }\n\n  let pivot = arr[Math.floor(arr.length / 2)];\n  let left = [];\n  let right = [];\n\n  for (let i = 0; i < arr.length; i++) {\n    if (i === Math.floor(arr.length / 2)) {\n      continue;\n    }\n    if (arr[i] < pivot) {\n      left.push(arr[i]);\n    } else {\n      right.push(arr[i]);\n    }\n  }\n\n  return [...quick_sort(left), pivot, ...quick_sort(right)];\n}",

  bubble_sort:
    "function bubble_sort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        let temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n  return arr;\n}",

  linear_search:
    "function linear_search(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) {\n      return i;\n    }\n  }\n  return -1;\n}",
};

const Main = () => {
  const [code, setCode] = useState<string>("");
  const { result, indices, secondsLeft, isLoading, error, analyze } =
    useCodeAnalysis();

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleAnalyze = () => {
    analyze(code);
  };

  const setExampleCode = (exampleName: string) => {
    setCode(examples[exampleName]);
  };
  console.log(code);

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
          <div className="min-w-[500px] min-h-[500px]">
            {indices && indices.length > 0 ? (
              <div className="flex flex-col justify-center items-center mt-10">
                <Chart indices={indices} />
                <div className="px-10">
                  <p className="text-gradient text-2xl ">
                    hover your mouse over the chart
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-start mt-10 h-full">
                <p className="text-gray-300 text-xl">
                  Something went wrong. Please try again.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center items-center mt-10">
        <div className="flex justify-evenly gap-4 mb-8">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={() => setExampleCode("linear_search")}
          >
            Linear Search
          </button>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={() => setExampleCode("binary_search")}
          >
            Binary Search
          </button>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={() => setExampleCode("bubble_sort")}
          >
            Bubble Sort
          </button>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={() => setExampleCode("quick_sort")}
          >
            Quick Sort
          </button>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={() => setExampleCode("recursive_fibonacci")}
          >
            Recursive Fibonacci
          </button>
        </div>
        <CodeEditor initialValue={code} onChange={handleCodeChange} />
      </div>
      {secondsLeft && secondsLeft > 0 ? (
        <div className="mt-16 text-2xl text-white">
          Limit reached. Try again after {secondsLeft} seconds.
        </div>
      ) : (
        <PulsatingButton
          onClick={handleAnalyze}
          className="text-2xl mt-16 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Click to start analysis"}
        </PulsatingButton>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </>
  );
};

export default Main;

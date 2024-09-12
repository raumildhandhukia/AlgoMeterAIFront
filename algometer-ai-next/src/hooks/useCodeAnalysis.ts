import { useState, useEffect } from "react";
import { analyzeCode } from "../services/api";
import type { AnalysisResult, Indices } from "../types";

export const useCodeAnalysis = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [indices, setIndices] = useState<Indices[] | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (secondsLeft !== null && secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          }
          if (intervalId) {
            clearInterval(intervalId);
          }
          return 0;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [secondsLeft]);

  const analyze = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeCode(code);
      const { response, indices, seconds_left } = data;

      if (seconds_left) {
        setSecondsLeft(seconds_left);
      } else {
        setResult(response);
        setIndices(indices);
      }
    } catch (err) {
      console.log(err);
      setError("Error analyzing code");
    } finally {
      setIsLoading(false);
    }
  };

  return { result, indices, secondsLeft, isLoading, error, analyze };
};

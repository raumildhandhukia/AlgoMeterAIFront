import { useState } from "react";
import { analyzeCode } from "../services/api";
import type { AnalysisResult, Indices } from "../types";

export const useCodeAnalysis = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [indices, setIndices] = useState<Indices[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeCode(code);
      const { response, indices } = data;
      setResult(response);
      setIndices(indices);
    } catch (err) {
      console.log(err);
      setError("Error analyzing code");
    } finally {
      setIsLoading(false);
    }
  };

  return { result, indices, isLoading, error, analyze };
};

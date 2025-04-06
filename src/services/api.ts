const BASE = process.env.NEXT_PUBLIC_SERVER_URL;
const QUESTIONS = process.env.NEXT_PUBLIC_QUESTIONS;

export const analyzeCode = async (code: string) => {
  try {
    debugger;
    const response = await fetch(`${BASE}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code_snippet: code }),
      credentials: 'include', // Add credentials to send cookies
    });
    const data = await response.json();
    if (response.status === 429) {
      return { seconds_left: data.seconds_left };
    }
    if (response.status !== 200) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error("Error analyzing code:", error);
    throw error;
  }
};

export const fetchCompanyQuestions = async (slug: string, page: number = 1, limit: number = 100) => {
  try {
    const response = await fetch(`${QUESTIONS}/api/company-questions?slug=${slug}&page=${page}&limit=${limit}`, {

    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch company questions');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching company questions:", error);
    throw error;
  }
};

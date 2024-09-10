const BASE = import.meta.env.VITE_SERVER_URL;

export const analyzeCode = async (code: string) => {
  try {
    const response = await fetch(`${BASE}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code_snippet: code }),
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

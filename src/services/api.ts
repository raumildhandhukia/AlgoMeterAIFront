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

    throw error;
  }
};

export const fetchCompanyQuestions = async (
  companySlugs: string[], 
  page: number = 1, 
  limit: number = 100, 
  options: {
    match?: 'all' | 'any', 
    minFrequency?: number, 
    difficulty?: 'easy' | 'medium' | 'hard', 
    topics?: string[],
    companies?: string[],
    favSlug?: string
  } = {}
) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add company slugs as a single comma-separated parameter only if companies are selected
    // When no companies are selected, we don't pass the slug parameter to fetch all companies data
    if (companySlugs.length > 0) {
      queryParams.append('slug', companySlugs.join(','));
    }

    // Add optional parameters
    if (options.match) queryParams.append('match', options.match);
    if (options.minFrequency !== undefined) queryParams.append('minFrequency', options.minFrequency.toString());
    if (options.difficulty) queryParams.append('difficulty', options.difficulty);
    if (options.topics && options.topics.length > 0) queryParams.append('topics', options.topics.join(','));
    if (options.companies && options.companies.length > 0) queryParams.append('companies', options.companies.join(','));
    if (options.favSlug) queryParams.append('favSlug', options.favSlug); 
   
    const response = await fetch(`${QUESTIONS}/api/modular-questions?${queryParams.toString()}`, {
      // credentials: 'include', // Add credentials to send cookies
    });
    
    const data = await response.json();
    
    // Handle rate limiting (429 status)
    if (response.status === 429) {
      return {
        statusCode: 429,
        success: false,
        error: data.error || "Rate limit exceeded. Please try again later.",
        resetTime: data.resetTime,
        isRateLimited: true
      };
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch company questions');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

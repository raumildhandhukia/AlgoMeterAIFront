
const BASE = process.env.NEXT_PUBLIC_SERVER_URL;

interface CompanyTag {
  timesEncountered: number;
  slug: string;
  name: string;
}

interface CompanyTagsResponse {
  three_months: CompanyTag[];
  six_months: CompanyTag[];
  more_than_six_months: CompanyTag[];
}

interface CompanyTagsApiResponse {
  statusCode: number;
  companyTags: string; // JSON string
  success: boolean;
}

export const getCompanyTags = async (url: string): Promise<CompanyTagsResponse> => {
  try {

    
    // Make the API request
    const response = await fetch(`${BASE}/api/company-tags?url=${encodeURIComponent(url)}`);
    debugger;

    
    if (!response.ok) {
      throw new Error(`Failed to fetch company tags: ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();

    
    // Create a default response structure
    const defaultResponse: CompanyTagsResponse = {
      three_months: [],
      six_months: [],
      more_than_six_months: []
    };
    
    // Check if we have a successful response
    if (!data.success) {

      return defaultResponse;
    }
    
    // Try to parse the companyTags string
    if (typeof data.companyTags === 'string') {
      try {
        // Parse the JSON string
        const parsedData = JSON.parse(data.companyTags);

        
        // Create a properly structured response
        return {
          three_months: parsedData?.three_months || [],
          six_months: parsedData?.six_months || [],
          more_than_six_months: parsedData?.more_than_six_months || []
        };
      } catch (parseError) {

        return defaultResponse;
      }
    } else if (data.companyTags && typeof data.companyTags === 'object') {
      // If companyTags is already an object

      const tagsData = data.companyTags as any;
      
      return {
        three_months: tagsData?.three_months || [],
        six_months: tagsData?.six_months || [],
        more_than_six_months: tagsData?.more_than_six_months || []
      };
    }
    
    // If we couldn't parse the data properly, return the default structure
    return defaultResponse;
  } catch (error) {

    // Return empty arrays rather than throwing
    return {
      three_months: [],
      six_months: [],
      more_than_six_months: []
    };
  }
};

export type { CompanyTag, CompanyTagsResponse };

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanyQuestions } from "@/services/api";
import { CompanyTagsResponse } from "@/services/companyTags";
import companyData from "@/data/company.json";
import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import { Search, ChevronDown, ChevronUp, X, AlertCircle, Clock } from "lucide-react";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import CompanyQuestionsFilter from "@/components/CompanyQuestionsFilter";

// Define types for company data
interface Company {
  name: string;
  slug: string;
  questionCount: number;
}

interface Question {
  id: number;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  topicTags: {
    name: string;
    slug: string;
    __typename: string;
  }[];
  status: string;
  paidOnly: boolean;
  isInMyFavorites: boolean;
  acRate: number;
  frequency: number;
  __typename: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CompanyQuestionsResponse {
  statusCode: number;
  success: boolean;
  slug: string;
  pagination?: PaginationInfo;
  questionCount?: number;
  questions?: Question[];
  error?: string;
  resetTime?: number;
  isRateLimited?: boolean;
}

const CompanySearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const [companyTagsData, setCompanyTagsData] = useState<Record<string, CompanyTagsResponse>>({});
  const [loadingCompanyTags, setLoadingCompanyTags] = useState<Record<string, boolean>>({});
  const [showDetailedTags, setShowDetailedTags] = useState<Record<string, boolean>>({});
  const [currentFilters, setCurrentFilters] = useState<{
    match?: 'all' | 'any', 
    minFrequency?: number, 
    difficulty?: 'easy' | 'medium' | 'hard', 
    topics?: string[]
  }>({});
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isRateLimited: boolean;
    resetTime: number | null;
    message: string | null;
    secondsLeft: number | null;
  }>({ isRateLimited: false, resetTime: null, message: null, secondsLeft: null });

  // Setup fuzzy search with Fuse.js
  const fuse = new Fuse(companyData.companyTags, {
    keys: ["name"],
    threshold: 0.3,
    includeScore: true,
  });

  const getFilteredCompanies = () => {
    if (!searchTerm) return [];
    return fuse.search(searchTerm).slice(0, 10).map((result: FuseResult<Company>) => result.item);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setSearchTerm(company.name);
    setShowResults(false);
    setCurrentPage(1);
    setCurrentFilters({});
    setRateLimitInfo({ isRateLimited: false, resetTime: null, message: null, secondsLeft: null });
    fetchQuestions(company.slug, 1);
  };

  const fetchQuestions = async (
    slug: string, 
    page: number, 
    filters: {
      match?: 'all' | 'any', 
      minFrequency?: number, 
      difficulty?: 'easy' | 'medium' | 'hard', 
      topics?: string[]
    } = {}
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchCompanyQuestions(slug, page, 100, filters);
      
      // Handle rate limiting
      if (response.statusCode === 429 || response.isRateLimited) {
        const resetTimeInSeconds = response.resetTime || 60;
        const resetTimeFormatted = Math.ceil(resetTimeInSeconds);
        
        setRateLimitInfo({
          isRateLimited: true,
          resetTime: resetTimeInSeconds,
          secondsLeft: resetTimeFormatted,
          message: `${response.error || 'Rate limit exceeded'}. Because of limited resources, please wait ${resetTimeFormatted} seconds before trying again.`
        });
        
        setIsLoading(false);
        return;
      }
      
      // Only update the state with new data if the request was successful
      if (response.success && response.questions) {
        setQuestions(response.questions);
        setPagination(response.pagination || null);
        // Update the current page after successful response
        if (page !== currentPage) {
          setCurrentPage(page);
        }
        // Clear any rate limit info if the request was successful
        setRateLimitInfo({ isRateLimited: false, resetTime: null, message: null, secondsLeft: null });
      } else {
        setError(response.error || "Failed to fetch questions. Please try again.");
        setQuestions([]);
      }
    } catch (err) {
      setError("Failed to fetch questions. Please try again.");
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (!selectedCompany || rateLimitInfo.isRateLimited) return;
    // Don't update currentPage here - will update after successful response
    fetchQuestions(selectedCompany.slug, page, currentFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filters: {
    match?: 'all' | 'any', 
    minFrequency?: number, 
    difficulty?: 'easy' | 'medium' | 'hard' | 'all', 
    topics?: string[],
    resetPage?: boolean
  }) => {
    // Don't apply filters if rate limited
    if (rateLimitInfo.isRateLimited) return;
    
    // Always reset the current page to 1 when filters change
    if (filters.resetPage) {
      setCurrentPage(1);
    }
    
    // Create a new filters object
    const newFilters: {
      match?: 'all' | 'any', 
      minFrequency?: number, 
      difficulty?: 'easy' | 'medium' | 'hard', 
      topics?: string[]
    } = {};
    
    // Only add difficulty filter if it's not 'all'
    if (filters.difficulty && filters.difficulty !== 'all') {
      newFilters.difficulty = filters.difficulty as 'easy' | 'medium' | 'hard';
    }
    
    // Add min frequency filter if it's greater than 0
    if (filters.minFrequency !== undefined && filters.minFrequency > 0) {
      newFilters.minFrequency = filters.minFrequency;
    }
    
    // Add match type filter if it's specified
    if (filters.match) {
      newFilters.match = filters.match;
    }
    
    // Add topics filter if it's specified
    if (filters.topics && filters.topics.length > 0) {
      newFilters.topics = filters.topics;
    }
    
    // Update current filters
    setCurrentFilters(newFilters);
    
    // Fetch questions with new filters
    if (selectedCompany) {
      fetchQuestions(selectedCompany.slug, filters.resetPage ? 1 : currentPage, newFilters);
    }
  };

  const renderNoQuestionsFound = () => {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-medium text-gray-200 mb-4">No Questions Found</h3>
          <p className="text-gray-400 mb-6">
            We couldn't find any questions matching your criteria. Try adjusting your filters or search for a different company.
          </p>
          <button
            onClick={() => handleFilterChange({ difficulty: 'all', minFrequency: 0, resetPage: true })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  };

  // Countdown timer for rate limit
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (rateLimitInfo.isRateLimited && rateLimitInfo.secondsLeft && rateLimitInfo.secondsLeft > 0) {
      intervalId = setInterval(() => {
        setRateLimitInfo(prev => {
          const newSecondsLeft = (prev.secondsLeft || 0) - 1;
          
          // If countdown reaches zero, clear the rate limit
          if (newSecondsLeft <= 0) {
            return { isRateLimited: false, resetTime: null, message: null, secondsLeft: null };
          }
          
          // Update the message with the new countdown
          return {
            ...prev,
            secondsLeft: newSecondsLeft,
            message: `Rate limit exceeded. Because of limited resources, please wait ${newSecondsLeft} seconds before trying again.`
          };
        });
      }, 1000);
    }
    
    // Clear interval on component unmount or when rate limit is cleared
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [rateLimitInfo.isRateLimited, rateLimitInfo.secondsLeft]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case "EASY":
        return "bg-green-500";
      case "MEDIUM":
        return "bg-blue-500";
      case "HARD":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get frequency color
  const getFrequencyColor = (frequency: number) => {
    if (frequency >= 75) return "text-red-500";
    if (frequency >= 50) return "text-yellow-500";
    if (frequency >= 25) return "text-green-500";
    return "text-gray-400";
  };

  // Fetch company tags for a specific question
  const fetchCompanyTags = async (titleSlug: string) => {
    const url = `https://leetcode.com/problems/${titleSlug}/`;

    setLoadingCompanyTags(prev => ({ ...prev, [titleSlug]: true }));
    
    try {
      // Make direct fetch call to see raw response
      const BASE = process.env.NEXT_PUBLIC_SERVER_URL;

      const response = await fetch(`${BASE}/api/company-tags?url=${encodeURIComponent(url)}`, {
        credentials: 'include', // Add credentials to send cookies
      });

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setCompanyTagsData(prev => ({
        ...prev,
        [titleSlug]: data
      }));
    } catch (error) {
      console.error("Error fetching company tags:", error);
    } finally {
      setLoadingCompanyTags(prev => ({ ...prev, [titleSlug]: false }));
    }
  };

  // Toggle showing detailed tags
  const toggleDetailedTags = (titleSlug: string) => {
    setShowDetailedTags(prev => ({ ...prev, [titleSlug]: !prev[titleSlug] }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Rate Limit Warning */}
      {rateLimitInfo.isRateLimited && (
        <div className="bg-red-900/50 border border-red-700 text-white p-4 rounded-lg mb-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
            <h3 className="font-medium">Rate Limit Exceeded</h3>
          </div>
          <p className="text-sm mb-2">Because of limited resources, we need to limit requests.</p>
          <div className="flex items-center justify-center text-sm mb-1">
            <Clock className="mr-2 h-4 w-4 text-red-300" />
            <span>
              {rateLimitInfo.secondsLeft ? 
                `Please wait ${rateLimitInfo.secondsLeft} seconds before trying again` : 
                'Please wait before making another request'}
            </span>
          </div>
        </div>
      )}
      
      {/* Company Search Input */}
      <div className="relative mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onClick={() => setShowResults(true)}
            placeholder="Search for a company..."
            className="w-full p-4 pl-12 pr-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            disabled={rateLimitInfo.isRateLimited}
          />
          <div className="absolute left-4 top-4 text-gray-400">
            <Search size={20} />
          </div>
        </div>

        {/* Search Results */}
        {showResults && searchTerm && (
          <div
            ref={searchResultsRef}
            className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          >
            {getFilteredCompanies().length > 0 ? (
              getFilteredCompanies().map((company) => (
                <div
                  key={company.slug}
                  className="px-4 py-3 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleCompanySelect(company)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white">{company.name}</span>
                    <span className="text-gray-400 text-sm">{company.questionCount} questions</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400">No companies found</div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      {selectedCompany && (
        <div className="mb-6">
          <CompanyQuestionsFilter 
            onFilterChange={handleFilterChange} 
            initialFilters={currentFilters}
            disabled={rateLimitInfo.isRateLimited}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-8">
          <SkeletonLoader />
        </div>
      )}

      {/* Error State */}
      {error && !rateLimitInfo.isRateLimited && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center my-8">
          <p>{error}</p>
        </div>
      )}

      {/* Questions List */}
      {!isLoading && selectedCompany && questions.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCompany.name} ({pagination?.total || 0} questions)
            </h2>
            <div className="text-gray-400">
              Showing {((pagination?.page || 1) - 1) * (pagination?.limit || 0) + 1} to {Math.min(
                (pagination?.page || 1) * (pagination?.limit || 0),
                pagination?.total || 0
              )} of {pagination?.total || 0} questions
            </div>
          </div>
          
          {/* Pagination - Moved to top */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mb-6 space-x-2">
              <button
                onClick={() => {
                  if (!rateLimitInfo.isRateLimited) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                disabled={!pagination.hasPrevPage || rateLimitInfo.isRateLimited}
                className={`px-4 py-2 rounded-md ${!pagination.hasPrevPage || rateLimitInfo.isRateLimited ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                Previous
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  // Logic to show pages around current page
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        if (!rateLimitInfo.isRateLimited) {
                          handlePageChange(pageNum);
                        }
                      }}
                      disabled={rateLimitInfo.isRateLimited}
                      className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : rateLimitInfo.isRateLimited ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => {
                  if (!rateLimitInfo.isRateLimited) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                disabled={!pagination.hasNextPage || rateLimitInfo.isRateLimited}
                className={`px-4 py-2 rounded-md ${!pagination.hasNextPage || rateLimitInfo.isRateLimited ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                Next
              </button>
            </div>
          )}

          <div className="grid gap-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`${getDifficultyColor(
                      question.difficulty
                    )} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}
                  >
                    {question.difficulty}
                  </span>
                  <a
                    href={`https://leetcode.com/problems/${question.titleSlug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {question.questionFrontendId}. {question.title}
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {question.frequency && (
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm mr-1">Frequency:</span>
                      <div className="relative w-24 h-2 bg-gray-700 rounded-full ml-auto">
                        <div 
                          className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${question.frequency}%` }}
                        ></div>
                      </div>
                      <span className={`ml-2 ${getFrequencyColor(question.frequency)} text-sm`}>
                        {question.frequency.toFixed(1)}%
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 ml-auto">
                    {question.topicTags.map((tag) => (
                      <span
                        key={tag.slug}
                        className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination at bottom - Removed as it's now at the top */}

      {/* No Questions State */}
      {!isLoading && selectedCompany && questions.length === 0 && !error && renderNoQuestionsFound()}

      {/* Initial State */}
      {!isLoading && !selectedCompany && !error && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">
            Search for a company to see their interview questions
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanySearch;

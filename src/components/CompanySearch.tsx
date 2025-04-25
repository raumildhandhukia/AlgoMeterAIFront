"use client";

import { useState, useEffect, useRef } from "react";
import { fetchCompanyQuestions } from "@/services/api";
import { CompanyTagsResponse } from "@/services/companyTags";
import companyData from "@/data/company.json";
import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import { Search, ChevronDown, ChevronUp, X, AlertCircle, Clock } from "lucide-react";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import CompanyQuestionsFilter from "@/components/CompanyQuestionsFilter";

// Type definitions
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
  link: string;
  frequency: number;
  companies: {
    company: string;
    slug: string;
    frequency: number;
  }[];
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface FilterOptions {
  match?: 'all' | 'any';
  minFrequency?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  topics?: string[];
}

interface CompanyQuestionsResponse {
  statusCode: number;
  success: boolean;
  slug: string;
  pagination?: PaginationInfo;
  questionCount?: number;
  problems?: Question[];
  error?: string;
  resetTime?: number;
  isRateLimited?: boolean;
}

const CompanySearch: React.FC = () => {
  // Core state
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    difficulty: 'all',
    minFrequency: 0,
    match: 'any'
  });
  
  // Rate limiting state
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isRateLimited: boolean;
    resetTime: number | null;
    message: string | null;
    secondsLeft: number | null;
  }>({ isRateLimited: false, resetTime: null, message: null, secondsLeft: null });
  
  // UI state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const [companyTagsData, setCompanyTagsData] = useState<Record<string, CompanyTagsResponse>>({});
  const [loadingCompanyTags, setLoadingCompanyTags] = useState<Record<string, boolean>>({});
  const [showDetailedTags, setShowDetailedTags] = useState<Record<string, boolean>>({});

  // Setup fuzzy search with Fuse.js
  const fuse = new Fuse(companyData.companyTags, {
    keys: ["name"],
    threshold: 0.3,
    includeScore: true,
  });

  const getFilteredCompanies = (): Company[] => {
    if (!searchTerm) return [];
    return fuse.search(searchTerm).slice(0, 10).map((result: FuseResult<Company>) => result.item);
  };

  // Core data fetching function
  const fetchQuestionsData = async (
    companySlugs: string[],
    page: number = 1,
    filters: FilterOptions = {}
  ) => {
    if (companySlugs.length === 0) {
      setQuestions([]);
      setPagination(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert filters for API
      const apiFilters: any = { ...filters };
      if (apiFilters.difficulty === 'all') {
        delete apiFilters.difficulty;
      }
      
      const response = await fetchCompanyQuestions(companySlugs, page, 100, apiFilters);
      
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
      
      if (response.success && response.problems) {
        setQuestions(response.problems);
        setPagination(response.pagination || null);
        setCurrentPage(page);
        setRateLimitInfo({ isRateLimited: false, resetTime: null, message: null, secondsLeft: null });
      } else {
        setError(response.error || 'Failed to fetch questions');
        setQuestions([]);
      }
    } catch (err) {
      setError('An error occurred while fetching questions');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Company selection handler
  const handleCompanySelect = (company: Company) => {
    // Get current selected companies
    const newSelectedCompanies = [...selectedCompanies];
    
    // Toggle selection
    if (newSelectedCompanies.includes(company.slug)) {
      newSelectedCompanies.splice(newSelectedCompanies.indexOf(company.slug), 1);
    } else {
      newSelectedCompanies.push(company.slug);
    }
    
    // Close dropdown and update search term
    setSearchTerm(company.name);
    setShowResults(false);
    
    // Update selected companies
    setSelectedCompanies(newSelectedCompanies);
    
    // Fetch data with new selection
    if (newSelectedCompanies.length > 0 && !rateLimitInfo.isRateLimited) {
      fetchQuestionsData(newSelectedCompanies, 1, currentFilters);
    }
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage || isLoading || rateLimitInfo.isRateLimited) return;
    fetchQuestionsData(selectedCompanies, page, currentFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter application handler
  const handleFilterChange = (filters: FilterOptions & {
    selectedCompanies?: string[],
    resetPage?: boolean
  }) => {
    if (rateLimitInfo.isRateLimited) return;
    
    // Create a copy of current filters
    const newFilters = { ...currentFilters };
    
    // Update filter values
    if (filters.difficulty) {
      newFilters.difficulty = filters.difficulty;
    }
    if (filters.minFrequency !== undefined) {
      newFilters.minFrequency = filters.minFrequency;
    }
    if (filters.match) {
      newFilters.match = filters.match;
    }
    if (filters.topics) {
      newFilters.topics = filters.topics;
    }
    
    // Update current filters in state
    setCurrentFilters(newFilters);
    
    // Update companies if provided
    let companiesForFetch = selectedCompanies;
    if (filters.selectedCompanies !== undefined) {
      companiesForFetch = filters.selectedCompanies;
      setSelectedCompanies(filters.selectedCompanies);
    }
    
    // Fetch data with new filters
    if (companiesForFetch.length > 0) {
      fetchQuestionsData(
        companiesForFetch, 
        filters.resetPage ? 1 : currentPage, 
        newFilters
      );
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

  // Rate limit countdown
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (rateLimitInfo.isRateLimited && rateLimitInfo.secondsLeft && rateLimitInfo.secondsLeft > 0) {
      intervalId = setInterval(() => {
        setRateLimitInfo(prev => {
          const newSecondsLeft = (prev.secondsLeft || 0) - 1;
          
          if (newSecondsLeft <= 0) {
            return { isRateLimited: false, resetTime: null, message: null, secondsLeft: null };
          }
          
          return {
            ...prev,
            secondsLeft: newSecondsLeft,
            message: `Rate limit exceeded. Because of limited resources, please wait ${newSecondsLeft} seconds before trying again.`
          };
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [rateLimitInfo.isRateLimited, rateLimitInfo.secondsLeft]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDifficultyColor = (difficulty: string): string => {
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

  const getFrequencyColor = (frequency: number): string => {
    if (frequency >= 75) return "text-red-500";
    if (frequency >= 50) return "text-yellow-500";
    if (frequency >= 25) return "text-green-500";
    return "text-gray-400";
  };

  const handleGetDetailedFrequency = (titleSlug: string): void => {
    if (!companyTagsData[titleSlug]) {
      fetchCompanyTags(titleSlug);
    }
    setShowDetailedTags((prev: Record<string, boolean>) => ({ ...prev, [titleSlug]: true }));
  };

  const fetchCompanyTags = async (titleSlug: string): Promise<void> => {
    const url = `https://leetcode.com/problems/${titleSlug}/`;

    setLoadingCompanyTags((prev: Record<string, boolean>) => ({ ...prev, [titleSlug]: true }));
    
    try {
      const response = await fetch(`/api/companyTags?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch company tags');
      }
      
      const data: CompanyTagsResponse = await response.json();
      
      setCompanyTagsData((prev: Record<string, CompanyTagsResponse>) => ({
        ...prev,
        [titleSlug]: data
      }));
      
    } catch (error) {
      console.error('Error fetching company tags:', error);
    } finally {
      setLoadingCompanyTags((prev: Record<string, boolean>) => ({ ...prev, [titleSlug]: false }));
    }
  };

  const toggleDetailedTags = (titleSlug: string): void => {
    setShowDetailedTags((prev: Record<string, boolean>) => ({ ...prev, [titleSlug]: !prev[titleSlug] }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
      
      <div className="relative mb-8">
        {/* <div className="relative">
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
        </div> */}

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

      <div className="mb-6">
        <CompanyQuestionsFilter 
          allCompanies={companyData.companyTags}
          selectedCompanies={selectedCompanies}
          currentFilters={currentFilters}
          onFilterChange={handleFilterChange}
          disabled={rateLimitInfo.isRateLimited}
          isRateLimited={rateLimitInfo.isRateLimited}
        />
      </div>

      {isLoading && (
        <div className="mb-8">
          <SkeletonLoader />
        </div>
      )}

      {error && !rateLimitInfo.isRateLimited && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center my-8">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && selectedCompanies.length > 0 && questions.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Questions from {selectedCompanies.length} companies ({pagination?.total || 0} questions)
            </h2>
            <div className="text-gray-400">
              Showing {((pagination?.page || 1) - 1) * (pagination?.limit || 0) + 1} to {Math.min(
                (pagination?.page || 1) * (pagination?.limit || 0),
                pagination?.total || 0
              )} of {pagination?.total || 0} questions
            </div>
          </div>
          
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
                  
                  <button
                    onClick={() => handleGetDetailedFrequency(question.titleSlug)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors ml-2"
                  >
                    {loadingCompanyTags[question.titleSlug] ? (
                      <span className="flex items-center">
                        <span className="w-3 h-3 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Loading...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Get Detailed Frequency
                        {showDetailedTags[question.titleSlug] ? (
                          <ChevronUp className="w-3 h-3 ml-1" />
                        ) : (
                          <ChevronDown className="w-3 h-3 ml-1" />
                        )}
                      </span>
                    )}
                  </button>
                 

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
                {showDetailedTags[question.titleSlug] && (
                  <div className="mt-4 bg-gray-750 p-3 rounded-md border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-white">Company Tags</h3>
                      <button 
                        onClick={() => toggleDetailedTags(question.titleSlug)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
 
                    {loadingCompanyTags[question.titleSlug] && (
                      <div className="flex justify-center items-center py-8">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-gray-300">Loading company data... It might take upto 30 seconds. Please be patient.</span>
                      </div>
                    )}
 
                    {!loadingCompanyTags[question.titleSlug] && !companyTagsData[question.titleSlug] && (
                      <div className="text-center py-4">
                        <p className="text-gray-400">No company data available</p>
                        <button 
                          onClick={() => fetchCompanyTags(question.titleSlug)}
                          className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    )}
 
                    {!loadingCompanyTags[question.titleSlug] && companyTagsData[question.titleSlug] && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Last 3 Months */}
                        <div className="bg-gray-800 p-3 rounded-md">
                          <h4 className="text-xs font-medium text-blue-400 mb-2">Last 3 Months</h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {companyTagsData[question.titleSlug]?.three_months?.length > 0 ? (
                              companyTagsData[question.titleSlug].three_months.map((tag, idx) => (
                                <div key={tag.slug || `three-month-${idx}`} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-300">{tag.name}</span>
                                  <span className="text-gray-400">{tag.timesEncountered} times</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-xs">No data available</p>
                            )}
                          </div>
                        </div>
 
                        {/* Last 6 Months */}
                        <div className="bg-gray-800 p-3 rounded-md">
                          <h4 className="text-xs font-medium text-yellow-400 mb-2">Last 6 Months</h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {companyTagsData[question.titleSlug]?.six_months?.length > 0 ? (
                              companyTagsData[question.titleSlug].six_months.map((tag, idx) => (
                                <div key={tag.slug || `six-month-${idx}`} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-300">{tag.name}</span>
                                  <span className="text-gray-400">{tag.timesEncountered} times</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-xs">No data available</p>
                            )}
                          </div>
                        </div>
 
                        {/* More than 6 Months */}
                        <div className="bg-gray-800 p-3 rounded-md">
                          <h4 className="text-xs font-medium text-green-400 mb-2">More than 6 Months</h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {companyTagsData[question.titleSlug]?.more_than_six_months?.length > 0 ? (
                              companyTagsData[question.titleSlug].more_than_six_months.map((tag, idx) => (
                                <div key={tag.slug || `more-than-six-${idx}`} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-300">{tag.name}</span>
                                  <span className="text-gray-400">{tag.timesEncountered} times</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-xs">No data available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && selectedCompanies.length > 0 && questions.length === 0 && !error && renderNoQuestionsFound()}

      {!isLoading && selectedCompanies.length === 0 && !error && (
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

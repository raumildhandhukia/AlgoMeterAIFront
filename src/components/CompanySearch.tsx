"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanyQuestions } from "@/services/api";
import { getCompanyTags, CompanyTagsResponse } from "@/services/companyTags";
import companyData from "@/data/company.json";
import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

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
  pagination: PaginationInfo;
  questionCount: number;
  questions: Question[];
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
    fetchQuestions(company.slug, 1);
  };

  const fetchQuestions = async (slug: string, page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchCompanyQuestions(slug, page);
      setQuestions(response.questions);
      setPagination(response.pagination);
    } catch (err) {
      setError("Failed to fetch questions. Please try again.");
      console.error("Error fetching questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (!selectedCompany) return;
    setCurrentPage(page);
    fetchQuestions(selectedCompany.slug, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    switch (difficulty) {
      case "EASY":
        return "bg-green-500";
      case "MEDIUM":
        return "bg-yellow-500";
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
    console.log(`Fetching company tags for: ${url}`);
    setLoadingCompanyTags(prev => ({ ...prev, [titleSlug]: true }));
    
    try {
      // Make direct fetch call to see raw response
      const BASE = process.env.NEXT_PUBLIC_SERVER_URL;
      console.log(`Direct API call to: ${BASE}/api/company-tags?url=${encodeURIComponent(url)}`);
      
      const response = await fetch(`${BASE}/api/company-tags?url=${encodeURIComponent(url)}`);
      console.log('Raw API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      debugger
      const rawData = await response.json();
      console.log('Raw API response data:', rawData);
      
      // Update state with data
      setCompanyTagsData(prev => {
        const updatedData = { ...prev, [titleSlug]: rawData };
        console.log('Updated company tags state:', updatedData);
        return updatedData;
      });
    } catch (err) {
      console.error("Error fetching company tags:", err);
      // Set empty data structure to avoid errors in rendering
      setCompanyTagsData(prev => ({
        ...prev,
        [titleSlug]: {
          three_months: [],
          six_months: [],
          more_than_six_months: []
        }
      }));
    } finally {
      setLoadingCompanyTags(prev => ({ ...prev, [titleSlug]: false }));
    }
  };

  // Toggle showing detailed tags
  const toggleDetailedTags = (titleSlug: string) => {
    setShowDetailedTags(prev => ({ ...prev, [titleSlug]: !prev[titleSlug] }));
  };

  // Handle Get Detailed Frequency button click
  const handleGetDetailedFrequency = (titleSlug: string) => {
    // Always fetch fresh data when the button is clicked
    fetchCompanyTags(titleSlug);
    // Show the detailed tags panel
    setShowDetailedTags(prev => ({ ...prev, [titleSlug]: true }));
  };

  return (
    <div className="w-full">
      <div className="relative max-w-2xl mx-auto mb-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search for a company (e.g., Google, Meta, Amazon...)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
        </div>

        {/* Search Results */}
        {showResults && searchTerm && (
          <div
            ref={searchResultsRef}
            className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          >
            {getFilteredCompanies().length > 0 ? (
              getFilteredCompanies().map((company: Company) => (
                <div
                  key={company.slug}
                  className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => handleCompanySelect(company)}
                >
                  <span className="text-white">{company.name}</span>
                  <span className="text-gray-400 text-sm">
                    {company.questionCount} questions
                  </span>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400">No companies found</div>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && selectedCompany && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCompany.name} (Loading questions...)
            </h2>
            <div className="text-gray-400">
              Loading questions...
            </div>
          </div>
          <SkeletonLoader />
        </div>
      )}

      {/* Error State */}
      {error && (
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mb-4">
              <div className="flex justify-end">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-md ${
                      pagination.hasPrevPage
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    // Show pages around current page
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
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-md ${
                      pagination.hasNextPage
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
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
                      <span className="ml-2 text-gray-400 text-sm">
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

                {/* Company Tags Detailed View */}
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

      {/* No Questions State */}
      {!isLoading && selectedCompany && questions.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">
            No questions found for {selectedCompany.name}
          </p>
        </div>
      )}

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

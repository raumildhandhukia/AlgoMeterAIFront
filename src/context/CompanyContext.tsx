"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { fetchCompanyQuestions } from '@/services/api';

// Define types
export interface Company {
  name: string;
  slug: string;
  questionCount: number;
}

export interface Question {
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

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterOptions {
  match?: 'all' | 'any';
  minFrequency?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  topics?: string[];
}

// API filter options (without 'all' for difficulty)
export interface ApiFilterOptions {
  match?: 'all' | 'any';
  minFrequency?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  topics?: string[];
}

// Context interface
interface CompanyContextType {
  selectedCompanies: string[];
  questions: Question[];
  pagination: PaginationInfo | null;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  currentFilters: FilterOptions;
  rateLimitInfo: {
    isRateLimited: boolean;
    resetTime: number | null;
    message: string | null;
    secondsLeft: number | null;
  };
  setSelectedCompanies: (companies: string[]) => void;
  addCompany: (slug: string) => void;
  removeCompany: (slug: string) => void;
  fetchQuestions: (page?: number, filters?: FilterOptions) => Promise<void>;
  applyFilters: (filters: FilterOptions & { selectedCompanies?: string[], resetPage?: boolean }) => void;
  resetFilters: () => void;
}

// Create context with default values
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provider component
export const CompanyProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({});
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isRateLimited: boolean;
    resetTime: number | null;
    message: string | null;
    secondsLeft: number | null;
  }>({ isRateLimited: false, resetTime: null, message: null, secondsLeft: null });

  // Add a single company
  const addCompany = useCallback((slug: string) => {
    setSelectedCompanies(prev => {
      if (prev.includes(slug)) return prev;
      return [...prev, slug];
    });
  }, []);

  // Remove a single company
  const removeCompany = useCallback((slug: string) => {
    setSelectedCompanies(prev => prev.filter(company => company !== slug));
  }, []);

  // Fetch questions with current companies and filters
  const fetchQuestions = useCallback(async (
    page: number = currentPage,
    filters: FilterOptions = currentFilters
  ) => {
    // If no companies are selected, we'll fetch all companies data
    // by not passing the slug parameter

    setIsLoading(true);
    setError(null);
    
    try {
      // Convert FilterOptions to ApiFilterOptions (remove 'all' from difficulty)
      const apiFilters: ApiFilterOptions = {
        match: filters.match,
        minFrequency: filters.minFrequency,
        topics: filters.topics
      };
      
      // Only add difficulty if it's not 'all'
      if (filters.difficulty && filters.difficulty !== 'all') {
        apiFilters.difficulty = filters.difficulty;
      }
      
      // Pass the selectedCompanies array to the API, which will handle empty array case
      // When selectedCompanies is empty, the API will fetch all companies data
      const response = await fetchCompanyQuestions(selectedCompanies, page, 100, apiFilters);
      
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
        if (page !== currentPage) {
          setCurrentPage(page);
        }
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
  }, [selectedCompanies, currentPage, currentFilters]);

  // Apply filters and fetch questions
  const applyFilters = useCallback((filters: FilterOptions & { 
    selectedCompanies?: string[],
    resetPage?: boolean
  }) => {
    if (rateLimitInfo.isRateLimited) return;
    
    const newPage = filters.resetPage ? 1 : currentPage;
    if (filters.resetPage) {
      setCurrentPage(1);
    }
    
    const newFilters: FilterOptions = {};
    
    if (filters.difficulty && filters.difficulty !== 'all') {
      newFilters.difficulty = filters.difficulty;
    }
    
    if (filters.minFrequency !== undefined && filters.minFrequency > 0) {
      newFilters.minFrequency = filters.minFrequency;
    }
    
    if (filters.match) {
      newFilters.match = filters.match;
    }
    
    if (filters.topics && filters.topics.length > 0) {
      newFilters.topics = filters.topics;
    }
    
    setCurrentFilters(newFilters);
    
    // Update selected companies if provided
    if (filters.selectedCompanies !== undefined) {
      setSelectedCompanies(filters.selectedCompanies);
      // Fetch with the new companies and filters
      fetchQuestions(newPage, newFilters);
    } else {
      // Fetch with existing companies but new filters
      fetchQuestions(newPage, newFilters);
    }
  }, [fetchQuestions, currentPage, rateLimitInfo.isRateLimited]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setCurrentFilters({});
    fetchQuestions(1, {});
    setCurrentPage(1);
  }, [fetchQuestions]);

  // Context value
  const value = {
    selectedCompanies,
    questions,
    pagination,
    currentPage,
    isLoading,
    error,
    currentFilters,
    rateLimitInfo,
    setSelectedCompanies,
    addCompany,
    removeCompany,
    fetchQuestions,
    applyFilters,
    resetFilters
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use the context
export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
};

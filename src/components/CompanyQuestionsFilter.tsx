import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Difficulty, MatchType } from "../types";

// Time period options for filtering
export type TimePeriod = "all-time" | "thirty-days" | "three-months" | "six-months" | "more-than-six-months";

interface Company {
  name: string;
  slug: string;
  questionCount: number;
}

interface CompanyOption {
  value: string; // slug
  label: string; // name
}

interface FilterOptions {
  match?: MatchType;
  minFrequency?: number;
  difficulty?: Difficulty | "all";
  topics?: string[];
  timePeriod?: TimePeriod;
}

interface CompanyQuestionsFilterProps {
  allCompanies: Company[];
  selectedCompanies: string[];
  currentFilters: FilterOptions;
  onFilterChange: (filters: {
    match?: MatchType;
    minFrequency?: number;
    difficulty?: Difficulty | "all";
    topics?: string[];
    selectedCompanies?: string[];
    timePeriod?: TimePeriod;
    resetPage?: boolean;
  }) => void;
  disabled?: boolean;
  isRateLimited?: boolean;
}

// Common topics for algorithms and data structures
const commonTopics = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Database",
  "Matrix",
  "Tree",
  "Breadth-First Search",
  "Bit Manipulation",
  "Two Pointers",
  "Prefix Sum",
  "Heap (Priority Queue)",
  "Simulation",
  "Binary Tree",
  "Stack",
  "Counting",
  "Graph",
  "Sliding Window",
  "Design",
  "Enumeration",
  "Backtracking",
  "Union Find",
  "Linked List",
  "Ordered Set",
  "Number Theory",
  "Monotonic Stack",
  "Segment Tree",
  "Trie",
  "Combinatorics",
  "Bitmask",
  "Queue",
  "Recursion",
  "Divide and Conquer",
  "Binary Indexed Tree",
  "Memoization",
  "Geometry",
  "Binary Search Tree",
  "Hash Function",
  "String Matching",
  "Topological Sort",
  "Shortest Path",
  "Rolling Hash",
  "Game Theory",
  "Interactive",
  "Data Stream",
  "Monotonic Queue",
  "Brainteaser",
  "Doubly-Linked List",
  "Randomized",
  "Merge Sort",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Probability and Statistics",
  "Quickselect",
  "Suffix Array",
  "Line Sweep",
  "Bucket Sort",
  "Minimum Spanning Tree",
  "Shell",
  "Reservoir Sampling",
  "Strongly Connected Component",
  "Eulerian Circuit",
  "Radix Sort",
  "Rejection Sampling",
  "Biconnected Component",
];

const CompanyQuestionsFilter: React.FC<CompanyQuestionsFilterProps> = ({
  allCompanies,
  selectedCompanies,
  currentFilters,
  onFilterChange,
  disabled = false,
  isRateLimited = false,
}) => {
  // Local state for filter values
  const [difficulty, setDifficulty] = useState<Difficulty | "all">(
    currentFilters.difficulty || "all"
  );
  const [frequency, setFrequency] = useState<number>(
    currentFilters.minFrequency || 0
  );
  const [matchType, setMatchType] = useState<MatchType>(
    currentFilters.match || "any"
  );
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    currentFilters.timePeriod || "all-time"
  );

  // State for selected company options in the format react-select expects
  const [selectedCompanyOptions, setSelectedCompanyOptions] = useState<
    CompanyOption[]
  >([]);

  // State for topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    currentFilters.topics || []
  );
  const [topicSearchTerm, setTopicSearchTerm] = useState<string>("");

  // Sort companies by question count in descending order
  const sortedCompanies = useMemo(() => {
    return [...allCompanies].sort((a, b) => b.questionCount - a.questionCount);
  }, [allCompanies]);

  // State for company search term
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filtered companies based on search term and prioritizing selected companies
  const filteredCompanies = useMemo(() => {
    let companies = sortedCompanies;

    // Filter by search term if provided
    if (searchTerm.trim()) {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      companies = companies.filter((company) =>
        company.name.toLowerCase().includes(normalizedSearchTerm)
      );
    }

    // Sort to prioritize selected companies
    return [...companies].sort((a, b) => {
      // If one is selected and the other is not, prioritize the selected one
      if (
        selectedCompanies.includes(a.slug) &&
        !selectedCompanies.includes(b.slug)
      )
        return -1;
      if (
        !selectedCompanies.includes(a.slug) &&
        selectedCompanies.includes(b.slug)
      )
        return 1;

      // If both are selected or both are not selected, maintain the original sort order
      return b.questionCount - a.questionCount;
    });
  }, [sortedCompanies, searchTerm, selectedCompanies]);

  // Filtered topics based on search term and prioritizing selected topics
  const filteredTopics = useMemo(() => {
    // Filter by search term if provided
    let topics = commonTopics;
    if (topicSearchTerm.trim()) {
      const normalizedSearchTerm = topicSearchTerm.toLowerCase();
      topics = topics.filter((topic) =>
        topic.toLowerCase().includes(normalizedSearchTerm)
      );
    }

    // Sort to prioritize selected topics
    return [...topics].sort((a, b) => {
      // If one is selected and the other is not, prioritize the selected one
      if (selectedTopics.includes(a) && !selectedTopics.includes(b)) return -1;
      if (!selectedTopics.includes(a) && selectedTopics.includes(b)) return 1;

      // If both are selected or both are not selected, maintain alphabetical order
      return a.localeCompare(b);
    });
  }, [topicSearchTerm, selectedTopics]);

  // Update local state when context filters change
  useEffect(() => {
    if (currentFilters.difficulty) {
      setDifficulty(currentFilters.difficulty);
    }
    if (currentFilters.minFrequency !== undefined) {
      setFrequency(currentFilters.minFrequency);
    }
    if (currentFilters.match) {
      setMatchType(currentFilters.match);
    }
    if (currentFilters.topics) {
      setSelectedTopics(currentFilters.topics);
    }
    if (currentFilters.timePeriod) {
      setTimePeriod(currentFilters.timePeriod);
    }
  }, [currentFilters]);

  // Debounce timer reference
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Apply filters automatically when difficulty, match type, or time period changes (immediately)
  useEffect(() => {
    if (isRateLimited) return;

    // Don't apply filters on initial render
    if (
      difficulty === currentFilters.difficulty &&
      matchType === currentFilters.match &&
      timePeriod === currentFilters.timePeriod
    ) {
      return;
    }

    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, matchType, timePeriod]);

  // Apply filters with debounce when frequency changes
  useEffect(() => {
    if (isRateLimited) return;

    // Don't apply filters on initial render
    if (frequency === currentFilters.minFrequency) {
      return;
    }

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      applyFilters();
    }, 300); // 300ms debounce time

    // Cleanup function to clear the timer if component unmounts
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequency]);

  // Function to get color for difficulty buttons based on MEMORY preferences
  const getDifficultyColor = (diff: Difficulty | "all") => {
    const isSelected = difficulty === diff;
    switch (diff) {
      case "easy":
        return isSelected
          ? "bg-green-600 shadow-md text-white ring-2 ring-green-300"
          : "bg-gray-700 hover:bg-green-700/60 text-gray-300";
      case "medium":
        return isSelected
          ? "bg-blue-600 shadow-md text-white ring-2 ring-blue-300"
          : "bg-gray-700 hover:bg-blue-700/60 text-gray-300";
      case "hard":
        return isSelected
          ? "bg-red-600 shadow-md text-white ring-2 ring-red-300"
          : "bg-gray-700 hover:bg-red-700/60 text-gray-300";
      case "all":
        return isSelected
          ? "bg-gray-500 shadow-md text-white ring-2 ring-gray-300"
          : "bg-gray-700 hover:bg-gray-600 text-gray-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  // Function to apply filters
  const applyFilters = () => {
    if (isRateLimited) return;

    const filters: {
      match?: MatchType;
      minFrequency?: number;
      difficulty?: Difficulty | "all";
      topics?: string[];
      selectedCompanies?: string[];
      timePeriod?: TimePeriod;
      resetPage?: boolean;
    } = { resetPage: true }; // Always reset page on applying filters

    // Always include difficulty in filters, even when it's 'all'
    filters.difficulty = difficulty;
    filters.minFrequency = frequency;
    filters.match = matchType;
    filters.timePeriod = timePeriod;

    // Use the selectedCompanies prop to maintain company selection
    filters.selectedCompanies = selectedCompanies;

    // Only include topics if there are selected topics
    if (selectedTopics.length > 0) {
      filters.topics = selectedTopics;
    }

    // Call parent's onFilterChange function
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    if (isRateLimited) return;

    // Reset all filter values
    setDifficulty("all");
    setFrequency(0);
    setMatchType("any");
    setSelectedTopics([]);
    setTimePeriod("all-time");
    setSelectedCompanyOptions([]); // Clear selected companies in the dropdown

    // Apply the reset filters
    onFilterChange({
      difficulty: "all",
      minFrequency: 0,
      match: "any",
      topics: [],
      selectedCompanies: [],
      timePeriod: "all-time",
      resetPage: true,
    });
  };

  // Function to toggle company selection
  const toggleCompanySelection = (slug: string) => {
    if (isRateLimited) return;

    let newSelectedCompanies: string[];

    if (selectedCompanies.includes(slug)) {
      // Remove company if already selected
      newSelectedCompanies = selectedCompanies.filter((s) => s !== slug);
    } else {
      // Add company if not selected
      newSelectedCompanies = [...selectedCompanies, slug];
    }

    // Apply filters with updated company selection
    const filters: {
      match?: MatchType;
      minFrequency?: number;
      difficulty?: Difficulty | "all";
      topics?: string[];
      selectedCompanies?: string[];
      timePeriod?: TimePeriod;
      resetPage?: boolean;
    } = { resetPage: true };

    // Always include difficulty in filters, even when it's 'all'
    filters.difficulty = difficulty;
    filters.minFrequency = frequency;
    filters.match = matchType;
    filters.timePeriod = timePeriod;
    filters.selectedCompanies = newSelectedCompanies;

    // Only include topics if there are selected topics
    if (selectedTopics.length > 0) {
      filters.topics = selectedTopics;
    }

    onFilterChange(filters);
  };

  // Function to toggle topic selection
  const toggleTopicSelection = (topic: string) => {
    if (isRateLimited) return;

    let newSelectedTopics: string[];

    if (selectedTopics.includes(topic)) {
      // Remove topic if already selected
      newSelectedTopics = selectedTopics.filter((t) => t !== topic);
    } else {
      // Add topic if not selected
      newSelectedTopics = [...selectedTopics, topic];
    }

    setSelectedTopics(newSelectedTopics);

    // Apply filters with updated topic selection
    const filters: {
      match?: MatchType;
      minFrequency?: number;
      difficulty?: Difficulty | "all";
      topics?: string[];
      selectedCompanies?: string[];
      timePeriod?: TimePeriod;
      resetPage?: boolean;
    } = { resetPage: true };

    // Always include difficulty in filters, even when it's 'all'
    filters.difficulty = difficulty;
    filters.minFrequency = frequency;
    filters.match = matchType;
    filters.timePeriod = timePeriod;

    // Always include topics array (empty or with values)
    filters.topics = newSelectedTopics;

    // Use the selectedCompanies prop directly
    filters.selectedCompanies = selectedCompanies;

    onFilterChange(filters);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700 space-y-5">
      {/* Company Selection with Labels */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">Companies</label>
          <div className="text-xs text-gray-400">
            Selected: {selectedCompanies.length}
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-3">
          <input
            type="text"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disabled}
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              onClick={() => setSearchTerm("")}
              disabled={disabled}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Company labels */}
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <motion.button
                key={company.slug}
                onClick={() => toggleCompanySelection(company.slug)}
                disabled={disabled}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200
                  ${
                    selectedCompanies.includes(company.slug)
                      ? "bg-blue-600 text-white shadow-md ring-1 ring-blue-300"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                whileHover={!disabled ? { scale: 1.02 } : undefined}
                whileTap={!disabled ? { scale: 0.98 } : undefined}
              >
                <span>{company.name}</span>
              </motion.button>
            ))
          ) : (
            <div className="w-full text-center py-2 text-gray-400 text-sm">
              No companies found
            </div>
          )}
        </div>
      </div>

      {/* Topics Selection with Labels */}
      <div className="mt-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">Topics</label>
          <div className="text-xs text-gray-400">
            Selected: {selectedTopics.length}
          </div>
        </div>

        {/* Search input for topics */}
        <div className="relative mb-3">
          <input
            type="text"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search topics..."
            value={topicSearchTerm}
            onChange={(e) => setTopicSearchTerm(e.target.value)}
            disabled={disabled}
          />
          {topicSearchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              onClick={() => setTopicSearchTerm("")}
              disabled={disabled}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Topic labels */}
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <motion.button
                key={topic}
                onClick={() => toggleTopicSelection(topic)}
                disabled={disabled}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200
                  ${
                    selectedTopics.includes(topic)
                      ? "bg-purple-600 text-white shadow-md ring-1 ring-purple-300"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                whileHover={!disabled ? { scale: 1.02 } : undefined}
                whileTap={!disabled ? { scale: 0.98 } : undefined}
              >
                <span>{topic}</span>
              </motion.button>
            ))
          ) : (
            <div className="w-full text-center py-2 text-gray-400 text-sm">
              No topics found
            </div>
          )}
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="mt-5 w-full">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-300">Time Period</label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
          {[
            { id: "all-time", label: "All Time" },
            { id: "thirty-days", label: "30 Days" },
            { id: "three-months", label: "3 Months" },
            { id: "six-months", label: "6 Months" },
            { id: "more-than-six-months", label: "More than 6 Months" }
          ].map((period) => (
            <motion.button
              key={period.id}
              onClick={() => !disabled && setTimePeriod(period.id as TimePeriod)}
              disabled={disabled}
              className={`
                w-full px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                ${
                  timePeriod === period.id
                    ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-300"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              whileHover={!disabled ? { scale: 1.02 } : undefined}
              whileTap={!disabled ? { scale: 0.98 } : undefined}
            >
              {period.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Combined Difficulty and Frequency Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 items-start">
        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty
          </label>
          {/* Container for difficulty buttons in a column layout */}
          <div className="flex flex-col space-y-2">
            {/* 'All' button on top with full width */}
            <motion.button
              onClick={() => !disabled && setDifficulty("all")}
              disabled={disabled}
              className={`w-[95%] mx-auto px-3 py-2.5 rounded-md text-sm font-medium transition-all ${getDifficultyColor(
                "all"
              )} ${
                difficulty === "all"
                  ? "transform scale-105 shadow-md"
                  : "opacity-80 hover:opacity-100"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              All
            </motion.button>

            {/* Individual difficulty buttons in a row */}
            <div className="flex space-x-2">
              {["easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => !disabled && setDifficulty(diff as Difficulty)}
                  disabled={disabled}
                  // Use flex-1 to make buttons share space equally
                  className={`flex-1 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${getDifficultyColor(
                    diff as Difficulty
                  )} ${
                    difficulty === diff
                      ? "transform scale-105"
                      : "opacity-80 hover:opacity-100"
                  } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}{" "}
                  {/* Capitalize for display */}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Frequency */}
        <div className="mt-6 md:mt-0">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Minimum Frequency
          </label>

          <div className="relative flex items-center w-full">
            {/* Slider container */}
            <div className="relative w-full h-10">
              {/* Glowing track background */}
              <motion.div
                className="absolute w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)] z-0 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Animated gradient fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                  style={{ width: `${frequency}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${frequency}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                />
              </motion.div>



              {/* Actual range input (invisible but functional) */}
              <input
                type="range"
                min="0"
                max="100"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                disabled={disabled}
                className={`absolute w-full h-8 top-1/2 -translate-y-1/2 opacity-0 ${
                  disabled ? "cursor-not-allowed" : "cursor-pointer"
                } z-20`}
              />

              {/* Vertical line indicator with percentage */}
              <div className="absolute z-10" style={{ left: `${frequency}%`, transform: 'translateX(-50%)' }}>
                {/* Vertical line */}
                <motion.div
                  className="w-0.5 bg-white shadow-[0_0_8px_rgba(79,70,229,0.5)] rounded-full mx-auto"
                  style={{
                    height: "12px",
                    marginTop: "calc(50% - 4px)",
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: "12px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                />
                {/* Percentage bubble */}
                <motion.div
                  className="bg-indigo-600 text-white text-xs font-medium rounded-full px-2 py-1 shadow-lg flex items-center justify-center mt-1"
                  initial={{ opacity: 0, y: -5, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {frequency}%
                </motion.div>
              </div>
            </div>


          </div>
        </div>
      </div>



      {/* Reset Button */}
      <div className="flex items-center self-start md:self-center md:mr-4 mt-6 md:mt-0">
        <motion.button
          onClick={handleResetFilters}
          disabled={disabled}
          className={`${
            disabled ? "bg-red-500/50 cursor-not-allowed" : "bg-red-500"
          } text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-md w-20 h-9 flex items-center justify-center`}
          whileHover={
            !disabled ? { scale: 1.03, backgroundColor: "#ef4444" } : undefined
          }
          whileTap={!disabled ? { scale: 0.97 } : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
};

export default CompanyQuestionsFilter;

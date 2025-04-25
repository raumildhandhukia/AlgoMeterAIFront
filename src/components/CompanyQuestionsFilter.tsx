import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Difficulty, MatchType } from '../types';



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
  difficulty?: Difficulty | 'all';
  topics?: string[];
}

interface CompanyQuestionsFilterProps {
  allCompanies: Company[];
  selectedCompanies: string[];
  currentFilters: FilterOptions;
  onFilterChange: (filters: {
    match?: MatchType;
    minFrequency?: number;
    difficulty?: Difficulty | 'all';
    topics?: string[];
    selectedCompanies?: string[];
    resetPage?: boolean;
  }) => void;
  disabled?: boolean;
  isRateLimited?: boolean;
}

const animatedComponents = makeAnimated();

const CompanyQuestionsFilter: React.FC<CompanyQuestionsFilterProps> = ({
  allCompanies,
  selectedCompanies,
  currentFilters,
  onFilterChange,
  disabled = false,
  isRateLimited = false,
}) => {
  // Local state for filter values
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>(currentFilters.difficulty || 'all');
  const [frequency, setFrequency] = useState<number>(currentFilters.minFrequency || 0);
  const [matchType, setMatchType] = useState<MatchType>(currentFilters.match || 'any');
  
  // State for selected company options in the format react-select expects
  const [selectedCompanyOptions, setSelectedCompanyOptions] = useState<CompanyOption[]>([]);
  
  // Convert allCompanies to the format needed by react-select
  const companyOptions: CompanyOption[] = useMemo(() => allCompanies.map(company => ({
    value: company.slug,
    label: company.name,
  })), [allCompanies]);
  
  // Effect to synchronize internal selected options with context's selected companies
  useEffect(() => {
    if (selectedCompanies && selectedCompanies.length > 0) {
      const options = companyOptions.filter(option => 
        selectedCompanies.includes(option.value)
      );
      setSelectedCompanyOptions(options);
    } else {
      setSelectedCompanyOptions([]);
    }
  }, [selectedCompanies, companyOptions]); // Rerun if context selection or all companies change
  
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
  }, [currentFilters]);

  // Function to get color for difficulty buttons based on MEMORY preferences
  const getDifficultyColor = (diff: Difficulty | 'all') => {
    const isSelected = difficulty === diff;
    switch (diff) {
      case 'easy':
        return isSelected ? 'bg-green-600 shadow-md text-white ring-2 ring-green-300' : 'bg-gray-700 hover:bg-green-700/60 text-gray-300';
      case 'medium':
        return isSelected ? 'bg-blue-600 shadow-md text-white ring-2 ring-blue-300' : 'bg-gray-700 hover:bg-blue-700/60 text-gray-300';
      case 'hard':
        return isSelected ? 'bg-red-600 shadow-md text-white ring-2 ring-red-300' : 'bg-gray-700 hover:bg-red-700/60 text-gray-300';
      case 'all':
        return isSelected ? 'bg-gray-500 shadow-md text-white ring-2 ring-gray-300' : 'bg-gray-700 hover:bg-gray-600 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const handleApplyFilters = () => {
    if (isRateLimited) return;
    
    const filters: {
      match?: MatchType;
      minFrequency?: number;
      difficulty?: Difficulty | 'all';
      selectedCompanies?: string[];
      resetPage?: boolean;
    } = { resetPage: true }; // Always reset page on applying filters

    if (difficulty !== 'all') {
      filters.difficulty = difficulty;
    }
    filters.minFrequency = frequency;
    filters.match = matchType;

    // Get slugs from selected options
    filters.selectedCompanies = selectedCompanyOptions?.map(option => option.value) || [];

    // Call parent's onFilterChange function
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    if (isRateLimited) return;
    
    setDifficulty('all');
    setFrequency(0);
    setMatchType('any');
    setSelectedCompanyOptions([]); // Clear selected companies in the dropdown
    
    // Call parent's onFilterChange function with reset values
    onFilterChange({ 
      resetPage: true, 
      difficulty: 'all', 
      minFrequency: 0, 
      match: 'any', 
      selectedCompanies: [] // Pass back empty array for companies
    });
  };

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#1f2937', // bg-gray-800
      borderColor: state.isFocused ? '#3b82f6' : '#4b5563', // focus:border-blue-500, border-gray-600
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: '#6b7280', // hover:border-gray-500
      },
      minHeight: '42px',
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '2px 8px',
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#374151', // bg-gray-700
      borderRadius: '4px',
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#d1d5db', // text-gray-300
      fontSize: '0.875rem',
      padding: '2px 6px',
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#9ca3af', // text-gray-400
      ':hover': {
        backgroundColor: '#4b5563', // hover:bg-gray-600
        color: '#f3f4f6', // hover:text-gray-100
        borderRadius: '0 4px 4px 0',
      },
    }),
    input: (base: any) => ({
      ...base,
      color: '#f3f4f6', // text-gray-100
      margin: '0px',
      padding: '0px',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#6b7280', // text-gray-500
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#1f2937', // bg-gray-800
      borderRadius: '6px',
      border: '1px solid #4b5563', // border-gray-600
      marginTop: '4px',
      zIndex: 20, // Ensure dropdown is above other elements
    }),
    menuList: (base: any) => ({
      ...base,
      padding: '4px',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#374151' : state.isSelected ? '#2563eb' : 'transparent', // focus:bg-gray-700, selected:bg-blue-600
      color: state.isSelected ? '#ffffff' : '#d1d5db', // selected:text-white, text-gray-300
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      ':active': {
        backgroundColor: '#1e40af', // active:bg-blue-800
      },
    }),
    noOptionsMessage: (base: any) => ({
      ...base,
      color: '#9ca3af', // text-gray-400
      padding: '8px 12px',
    }),
  };

  return (
    <div className="p-4 md:p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700 space-y-5">
      {/* Company Multi-Select */}
      <div>
        <label htmlFor="company-select" className="block text-sm font-medium text-gray-300 mb-2">
          Companies
        </label>
        <Select
          id="company-select"
          instanceId="company-select-instance"
          options={companyOptions}
          isMulti
          components={animatedComponents}
          value={selectedCompanyOptions}
          onChange={(selected) => {
            const newSelection = selected as CompanyOption[] || [];
            setSelectedCompanyOptions(newSelection);
          }}
          placeholder="Select companies..."
          styles={selectStyles}
          isDisabled={disabled}
          closeMenuOnSelect={false} // Keep menu open for multiple selections
        />
      </div>
      
      {/* Combined Difficulty and Frequency Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 items-end">
        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty
          </label>
          {/* Container for difficulty buttons */}
          <div className="flex flex-col space-y-2">
            <motion.button
              onClick={() => !disabled && setDifficulty('all')}
              disabled={disabled}
              // Make 'All' button full width within its container
              className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-all ${getDifficultyColor('all')} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              All
            </motion.button>
            
            {/* Difficulty buttons in a row below 'All' */}
            <div className="flex space-x-2">
              {['easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => !disabled && setDifficulty(diff as Difficulty)}
                  disabled={disabled}
                  // Use flex-1 to make buttons share space equally
                  className={`flex-1 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${getDifficultyColor(diff as Difficulty)} ${difficulty === diff ? 'transform scale-105' : 'opacity-80 hover:opacity-100'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)} { /* Capitalize for display */}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="mt-6 md:mt-0 md:ml-16 md:pl-16">
          <motion.span 
            className="text-gray-400 text-sm block mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Minimum Frequency
          </motion.span>
          
          <div className="relative flex items-center">
            {/* Slider container */}
            <div className="relative w-64 h-10">
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
                  initial={{ width: '0%' }}
                  animate={{ width: `${frequency}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                />
              </motion.div>
              
              {/* Marker points */}
              <div className="absolute w-full top-8 flex justify-between px-1">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <motion.div 
                    key={mark}
                    className={`h-3 w-1 rounded-full ${frequency >= mark ? 'bg-indigo-400' : 'bg-gray-600'}`}
                    initial={{ height: 0 }}
                    animate={{ height: frequency >= mark ? 8 : 5 }}
                    transition={{ delay: mark * 0.005, duration: 0.2 }}
                  />
                ))}
              </div>
              
              {/* Labels */}
              <div className="absolute w-full top-12 flex justify-between text-xs">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <motion.span 
                    key={mark}
                    className={`${frequency >= mark ? 'text-indigo-300' : 'text-gray-500'} text-center w-6 -ml-3`}
                    style={{ left: `${mark}%` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + mark * 0.01 }}
                  >
                    {mark}%
                  </motion.span>
                ))}
              </div>
              
              {/* Actual range input (invisible but functional) */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                disabled={disabled}
                className={`absolute w-full h-8 top-1/2 -translate-y-1/2 opacity-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} z-20`}
              />
              
              {/* Vertical line indicator */}
              <motion.div 
                className="absolute h-8 w-0.5 bg-white shadow-[0_0_8px_rgba(79,70,229,0.5)] z-10 top-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${frequency}%` }}
                initial={{ height: 0 }}
                animate={{ height: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              />
            </div>
            
            {/* Value display - positioned to the right */}
            <div className="ml-4">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={frequency}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full font-medium text-sm shadow-lg"
                  initial={{ opacity: 0, x: -10, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {frequency}%
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-4 self-start md:self-center md:mr-4 mt-6 md:mt-0">
        <motion.button 
          onClick={handleApplyFilters} 
          disabled={disabled}
          className={`${disabled ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-500'} text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-md w-32 h-9 flex items-center justify-center`}
          whileHover={!disabled ? { scale: 1.03, backgroundColor: '#3b82f6' } : undefined}
          whileTap={!disabled ? { scale: 0.97 } : undefined}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          Apply Filters
        </motion.button>
        <motion.button 
          onClick={handleResetFilters} 
          disabled={disabled}
          className={`${disabled ? 'bg-red-500/50 cursor-not-allowed' : 'bg-red-500'} text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-md w-20 h-9 flex items-center justify-center`}
          whileHover={!disabled ? { scale: 1.03, backgroundColor: '#ef4444' } : undefined}
          whileTap={!disabled ? { scale: 0.97 } : undefined}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
};

export default CompanyQuestionsFilter;

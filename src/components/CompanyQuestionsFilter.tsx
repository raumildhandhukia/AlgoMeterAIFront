import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const ALL_DIFFICULTIES = ['all', ...DIFFICULTIES];

interface CompanyQuestionsFilterProps {
  initialFilters?: {
    minFrequency?: number, 
    difficulty?: 'easy' | 'medium' | 'hard' | 'all'
  };
  onFilterChange: (filters: {
    minFrequency?: number, 
    difficulty?: 'easy' | 'medium' | 'hard' | 'all',
    resetPage?: boolean
  }) => void;
  disabled?: boolean;
}

const CompanyQuestionsFilter: React.FC<CompanyQuestionsFilterProps> = ({ 
  initialFilters = {}, 
  onFilterChange,
  disabled = false
}) => {
  const [difficulty, setDifficulty] = useState<string | null>(initialFilters.difficulty || 'all');
  const [minFrequency, setMinFrequency] = useState<number>(initialFilters.minFrequency || 0);
  const [tempDifficulty, setTempDifficulty] = useState<string | null>(initialFilters.difficulty || 'all');
  const [tempMinFrequency, setTempMinFrequency] = useState<number>(initialFilters.minFrequency || 0);

  // Use a ref to track if this is the initial mount of the component
  const isInitialMount = useRef(true);
  const prevInitialFiltersRef = useRef(initialFilters);
  
  // Initialize state from initialFilters only on first render or company change
  useEffect(() => {
    // On initial mount, set the filters from initialFilters
    if (isInitialMount.current) {
      setDifficulty(initialFilters.difficulty || 'all');
      setMinFrequency(initialFilters.minFrequency || 0);
      setTempDifficulty(initialFilters.difficulty || 'all');
      setTempMinFrequency(initialFilters.minFrequency || 0);
      isInitialMount.current = false;
      return;
    }
    
    // Only reset filters when company changes (initialFilters becomes empty)
    // This prevents the filter from resetting during page changes
    const prevEmpty = Object.keys(prevInitialFiltersRef.current).length === 0;
    const currentEmpty = Object.keys(initialFilters).length === 0;
    
    // If we're going from having filters to no filters, it's a company change
    if (!prevEmpty && currentEmpty) {
      setDifficulty('all');
      setMinFrequency(0);
      setTempDifficulty('all');
      setTempMinFrequency(0);
    }
    
    // Update the ref
    prevInitialFiltersRef.current = initialFilters;
  }, [JSON.stringify(initialFilters)]);

  const handleDifficultyChange = (diff: string) => {
    // If 'all' is selected, set difficulty to 'all'
    // If clicking the same difficulty, deselect it (set to 'all')
    // Otherwise select the new difficulty
    if (diff === 'all') {
      setTempDifficulty('all');
    } else if (tempDifficulty === diff) {
      // If clicking the same difficulty, switch to 'all'
      setTempDifficulty('all');
    } else {
      setTempDifficulty(diff);
    }
  };

  const handleFrequencyChange = (value: number) => {
    setTempMinFrequency(value);
  };

  const applyFilters = () => {
    setDifficulty(tempDifficulty);
    setMinFrequency(tempMinFrequency);
    
    const filters: {
      minFrequency?: number, 
      difficulty?: 'easy' | 'medium' | 'hard' | 'all',
      resetPage?: boolean
    } = {};

    // Only add difficulty filter if it's not 'all'
    if (tempDifficulty && tempDifficulty !== 'all') {
      filters.difficulty = tempDifficulty as 'easy' | 'medium' | 'hard';
    } else {
      // Explicitly set difficulty to 'all' to ensure it's properly tracked
      filters.difficulty = 'all';
    }
    
    // Always include frequency in filters, even if it's 0
    filters.minFrequency = tempMinFrequency;

    // Add flag to reset page to 1 when filters are applied
    filters.resetPage = true;

    onFilterChange(filters);
  };

  const resetFilters = () => {
    // Reset to default values
    setTempDifficulty('all');
    setTempMinFrequency(0);
    setDifficulty('all');
    setMinFrequency(0);
    
    // Apply filters with 'all' difficulty (which will be removed in parent component)
    // This ensures the filter is visibly applied
    onFilterChange({
      difficulty: 'all',
      minFrequency: 0,
      resetPage: true // Also reset page when filters are reset
    });
  };

  // Function to get color for difficulty buttons
  const getDifficultyColor = (diff: string) => {
    if (diff === 'all') return tempDifficulty === diff ? 'bg-gray-500 shadow-md' : 'bg-gray-700 hover:bg-gray-600';
    if (diff === 'easy') return tempDifficulty === diff ? 'bg-green-500 shadow-md' : 'bg-gray-700 hover:bg-green-700/60';
    if (diff === 'medium') return tempDifficulty === diff ? 'bg-blue-500 shadow-md' : 'bg-gray-700 hover:bg-blue-700/60';
    if (diff === 'hard') return tempDifficulty === diff ? 'bg-red-500 shadow-md' : 'bg-gray-700 hover:bg-red-700/60';
    return 'bg-gray-700';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full mb-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-0 mb-4 md:mb-0 w-full">
          {/* Difficulty */}
          <div>
            <span className="text-gray-400 text-sm block mb-2">Difficulty</span>
            <div className="flex flex-col space-y-2 w-64">
              {/* All button with full width */}
              <motion.button
                onClick={() => handleDifficultyChange('all')}
                className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-all ${getDifficultyColor('all')} ${
                  tempDifficulty === 'all' ? 'text-white' : 'text-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                All
              </motion.button>
              
              {/* Difficulty buttons in a row */}
              <div className="flex justify-between w-full mt-2 gap-2">
                {ALL_DIFFICULTIES.filter(diff => diff !== 'all').map((diff) => (
                  <button
                    key={diff}
                    onClick={() => !disabled && handleDifficultyChange(diff)}
                    disabled={disabled}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 flex-1 ${getDifficultyColor(diff)} ${tempDifficulty === diff ? 'ring-2 ring-white ring-opacity-50 shadow-lg transform scale-105' : 'opacity-80 hover:opacity-100'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
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
                    style={{ width: `${tempMinFrequency}%` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${tempMinFrequency}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  />
                </motion.div>
                
                {/* Marker points */}
                <div className="absolute w-full top-8 flex justify-between px-1">
                  {[0, 25, 50, 75, 100].map((mark) => (
                    <motion.div 
                      key={mark}
                      className={`h-3 w-1 rounded-full ${tempMinFrequency >= mark ? 'bg-indigo-400' : 'bg-gray-600'}`}
                      initial={{ height: 0 }}
                      animate={{ height: tempMinFrequency >= mark ? 8 : 5 }}
                      transition={{ delay: mark * 0.005, duration: 0.2 }}
                    />
                  ))}
                </div>
                
                {/* Labels */}
                <div className="absolute w-full top-12 flex justify-between text-xs">
                  {[0, 25, 50, 75, 100].map((mark) => (
                    <motion.span 
                      key={mark}
                      className={`${tempMinFrequency >= mark ? 'text-indigo-300' : 'text-gray-500'} text-center w-6 -ml-3`}
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
                  value={tempMinFrequency}
                  onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                  disabled={disabled}
                  className={`absolute w-full h-8 top-1/2 -translate-y-1/2 opacity-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} z-20`}
                />
                
                {/* Vertical line indicator */}
                <motion.div 
                  className="absolute h-8 w-0.5 bg-white shadow-[0_0_8px_rgba(79,70,229,0.5)] z-10 top-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${tempMinFrequency}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                />
              </div>
              
              {/* Value display - positioned to the right */}
              <div className="ml-4">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={tempMinFrequency}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full font-medium text-sm shadow-lg"
                    initial={{ opacity: 0, x: -10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {tempMinFrequency}%
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4 self-start md:self-center md:mr-4 mt-6 md:mt-0">
          <motion.button 
            onClick={applyFilters} 
            disabled={disabled}
            className={`${disabled ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-500'} text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-md w-32 h-9 flex items-center justify-center`}
            whileHover={!disabled ? { scale: 1.03, backgroundColor: '#3b82f6' } : undefined}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            Apply Filters
          </motion.button>
          <motion.button 
            onClick={resetFilters} 
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
    </div>
  );
};

export default CompanyQuestionsFilter;

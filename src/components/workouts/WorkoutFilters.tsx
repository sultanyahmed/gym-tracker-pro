import React from 'react';

interface WorkoutFiltersProps {
  filters: {
    category: string;
    difficulty: string;
    duration: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function WorkoutFilters({ filters, onFilterChange }: WorkoutFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        className="bg-white border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">All Categories</option>
        <option value="strength">Strength</option>
        <option value="cardio">Cardio</option>
        <option value="flexibility">Flexibility</option>
        <option value="hiit">HIIT</option>
      </select>

      <select
        name="difficulty"
        value={filters.difficulty}
        onChange={handleChange}
        className="bg-white border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <select
        name="duration"
        value={filters.duration}
        onChange={handleChange}
        className="bg-white border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">Duration</option>
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
        <option value="45">45 minutes</option>
        <option value="60">60 minutes</option>
      </select>
    </div>
  );
}
import React, { useState } from 'react';
import ClassSchedule from '../components/classes/ClassSchedule';
import ClassCalendar from '../components/classes/ClassCalendar';
import ClassFilters from '../components/classes/ClassFilters';
import MyBookings from '../components/classes/MyBookings';
import NavigationMenu from '../components/NavigationMenu';
import { Calendar, List } from 'lucide-react';

interface ClassFilters {
  category: string;
  difficulty: string;
  time: string;
}

export default function Classes() {
  const [filters, setFilters] = useState<ClassFilters>({
    category: '',
    difficulty: '',
    time: ''
  });
  const [viewMode, setViewMode] = useState<'list'>('calendar');

  const handleFilterChange = (newFilters: Partial<ClassFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      <NavigationMenu />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Fitness Classes</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md flex items-center ${
              viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'
            }`}
          >
            <Calendar className="h-5 w-5 mr-1" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md flex items-center ${
              viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'
            }`}
          >
            <List className="h-5 w-5 mr-1" />
            <span>List</span>
          </button>
        </div>
      </div>
      
      <ClassFilters onFilterChange={handleFilterChange} />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewMode === 'calendar' ? (
            <ClassCalendar />
          ) : (
            <ClassSchedule filters={filters} />
          )}
        </div>
        <div>
          <MyBookings />
        </div>
      </div>
    </div>
  );
}
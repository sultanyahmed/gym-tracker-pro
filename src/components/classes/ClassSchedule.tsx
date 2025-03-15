import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { ClassFilters } from '../../types/class';
import { buildClassQuery } from '../../lib/queries';
import { gymLocations } from '../../lib/constants';
import ClassCard from './ClassCard';

interface ClassScheduleProps {
  filters: ClassFilters;
}

export default function ClassSchedule({ filters }: ClassScheduleProps) {
  const { user } = useAuthStore();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateDefaultClasses = () => {
    const now = new Date();
    const classes = [];
    const categories = ['strength', 'cardio', 'hiit', 'yoga', 'pilates', 'spinning', 'boxing', 'flexibility'];
    const instructors = [
      'Sarah Johnson', 'Mike Thompson', 'Emma Davis', 'James Wilson', 
      'Lisa Anderson', 'David Chen', 'Rachel Smith', 'Alex Rodriguez'
    ];

    // Generate classes for the next 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      date.setDate(now.getDate() + day);

      // Generate 3 classes per day
      for (let i = 0; i < 3; i++) {
        const startHour = 8 + (i * 4); // Classes at 8AM, 12PM, and 4PM
        const category = categories[Math.floor(Math.random() * categories.length)];
        const instructor = instructors[Math.floor(Math.random() * instructors.length)];
        const location = gymLocations[Math.floor(Math.random() * gymLocations.length)];

        const startTime = new Date(date);
        startTime.setHours(startHour, 0, 0, 0);

        classes.push({
          id: crypto.randomUUID(),
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Class`,
          instructor,
          category,
          difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
          start_time: startTime.toISOString(),
          max_participants: 15 + Math.floor(Math.random() * 10),
          location,
          class_bookings: []
        });
      }
    }

    return classes;
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const query = buildClassQuery(supabase, filters);
      const { data, error } = await query;
      
      if (error) throw error;

      // Combine database classes with generated classes
      const defaultClasses = generateDefaultClasses();
      const allClasses = [...(data || []), ...defaultClasses];

      // Apply filters to all classes
      let filteredClasses = allClasses;
      if (filters.category) {
        filteredClasses = filteredClasses.filter(c => c.category === filters.category);
      }
      if (filters.difficulty) {
        filteredClasses = filteredClasses.filter(c => c.difficulty === filters.difficulty);
      }
      if (filters.time) {
        const hour = new Date(filteredClasses[0]?.start_time || Date.now()).getHours();
        if (filters.time === 'morning' && (hour < 6 || hour >= 12)) {
          filteredClasses = filteredClasses.filter(c => {
            const hour = new Date(c.start_time).getHours();
            return hour >= 6 && hour < 12;
          });
        } else if (filters.time === 'afternoon' && (hour < 12 || hour >= 17)) {
          filteredClasses = filteredClasses.filter(c => {
            const hour = new Date(c.start_time).getHours();
            return hour >= 12 && hour < 17;
          });
        } else if (filters.time === 'evening' && (hour < 17 || hour >= 22)) {
          filteredClasses = filteredClasses.filter(c => {
            const hour = new Date(c.start_time).getHours();
            return hour >= 17 && hour < 22;
          });
        }
      }

      // Sort by start time
      filteredClasses.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

      setClasses(filteredClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [filters]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Class Schedule</h2>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="space-y-4">
          {classes.map((classItem: any) => (
            <ClassCard 
              key={classItem.id} 
              classItem={classItem} 
              user={user} 
              onUpdate={fetchClasses} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
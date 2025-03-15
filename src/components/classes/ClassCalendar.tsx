import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, addWeeks, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ClassItem } from '../../types/class';
import { gymLocations } from '../../lib/constants';

export default function ClassCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const startDateStr = new Date().toISOString();
      const endDateStr = addWeeks(new Date(), 2).toISOString();

      const { data, error } = await supabase
        .from('class_schedules')
        .select('*')
        .gte('start_time', startDateStr)
        .lt('start_time', endDateStr);
      
      if (error) throw error;

      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const formatClassTime = (startTime: string, endTime?: string) => {
    const start = new Date(startTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (endTime) {
      const end = new Date(endTime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return `${start} - ${end}`;
    }

    return start;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Class Schedule</h2>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : classes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No classes scheduled.</p>
      ) : (
        <div className="space-y-4">
          {classes.map(classItem => (
            <div key={classItem.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{classItem.name}</h3>
                  <p className="text-gray-600">{classItem.instructor}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  {classItem.category}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {formatClassTime(classItem.start_time, classItem.end_time)}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Location: {classItem.location}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

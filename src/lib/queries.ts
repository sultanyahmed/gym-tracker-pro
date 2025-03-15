import { SupabaseClient } from '@supabase/supabase-js';
import { ClassFilters } from '../types/class';

export const buildClassQuery = (supabase: SupabaseClient, filters: ClassFilters) => {
  let query = supabase
    .from('class_schedules')
    .select('*, class_bookings(*)');

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }
  
  if (filters.time) {
    const timeRanges = {
      morning: ['06:00', '12:00'],
      afternoon: ['12:00', '17:00'],
      evening: ['17:00', '22:00']
    };
    
    if (timeRanges[filters.time as keyof typeof timeRanges]) {
      const [start, end] = timeRanges[filters.time as keyof typeof timeRanges];
      query = query
        .gte('start_time', `${new Date().toISOString().split('T')[0]}T${start}:00`)
        .lt('start_time', `${new Date().toISOString().split('T')[0]}T${end}:00`);
    }
  }

  return query;
};
import React, { useState } from 'react';
import WorkoutList from '../components/workouts/WorkoutList';
import WorkoutFilters from '../components/workouts/WorkoutFilters';
import PersonalizedWorkouts from '../components/workouts/PersonalizedWorkouts';
import NewWorkout from '../components/workouts/NewWorkout';
import NavigationMenu from '../components/NavigationMenu';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function Workouts() {
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    duration: ''
  });
  const { user } = useAuthStore();

  const handleSaveWorkout = async (workoutData: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workouts')
        .insert({
          ...workoutData,
          user_id: user.id
        });

      if (error) throw error;
      setShowNewWorkout(false);
      alert('Workout saved successfully!');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout');
    }
  };

  return (
    <div className="space-y-6">
      <NavigationMenu />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
        <button
          onClick={() => setShowNewWorkout(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Start New Workout
        </button>
      </div>

      <PersonalizedWorkouts />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Browse All Workouts</h2>
        <WorkoutFilters filters={filters} onFilterChange={setFilters} />
        <div className="mt-6">
          <WorkoutList filters={filters} />
        </div>
      </div>

      {showNewWorkout && (
        <NewWorkout
          onClose={() => setShowNewWorkout(false)}
          onSave={handleSaveWorkout}
        />
      )}
    </div>
  );
}
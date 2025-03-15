import React, { useState } from 'react';
import { Clock, Flame, BarChart, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface WorkoutDetailsProps {
  workout: {
    id: string;
    name: string;
    difficulty: string;
    duration: number;
    calories_burn_estimate: number;
    category: string;
    exercises?: Array<{
      name: string;
      sets: number;
      reps: string;
      weight?: string;
    }>;
    is_default?: boolean;
  };
  onClose: () => void;
}

export default function WorkoutDetails({ workout, onClose }: WorkoutDetailsProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { user } = useAuthStore();

  const handleWorkoutComplete = async () => {
    if (!user) return;
    
    setIsCompleting(true);
    try {
      // For default workouts, create a new workout entry first
      let workoutId = workout.id;
      
      if (workout.is_default) {
        const { data, error: insertError } = await supabase
          .from('workouts')
          .insert({
            name: workout.name,
            difficulty: workout.difficulty,
            duration: workout.duration,
            calories_burn_estimate: workout.calories_burn_estimate,
            category: workout.category,
            exercises: workout.exercises,
            user_id: user.id
          })
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) workoutId = data.id;
      }

      const { error } = await supabase
        .from('user_workouts')
        .insert({
          user_id: user.id,
          workout_id: workoutId,
          duration_minutes: workout.duration,
          calories_burned: workout.calories_burn_estimate,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Workout completed successfully!');
      onClose();
    } catch (error) {
      console.error('Error completing workout:', error);
      alert('Failed to save workout completion');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold">{workout.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{workout.duration} mins</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>{workout.calories_burn_estimate} kcal</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <BarChart className="h-4 w-4 text-indigo-600" />
            <span className="capitalize">{workout.difficulty}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Exercises</h3>
          {workout.exercises?.map((exercise, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium">{exercise.name}</h4>
              <p className="text-gray-600">
                {exercise.sets} sets × {exercise.reps}
                {exercise.weight && ` @ ${exercise.weight}`}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handleWorkoutComplete}
            disabled={isCompleting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isCompleting ? 'Completing...' : 'Complete Workout'}
          </button>
        </div>
      </div>
    </div>
  );
}
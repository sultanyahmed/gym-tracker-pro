import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

interface NewWorkoutProps {
  onClose: () => void;
  onSave: (workout: any) => void;
}

export default function NewWorkout({ onClose, onSave }: NewWorkoutProps) {
  const { user } = useAuthStore();
  const [workoutData, setWorkoutData] = useState({
    name: '',
    category: 'strength',
    difficulty: 'beginner',
    duration: '30',
    exercises: [{ name: '', sets: '', reps: '', weight: '' }]
  });

  const addExercise = () => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: '', reps: '', weight: '' }]
    }));
  };

  const removeExercise = (index: number) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const workoutToSave = {
        ...workoutData,
        user_id: user.id,
        duration: parseInt(workoutData.duration),
        calories_burn_estimate: parseInt(workoutData.duration) * 10, // Simple estimate
        exercises: workoutData.exercises.map(ex => ({
          ...ex,
          sets: parseInt(ex.sets)
        }))
      };

      const { data, error } = await supabase
        .from('workouts')
        .insert(workoutToSave)
        .select()
        .single();

      if (error) throw error;
      
      onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Create New Workout</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Name
            </label>
            <input
              type="text"
              value={workoutData.name}
              onChange={e => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={workoutData.category}
                onChange={e => setWorkoutData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="hiit">HIIT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={workoutData.difficulty}
                onChange={e => setWorkoutData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={workoutData.duration}
                onChange={e => setWorkoutData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Exercises</h3>
              <button
                type="button"
                onClick={addExercise}
                className="text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </button>
            </div>

            {workoutData.exercises.map((exercise, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 items-end">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={e => updateExercise(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sets
                  </label>
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={e => updateExercise(index, 'sets', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reps
                  </label>
                  <input
                    type="text"
                    value={exercise.reps}
                    onChange={e => updateExercise(index, 'reps', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="12 or 8-12"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
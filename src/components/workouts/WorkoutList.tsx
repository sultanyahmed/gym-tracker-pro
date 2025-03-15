import React, { useState, useEffect } from 'react';
import { Clock, Flame, BarChart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import WorkoutDetails from './WorkoutDetails';
import NewWorkout from './NewWorkout';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: number;
  calories_burn_estimate: number;
  category: string;
  exercises: Exercise[];
  fitness_goal?: string;
  is_default?: boolean;
}

interface WorkoutListProps {
  filters: {
    category: string;
    difficulty: string;
    duration: string;
  };
}

export default function WorkoutList({ filters }: WorkoutListProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const { user, profile } = useAuthStore();

  const defaultWorkouts: Workout[] = [
    // Weight Loss Workouts
    {
      id: crypto.randomUUID(),
      name: 'Fat Burning HIIT',
      description: 'High-intensity intervals for maximum calorie burn',
      difficulty: 'intermediate',
      duration: 30,
      calories_burn_estimate: 400,
      category: 'hiit',
      fitness_goal: 'weight_loss',
      is_default: true,
      exercises: [
        { name: 'Burpees', sets: 4, reps: '45 seconds' },
        { name: 'Mountain Climbers', sets: 4, reps: '45 seconds' },
        { name: 'Jump Squats', sets: 4, reps: '45 seconds' },
        { name: 'High Knees', sets: 4, reps: '45 seconds' },
        { name: 'Jumping Lunges', sets: 4, reps: '45 seconds' }
      ]
    },
    {
      id: crypto.randomUUID(),
      name: 'Cardio Blast',
      description: 'Intense cardio workout for fat loss',
      difficulty: 'intermediate',
      duration: 45,
      calories_burn_estimate: 500,
      category: 'cardio',
      fitness_goal: 'weight_loss',
      is_default: true,
      exercises: [
        { name: 'Jump Rope', sets: 3, reps: '3 minutes' },
        { name: 'Box Jumps', sets: 4, reps: '12-15' },
        { name: 'Kettlebell Swings', sets: 4, reps: '20' },
        { name: 'Battle Ropes', sets: 3, reps: '30 seconds' }
      ]
    },
    // Muscle Gain Workouts
    {
      id: crypto.randomUUID(),
      name: 'Upper Body Power',
      description: 'Heavy compound movements for upper body strength',
      difficulty: 'advanced',
      duration: 60,
      calories_burn_estimate: 350,
      category: 'strength',
      fitness_goal: 'muscle_gain',
      is_default: true,
      exercises: [
        { name: 'Bench Press', sets: 5, reps: '5' },
        { name: 'Weighted Pull-ups', sets: 4, reps: '6-8' },
        { name: 'Military Press', sets: 4, reps: '8' },
        { name: 'Barbell Rows', sets: 4, reps: '8' }
      ]
    },
    {
      id: crypto.randomUUID(),
      name: 'Leg Day Strength',
      description: 'Heavy compound movements for lower body growth',
      difficulty: 'advanced',
      duration: 75,
      calories_burn_estimate: 400,
      category: 'strength',
      fitness_goal: 'muscle_gain',
      is_default: true,
      exercises: [
        { name: 'Back Squats', sets: 5, reps: '5' },
        { name: 'Romanian Deadlifts', sets: 4, reps: '8' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '10 each' },
        { name: 'Calf Raises', sets: 4, reps: '15' }
      ]
    },
    // General Fitness Workouts
    {
      id: crypto.randomUUID(),
      name: 'Full Body Circuit',
      description: 'Balanced workout for overall fitness',
      difficulty: 'beginner',
      duration: 45,
      calories_burn_estimate: 300,
      category: 'strength',
      fitness_goal: 'general_fitness',
      is_default: true,
      exercises: [
        { name: 'Push-ups', sets: 3, reps: '10-12' },
        { name: 'Bodyweight Squats', sets: 3, reps: '15' },
        { name: 'Dumbbell Rows', sets: 3, reps: '12' },
        { name: 'Plank', sets: 3, reps: '45 seconds' }
      ]
    },
    // Maintenance Workouts
    {
      id: crypto.randomUUID(),
      name: 'Balanced Strength',
      description: 'Maintain muscle while improving fitness',
      difficulty: 'intermediate',
      duration: 50,
      calories_burn_estimate: 320,
      category: 'strength',
      fitness_goal: 'maintenance',
      is_default: true,
      exercises: [
        { name: 'Dumbbell Press', sets: 3, reps: '10-12' },
        { name: 'Goblet Squats', sets: 3, reps: '12-15' },
        { name: 'Pull-ups/Lat Pulldowns', sets: 3, reps: '8-10' },
        { name: 'Face Pulls', sets: 3, reps: '15' }
      ]
    }
  ];

  const fetchWorkouts = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters.duration) {
        const duration = parseInt(filters.duration);
        query = query.eq('duration', duration);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Combine database workouts with default workouts
      let allWorkouts = [...(data || []), ...defaultWorkouts];

      // Filter workouts based on user's fitness goal if available
      if (profile?.fitness_goal) {
        allWorkouts = allWorkouts.filter(workout => 
          !workout.fitness_goal || workout.fitness_goal === profile.fitness_goal
        );
      }

      // Apply additional filters
      if (filters.category) {
        allWorkouts = allWorkouts.filter(w => w.category === filters.category);
      }
      if (filters.difficulty) {
        allWorkouts = allWorkouts.filter(w => w.difficulty === filters.difficulty);
      }
      if (filters.duration) {
        const duration = parseInt(filters.duration);
        allWorkouts = allWorkouts.filter(w => w.duration === duration);
      }

      setWorkouts(allWorkouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user, filters, profile?.fitness_goal]);

  if (loading) {
    return <div className="text-center py-4">Loading workouts...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workouts.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No workouts found matching your filters.
        </div>
      ) : (
        workouts.map((workout) => (
          <div key={workout.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
            {workout.description && (
              <p className="text-gray-600 text-sm mb-4">{workout.description}</p>
            )}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{workout.duration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>{workout.calories_burn_estimate} kcal</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart className="h-4 w-4 text-indigo-600" />
                <span className="capitalize">{workout.difficulty}</span>
              </div>
              {workout.fitness_goal && (
                <div className="text-sm text-indigo-600 capitalize">
                  Recommended for: {workout.fitness_goal.replace('_', ' ')}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedWorkout(workout)}
              className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              View Details
            </button>
          </div>
        ))
      )}

      {selectedWorkout && (
        <WorkoutDetails
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}

      {showNewWorkout && (
        <NewWorkout
          onClose={() => setShowNewWorkout(false)}
          onSave={async (workoutData) => {
            if (!user) return;

            try {
              const { error } = await supabase
                .from('workouts')
                .insert({
                  ...workoutData,
                  user_id: user.id,
                  duration: parseInt(workoutData.duration),
                  exercises: workoutData.exercises
                });

              if (error) throw error;
              
              setShowNewWorkout(false);
              fetchWorkouts();
              alert('Workout saved successfully!');
            } catch (error) {
              console.error('Error saving workout:', error);
              alert('Failed to save workout');
            }
          }}
        />
      )}
    </div>
  );
}
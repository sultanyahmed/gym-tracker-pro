import React from 'react';
import { Clock, Flame, BarChart } from 'lucide-react';

interface WorkoutCardProps {
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
    }>;
  };
  onClick?: () => void;
}

export default function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-4">{workout.name}</h3>
      
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

        {workout.exercises && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium text-gray-600">Exercises:</div>
            <div className="text-sm text-gray-500">
              {workout.exercises.slice(0, 3).map((exercise, index) => (
                <div key={index}>
                  {exercise.name} ({exercise.sets} × {exercise.reps})
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <div className="text-indigo-600">
                  +{workout.exercises.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
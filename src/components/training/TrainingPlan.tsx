import React from 'react';
import { Dumbbell, Target, Calendar } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

interface WorkoutDay {
  name: string;
  exercises: Exercise[];
}

export default function TrainingPlan() {
  const getTrainingPlan = (goal: string): WorkoutDay[] => {
    const plans: Record<string, WorkoutDay[]> = {
      muscle_gain: [
        {
          name: 'Push Day',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: '8-10', notes: 'Focus on form' },
            { name: 'Overhead Press', sets: 3, reps: '8-12' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
            { name: 'Lateral Raises', sets: 3, reps: '12-15' },
            { name: 'Tricep Pushdowns', sets: 3, reps: '12-15' }
          ]
        },
        {
          name: 'Pull Day',
          exercises: [
            { name: 'Barbell Rows', sets: 4, reps: '8-10' },
            { name: 'Pull-ups/Lat Pulldowns', sets: 3, reps: '8-12' },
            { name: 'Face Pulls', sets: 3, reps: '12-15' },
            { name: 'Bicep Curls', sets: 3, reps: '12-15' }
          ]
        },
        {
          name: 'Leg Day',
          exercises: [
            { name: 'Squats', sets: 4, reps: '8-10', notes: 'Warm up properly' },
            { name: 'Romanian Deadlifts', sets: 3, reps: '8-12' },
            { name: 'Leg Press', sets: 3, reps: '10-12' },
            { name: 'Calf Raises', sets: 4, reps: '15-20' }
          ]
        }
      ],
      weight_loss: [
        {
          name: 'Full Body Circuit',
          exercises: [
            { name: 'Bodyweight Squats', sets: 3, reps: '15-20' },
            { name: 'Push-ups', sets: 3, reps: '10-15' },
            { name: 'Dumbbell Rows', sets: 3, reps: '12-15' },
            { name: 'Mountain Climbers', sets: 3, reps: '30 seconds' }
          ]
        },
        {
          name: 'HIIT Cardio',
          exercises: [
            { name: 'Jump Rope', sets: 4, reps: '1 minute', notes: 'Rest 30 seconds between sets' },
            { name: 'Burpees', sets: 4, reps: '30 seconds' },
            { name: 'High Knees', sets: 4, reps: '30 seconds' },
            { name: 'Jumping Jacks', sets: 4, reps: '30 seconds' }
          ]
        },
        {
          name: 'Strength & Core',
          exercises: [
            { name: 'Lunges', sets: 3, reps: '12 each leg' },
            { name: 'Plank', sets: 3, reps: '45 seconds' },
            { name: 'Russian Twists', sets: 3, reps: '20 each side' },
            { name: 'Glute Bridges', sets: 3, reps: '15-20' }
          ]
        }
      ]
    };

    return plans[goal] || plans.general_fitness;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Dumbbell className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Your Training Plan</h2>
      </div>

      <div className="space-y-6">
        {getTrainingPlan('muscle_gain').map((day, dayIndex) => (
          <div key={dayIndex} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
              {day.name}
            </h3>
            
            <div className="space-y-4">
              {day.exercises.map((exercise, exIndex) => (
                <div key={exIndex} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps}
                      </p>
                    </div>
                    {exercise.notes && (
                      <span className="text-sm text-indigo-600">{exercise.notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { Dumbbell } from 'lucide-react';

export default function RecentWorkouts() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
      <div className="space-y-4">
        {[
          { name: 'Upper Body Strength', date: '2024-03-15', duration: '45 min' },
          { name: 'HIIT Cardio', date: '2024-03-14', duration: '30 min' },
          { name: 'Core Workout', date: '2024-03-13', duration: '20 min' },
        ].map((workout, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Dumbbell className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="font-medium">{workout.name}</div>
                <div className="text-sm text-gray-600">{workout.date}</div>
              </div>
            </div>
            <span className="text-sm text-gray-600">{workout.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getPersonalizedWorkouts } from '../../lib/recommendations';
import WorkoutCard from './WorkoutCard';
import { Dumbbell } from 'lucide-react';

export default function PersonalizedWorkouts() {
  const { user } = useAuthStore();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkouts() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getPersonalizedWorkouts(user.id);
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching personalized workouts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, [user]);

  if (loading) {
    return <div className="text-center py-4">Loading personalized workouts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Dumbbell className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Recommended for You</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { CheckCircle, Target, Flame } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DailyProgress() {
  const { user } = useAuthStore();
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
  const [calorieData, setCalorieData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchTodayData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch today's meals
      const { data: meals } = await supabase
        .from('meals')
        .select('calories')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      // Calculate total calories consumed
      const totalCalories = meals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0;
      setCaloriesConsumed(totalCalories);

      // Fetch today's workouts
      const { data: workouts } = await supabase
        .from('user_workouts')
        .select('calories_burned')
        .eq('user_id', user.id)
        .gte('completed_at', today.toISOString());

      setWorkoutsCompleted(workouts?.length || 0);
      const totalBurned = workouts?.reduce((sum, workout) => sum + (workout.calories_burned || 0), 0) || 0;
      setCaloriesBurned(totalBurned);
    };

    const fetchWeeklyData = async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);

      // Fetch last 7 days of meals and workouts
      const { data: meals } = await supabase
        .from('meals')
        .select('calories, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      const { data: workouts } = await supabase
        .from('user_workouts')
        .select('calories_burned, completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', startDate.toISOString());

      // Process data for chart
      const data = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dayMeals = meals?.filter(meal => 
          new Date(meal.created_at).toDateString() === date.toDateString()
        ) || [];
        
        const dayWorkouts = workouts?.filter(workout => 
          new Date(workout.completed_at).toDateString() === date.toDateString()
        ) || [];

        data.unshift({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          consumed: dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
          burned: dayWorkouts.reduce((sum, workout) => sum + (workout.calories_burned || 0), 0)
        });
      }

      setCalorieData(data);
    };

    fetchTodayData();
    fetchWeeklyData();

    // Set up real-time subscription for meals
    const mealSubscription = supabase
      .channel('meals_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'meals', filter: `user_id=eq.${user.id}` },
        () => {
          fetchTodayData();
          fetchWeeklyData();
        }
      )
      .subscribe();

    // Set up real-time subscription for workouts
    const workoutSubscription = supabase
      .channel('workouts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_workouts', filter: `user_id=eq.${user.id}` },
        () => {
          fetchTodayData();
          fetchWeeklyData();
        }
      )
      .subscribe();

    return () => {
      mealSubscription.unsubscribe();
      workoutSubscription.unsubscribe();
    };
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Today's Progress</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="h-5 w-5 text-indigo-600" />
            <span>Calories Consumed</span>
          </div>
          <span className="font-semibold">{caloriesConsumed} kcal</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>Calories Burned</span>
          </div>
          <span className="font-semibold">{caloriesBurned} kcal</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Completed Workouts</span>
          </div>
          <span className="font-semibold">{workoutsCompleted}</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Calorie Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={calorieData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="consumed" 
                stackId="1" 
                stroke="#4F46E5" 
                fill="#4F46E5" 
                fillOpacity={0.3}
                name="Calories Consumed"
              />
              <Area 
                type="monotone" 
                dataKey="burned" 
                stackId="2" 
                stroke="#F97316" 
                fill="#F97316" 
                fillOpacity={0.3}
                name="Calories Burned"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { PieChart, Apple, Beef, Pizza } from 'lucide-react';
import MacroProgress from './MacroProgress';
import MealList from './MealList';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function DailyNutrition() {
  const { user } = useAuthStore();
  const [nutritionData, setNutritionData] = useState({
    calories: { current: 0, target: 2000 },
    protein: { current: 0, target: 120 },
    carbs: { current: 0, target: 250 },
    fat: { current: 0, target: 65 }
  });

  const fetchTodayNutrition = async () => {
    if (!user) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: meals, error } = await supabase
        .from('meals')
        .select('calories, protein, carbs, fat')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      if (error) throw error;

      const totals = meals?.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      setNutritionData(prev => ({
        ...prev,
        calories: { ...prev.calories, current: totals.calories },
        protein: { ...prev.protein, current: totals.protein },
        carbs: { ...prev.carbs, current: totals.carbs },
        fat: { ...prev.fat, current: totals.fat }
      }));
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    }
  };

  useEffect(() => {
    fetchTodayNutrition();

    // Set up real-time subscription for meals
    const subscription = supabase
      .channel('meals_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'meals', filter: `user_id=eq.${user?.id}` },
        () => {
          fetchTodayNutrition();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Today's Nutrition</h2>
        <div className="text-sm text-gray-600">
          {nutritionData.calories.current} / {nutritionData.calories.target} kcal
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <MacroProgress
          icon={<Beef className="h-5 w-5 text-red-500" />}
          label="Protein"
          current={Math.round(nutritionData.protein.current)}
          target={nutritionData.protein.target}
          unit="g"
          color="red"
        />
        <MacroProgress
          icon={<Apple className="h-5 w-5 text-green-500" />}
          label="Carbs"
          current={Math.round(nutritionData.carbs.current)}
          target={nutritionData.carbs.target}
          unit="g"
          color="green"
        />
        <MacroProgress
          icon={<Pizza className="h-5 w-5 text-yellow-500" />}
          label="Fat"
          current={Math.round(nutritionData.fat.current)}
          target={nutritionData.fat.target}
          unit="g"
          color="yellow"
        />
      </div>

      <MealList onMealUpdate={fetchTodayNutrition} />
    </div>
  );
}
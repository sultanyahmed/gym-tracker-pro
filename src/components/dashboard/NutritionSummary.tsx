import React, { useEffect, useState } from 'react';
import { Utensils } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function NutritionSummary() {
  const { user } = useAuthStore();
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    if (!user) return;

    const fetchTodayMacros = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: meals } = await supabase
        .from('meals')
        .select('protein, carbs, fat')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      if (meals) {
        const totals = meals.reduce((acc, meal) => ({
          protein: acc.protein + (meal.protein || 0),
          carbs: acc.carbs + (meal.carbs || 0),
          fat: acc.fat + (meal.fat || 0)
        }), { protein: 0, carbs: 0, fat: 0 });

        setMacros(totals);
      }
    };

    fetchTodayMacros();

    const subscription = supabase
      .channel('meals_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'meals', filter: `user_id=eq.${user.id}` },
        fetchTodayMacros
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Nutrition Summary</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Utensils className="h-5 w-5 text-indigo-600" />
          <span className="text-gray-600">Today's Macros</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Protein</div>
            <div className="font-semibold">{Math.round(macros.protein)}g</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Carbs</div>
            <div className="font-semibold">{Math.round(macros.carbs)}g</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Fat</div>
            <div className="font-semibold">{Math.round(macros.fat)}g</div>
          </div>
        </div>
      </div>
    </div>
  );
}
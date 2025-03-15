import React, { useEffect, useState } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  created_at: string;
}

interface MealListProps {
  onMealUpdate?: () => void;
}

export default function MealList({ onMealUpdate }: MealListProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchMeals = async () => {
    if (!user) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeals(data || []);
      onMealUpdate?.();
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId)
        .eq('user_id', user?.id);

      if (error) throw error;
      setMeals(meals.filter(meal => meal.id !== mealId));
      onMealUpdate?.();
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  useEffect(() => {
    fetchMeals();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('meals_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'meals',
          filter: `user_id=eq.${user?.id}`
        }, 
        () => {
          fetchMeals();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  if (loading) {
    return <div className="text-center py-4">Loading meals...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Today's Meals</h3>
      {meals.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No meals recorded today</p>
      ) : (
        meals.map((meal) => (
          <div key={meal.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-600 min-w-[100px]">
              <Clock className="h-4 w-4" />
              <span>{new Date(meal.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit'
              })}</span>
            </div>
            <div className="flex-1">
              <div className="font-medium">{meal.name}</div>
              <div className="text-sm text-gray-600">
                Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium">
                {meal.calories} kcal
              </div>
              <button
                onClick={() => deleteMeal(meal.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
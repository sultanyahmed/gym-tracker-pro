import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getPersonalizedMeals } from '../../lib/recommendations';
import { Utensils } from 'lucide-react';

export default function PersonalizedMeals() {
  const { user } = useAuthStore();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getPersonalizedMeals(user.id);
        setMeals(data);
      } catch (error) {
        console.error('Error fetching personalised meals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMeals();
  }, [user]);

  if (loading) {
    return <div className="text-center py-4">Loading meal recommendations...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Utensils className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Your Personalised Meal Plan</h2>
      </div>

      <div className="space-y-6">
        {meals.map((mealTime, index) => (
          <div key={index}>
            <h3 className="font-medium text-lg capitalize mb-3">
              {mealTime.mealType}
            </h3>
            <div className="space-y-4">
              {mealTime.options.map((meal, mealIndex) => (
                <div key={mealIndex} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{meal.name}</h4>
                    <span className="text-sm text-gray-600">
                      {Math.round(meal.calories)} kcal
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Protein: {Math.round(meal.protein)}g | 
                    Carbs: {Math.round(meal.carbs)}g | 
                    Fat: {Math.round(meal.fat)}g
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Ingredients: </span>
                    {meal.ingredients.join(', ')}
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
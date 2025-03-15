import React from 'react';
import { Utensils } from 'lucide-react';

interface MealSuggestion {
  name: string;
  calories: number;
  protein: number;
  description: string;
}

export default function MealSuggestions() {
  const suggestions: Record<string, MealSuggestion[]> = {
    muscle_gain: [
      {
        name: 'Protein-Packed Breakfast Bowl',
        calories: 650,
        protein: 40,
        description: 'Oatmeal with protein powder, banana, peanut butter, and almonds'
      },
      {
        name: 'Post-Workout Smoothie',
        calories: 500,
        protein: 35,
        description: 'Whey protein, banana, oats, milk, and peanut butter blend'
      },
      {
        name: 'Muscle Building Lunch',
        calories: 800,
        protein: 50,
        description: 'Grilled chicken breast, brown rice, avocado, and roasted vegetables'
      }
    ],
    weight_loss: [
      {
        name: 'Light Breakfast',
        calories: 300,
        protein: 20,
        description: 'Greek yogurt with berries and a sprinkle of granola'
      },
      {
        name: 'Lean Lunch',
        calories: 400,
        protein: 35,
        description: 'Turkey and avocado salad with mixed greens'
      },
      {
        name: 'Protein-Rich Dinner',
        calories: 450,
        protein: 40,
        description: 'Grilled fish with quinoa and steamed vegetables'
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Utensils className="h-5 w-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Meal Suggestions</h2>
      </div>
      
      <div className="space-y-4">
        {Object.entries(suggestions).map(([goal, meals]) => (
          <div key={goal} className="space-y-3">
            <h3 className="font-medium text-gray-900 capitalize">
              {goal.replace('_', ' ')} Meals
            </h3>
            <div className="grid gap-3">
              {meals.map((meal, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{meal.name}</h4>
                    <span className="text-sm text-gray-600">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                  <div className="text-sm text-indigo-600">
                    {meal.protein}g protein
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
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function MealForm() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [mealData, setMealData] = useState({
    name: '',
    meal_type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          name: mealData.name,
          meal_type: mealData.meal_type,
          calories: parseInt(mealData.calories),
          protein: parseFloat(mealData.protein),
          carbs: parseFloat(mealData.carbs),
          fat: parseFloat(mealData.fat)
        });

      if (error) throw error;

      // Reset form
      setMealData({
        name: '',
        meal_type: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      });

      alert('Meal added successfully!');
    } catch (error) {
      console.error('Error adding meal:', error);
      alert('Failed to add meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Add Meal</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type
          </label>
          <select
            value={mealData.meal_type}
            onChange={e => setMealData(prev => ({ ...prev, meal_type: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food Name
          </label>
          <input
            type="text"
            value={mealData.name}
            onChange={e => setMealData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., Grilled Chicken Salad"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calories
            </label>
            <input
              type="number"
              value={mealData.calories}
              onChange={e => setMealData(prev => ({ ...prev, calories: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="kcal"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              value={mealData.protein}
              onChange={e => setMealData(prev => ({ ...prev, protein: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="g"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              value={mealData.carbs}
              onChange={e => setMealData(prev => ({ ...prev, carbs: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="g"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              value={mealData.fat}
              onChange={e => setMealData(prev => ({ ...prev, fat: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="g"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Meal'}
        </button>
      </div>
    </form>
  );
}
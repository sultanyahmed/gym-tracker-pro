import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function NutritionHistory() {
  const history = [
    {
      date: new Date('2024-03-19'),
      calories: 1950,
      protein: 110,
      carbs: 220,
      fat: 60
    },
    {
      date: new Date('2024-03-18'),
      calories: 2100,
      protein: 125,
      carbs: 240,
      fat: 65
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold mb-6">Nutrition History</h2>
      <div className="space-y-4">
        {history.map((day, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formatDate(day.date)}</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>{day.calories} kcal</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Protein</div>
                <div className="font-medium">{day.protein}g</div>
              </div>
              <div>
                <div className="text-gray-600">Carbs</div>
                <div className="font-medium">{day.carbs}g</div>
              </div>
              <div>
                <div className="text-gray-600">Fat</div>
                <div className="font-medium">{day.fat}g</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
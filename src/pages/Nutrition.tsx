import React from 'react';
import DailyNutrition from '../components/nutrition/DailyNutrition';
import MealForm from '../components/nutrition/MealForm';
import NutritionHistory from '../components/nutrition/NutritionHistory';
import PersonalizedMeals from '../components/nutrition/PersonalizedMeals';
import NavigationMenu from '../components/NavigationMenu';

export default function Nutrition() {
  return (
    <div className="space-y-6">
      <NavigationMenu />
      
      <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracking</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DailyNutrition />
          <NutritionHistory />
        </div>
        <div className="space-y-6">
          <MealForm />
          <PersonalizedMeals />
        </div>
      </div>
    </div>
  );
}
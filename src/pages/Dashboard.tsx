import React from 'react';
import { useAuthStore } from '../store/authStore';
import DailyProgress from '../components/dashboard/DailyProgress';
import UpcomingClasses from '../components/dashboard/UpcomingClasses';
import RecentWorkouts from '../components/dashboard/RecentWorkouts';
import NutritionSummary from '../components/dashboard/NutritionSummary';
import NavigationMenu from '../components/NavigationMenu';

export default function Dashboard() {
  const { profile } = useAuthStore();

  return (
    <div className="space-y-6">
      <NavigationMenu />
      
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {profile?.full_name || 'Fitness Enthusiast'}!
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <DailyProgress />
        <NutritionSummary />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <RecentWorkouts />
        <UpcomingClasses />
      </div>
    </div>
  );
}
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Activity, Target, TrendingUp } from 'lucide-react';

export default function ProfileStats() {
  const { profile } = useAuthStore();

  const stats = [
    {
      label: 'Activity Level',
      value: profile?.activity_level || 'Not set',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      label: 'Fitness Goal',
      value: profile?.fitness_goal || 'Not set',
      icon: Target,
      color: 'text-green-600'
    },
    {
      label: 'Daily Calorie Target',
      value: profile?.daily_calorie_target || 'Calculate',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Profile Stats</h2>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className="font-medium capitalize">
                {stat.value.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {profile?.weight && profile?.height && (
        <div className="border-t pt-4 mt-4">
          <div className="text-sm text-gray-600">BMI</div>
          <div className="font-medium">
            {(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)}
          </div>
        </div>
      )}
    </div>
  );
}
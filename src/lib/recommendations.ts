import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface UserStats {
  weight: number;
  height: number;
  fitnessGoal: string;
  activityLevel: string;
  completedWorkouts: number;
  averageCaloriesBurned: number;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single();

    // Get workout history
    const { data: workouts } = await supabase
      .from('user_workouts')
      .select('calories_burned')
      .eq('user_id', userId);

    if (!profile || !workouts) return null;

    const averageCaloriesBurned = workouts.reduce((acc, curr) => acc + (curr.calories_burned || 0), 0) / (workouts.length || 1);

    return {
      weight: profile.weight,
      height: profile.height,
      fitnessGoal: profile.fitness_goal,
      activityLevel: profile.activity_level,
      completedWorkouts: workouts.length,
      averageCaloriesBurned
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}

export async function getPersonalizedWorkouts(userId: string) {
  const stats = await getUserStats(userId);
  if (!stats) return [];

  const baseQuery = supabase.from('workouts').select('*');

  // Adjust query based on user stats and goals
  if (stats.completedWorkouts < 5) {
    baseQuery.eq('difficulty', 'beginner');
  } else if (stats.completedWorkouts < 15) {
    baseQuery.eq('difficulty', 'intermediate');
  } else {
    baseQuery.eq('difficulty', 'advanced');
  }

  if (stats.fitnessGoal === 'weight_loss') {
    baseQuery.in('category', ['cardio', 'hiit']);
  } else if (stats.fitnessGoal === 'muscle_gain') {
    baseQuery.in('category', ['strength']);
  }

  const { data } = await baseQuery;
  return data || [];
}

export async function getPersonalizedMeals(userId: string) {
  const stats = await getUserStats(userId);
  if (!stats) return [];

  let targetCalories = 2000; // Default
  let proteinRatio = 0.3;
  let carbsRatio = 0.4;
  let fatRatio = 0.3;

  // Adjust macros based on fitness goal
  if (stats.fitnessGoal === 'muscle_gain') {
    targetCalories += 300;
    proteinRatio = 0.35;
    carbsRatio = 0.45;
    fatRatio = 0.2;
  } else if (stats.fitnessGoal === 'weight_loss') {
    targetCalories -= 500;
    proteinRatio = 0.4;
    carbsRatio = 0.3;
    fatRatio = 0.3;
  }

  // Calculate target macros
  const targetProtein = (targetCalories * proteinRatio) / 4; // 4 calories per gram of protein
  const targetCarbs = (targetCalories * carbsRatio) / 4;   // 4 calories per gram of carbs
  const targetFat = (targetCalories * fatRatio) / 9;      // 9 calories per gram of fat

  return [
    {
      mealType: 'breakfast',
      options: [
        {
          name: 'High-Protein Oatmeal Bowl',
          calories: targetCalories * 0.25,
          protein: targetProtein * 0.3,
          carbs: targetCarbs * 0.3,
          fat: targetFat * 0.2,
          ingredients: ['Oats', 'Protein powder', 'Banana', 'Almond butter', 'Chia seeds']
        },
        // Add more breakfast options...
      ]
    },
    {
      mealType: 'lunch',
      options: [
        {
          name: 'Lean Protein Bowl',
          calories: targetCalories * 0.35,
          protein: targetProtein * 0.4,
          carbs: targetCarbs * 0.35,
          fat: targetFat * 0.3,
          ingredients: ['Grilled chicken', 'Quinoa', 'Mixed vegetables', 'Avocado']
        },
        // Add more lunch options...
      ]
    },
    // Add dinner and snacks...
  ];
}
/*
  # Initial Schema Setup for Fitness Tracker

  1. New Tables
    - users_profile
      - Extended user profile information
      - Stores fitness goals and metrics
    - workouts
      - Pre-defined workout templates
      - Includes difficulty levels and categories
    - user_workouts
      - Tracks user's workout history
      - Links to workout templates
    - nutrition_logs
      - Daily food and calorie tracking
    - class_schedules
      - Gym class schedule management
    - class_bookings
      - User class reservations
    
  2. Security
    - RLS enabled on all tables
    - Policies for user data protection
*/

-- Users Profile Table
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  weight DECIMAL,
  height DECIMAL,
  fitness_goal TEXT CHECK (fitness_goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'general_fitness')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active')),
  daily_calorie_target INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Workouts Table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility', 'hiit')),
  duration_minutes INTEGER,
  calories_burn_estimate INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Workouts Table
CREATE TABLE user_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id),
  workout_id UUID REFERENCES workouts(id),
  completed_at TIMESTAMPTZ DEFAULT now(),
  duration_minutes INTEGER,
  calories_burned INTEGER,
  notes TEXT
);

-- Nutrition Logs Table
CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id),
  date DATE DEFAULT CURRENT_DATE,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name TEXT NOT NULL,
  calories INTEGER,
  protein_grams DECIMAL,
  carbs_grams DECIMAL,
  fat_grams DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Class Schedules Table
CREATE TABLE class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  instructor TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  max_participants INTEGER,
  category TEXT CHECK (category IN ('yoga', 'pilates', 'zumba', 'spinning', 'boxing', 'other')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Class Bookings Table
CREATE TABLE class_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES class_schedules(id),
  user_id UUID REFERENCES users_profile(id),
  status TEXT CHECK (status IN ('confirmed', 'cancelled', 'waitlist')) DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(class_id, user_id)
);

-- Enable RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON users_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users_profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Workouts are readable by all authenticated users"
  ON workouts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own workout history"
  ON user_workouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON user_workouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own nutrition logs"
  ON nutrition_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs"
  ON nutrition_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Class schedules are readable by all authenticated users"
  ON class_schedules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own class bookings"
  ON class_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own class bookings"
  ON class_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION calculate_daily_calories(
  weight DECIMAL,
  height DECIMAL,
  age INTEGER,
  gender TEXT,
  activity_level TEXT,
  fitness_goal TEXT
) RETURNS INTEGER AS $$
DECLARE
  bmr DECIMAL;
  tdee DECIMAL;
  calorie_target INTEGER;
BEGIN
  -- Basic BMR calculation using Mifflin-St Jeor Equation
  IF gender = 'male' THEN
    bmr := (10 * weight) + (6.25 * height) - (5 * age) + 5;
  ELSE
    bmr := (10 * weight) + (6.25 * height) - (5 * age) - 161;
  END IF;

  -- Calculate TDEE based on activity level
  CASE activity_level
    WHEN 'sedentary' THEN tdee := bmr * 1.2;
    WHEN 'light' THEN tdee := bmr * 1.375;
    WHEN 'moderate' THEN tdee := bmr * 1.55;
    WHEN 'very_active' THEN tdee := bmr * 1.725;
    ELSE tdee := bmr * 1.2;
  END CASE;

  -- Adjust based on fitness goal
  CASE fitness_goal
    WHEN 'weight_loss' THEN calorie_target := tdee - 500;
    WHEN 'muscle_gain' THEN calorie_target := tdee + 300;
    WHEN 'maintenance' THEN calorie_target := tdee;
    ELSE calorie_target := tdee;
  END CASE;

  RETURN calorie_target;
END;
$$ LANGUAGE plpgsql;
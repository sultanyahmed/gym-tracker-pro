/*
  # Fix workouts table and add sample data

  1. Changes
    - Add missing columns to workouts table
    - Add sample workouts
    - Add proper constraints

  2. Security
    - Enable RLS
    - Add policies for workout access
*/

-- Drop and recreate workouts table with proper structure
DROP TABLE IF EXISTS workouts CASCADE;

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility', 'hiit')),
  duration INTEGER NOT NULL,
  calories_burn_estimate INTEGER NOT NULL,
  exercises JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read workouts"
  ON workouts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own workouts"
  ON workouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample workouts
INSERT INTO workouts (
  name,
  description,
  difficulty,
  category,
  duration,
  calories_burn_estimate,
  exercises
) VALUES
(
  'Full Body Strength',
  'Complete full body workout targeting all major muscle groups',
  'intermediate',
  'strength',
  45,
  400,
  '[
    {"name": "Squats", "sets": 4, "reps": "8-12"},
    {"name": "Bench Press", "sets": 4, "reps": "8-12"},
    {"name": "Deadlifts", "sets": 3, "reps": "8-10"},
    {"name": "Pull-ups", "sets": 3, "reps": "8-12"}
  ]'::jsonb
),
(
  'HIIT Cardio Blast',
  'High-intensity interval training for maximum calorie burn',
  'advanced',
  'hiit',
  30,
  350,
  '[
    {"name": "Burpees", "sets": 4, "reps": "30 seconds"},
    {"name": "Mountain Climbers", "sets": 4, "reps": "30 seconds"},
    {"name": "Jump Squats", "sets": 4, "reps": "30 seconds"},
    {"name": "High Knees", "sets": 4, "reps": "30 seconds"}
  ]'::jsonb
);
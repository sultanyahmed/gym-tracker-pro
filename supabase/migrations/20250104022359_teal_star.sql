/*
  # Add meals table and policies

  1. New Tables
    - `meals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `name` (text)
      - `calories` (integer)
      - `protein` (decimal)
      - `carbs` (decimal)
      - `fat` (decimal)
      - `meal_type` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `meals` table
    - Add policies for authenticated users to manage their meals
*/

CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fat DECIMAL NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own meals
CREATE POLICY "Users can read own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own meals
CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own meals
CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
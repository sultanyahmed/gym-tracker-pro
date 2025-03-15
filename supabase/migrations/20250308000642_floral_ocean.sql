/*
  # Update schema for calorie tracking and workout fixes

  1. Add calories_burn_estimate to workouts
  2. Add calories column to nutrition_logs
  3. Add constraints and defaults
  4. Update RLS policies safely
*/

-- Add calories_burn_estimate to workouts if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workouts' AND column_name = 'calories_burn_estimate'
  ) THEN
    ALTER TABLE workouts ADD COLUMN calories_burn_estimate integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Update nutrition_logs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nutrition_logs' AND column_name = 'calories'
  ) THEN
    ALTER TABLE nutrition_logs ADD COLUMN calories integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Safely update RLS for workouts
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can create own workouts" ON workouts;
  DROP POLICY IF EXISTS "Users can read own workouts" ON workouts;
  
  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'workouts' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create new policies for workouts
CREATE POLICY "Users can create own workouts"
  ON workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own workouts"
  ON workouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Safely update RLS for nutrition_logs
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can create own nutrition logs" ON nutrition_logs;
  DROP POLICY IF EXISTS "Users can read own nutrition logs" ON nutrition_logs;
  
  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'nutrition_logs' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create new policies for nutrition_logs
CREATE POLICY "Users can create own nutrition logs"
  ON nutrition_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own nutrition logs"
  ON nutrition_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
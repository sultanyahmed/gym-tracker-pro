/*
  # Fix schema issues and add test user

  1. Schema Updates
    - Add missing columns to workouts table
    - Update user_workouts table structure
    - Fix test user creation

  2. Changes
    - Add duration column to workouts
    - Update user_workouts columns
    - Create test user with proper credentials
*/

-- Fix workouts table
ALTER TABLE workouts 
ADD COLUMN IF NOT EXISTS duration INTEGER;

-- Fix user_workouts table
ALTER TABLE user_workouts 
DROP COLUMN IF EXISTS workout_name,
ADD COLUMN IF NOT EXISTS workout_name TEXT;

-- Create test user (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'test@example.com'
    ) THEN
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'test@example.com',
            crypt('password123', gen_salt('bf')),
            now(),
            now(),
            now()
        );
    END IF;
END
$$;
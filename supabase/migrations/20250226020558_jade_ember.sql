/*
  # Add location field to class schedules

  1. Changes
    - Add location column to class_schedules table
    - Update existing class schedules with default locations
    - Make location column required

  2. Notes
    - Uses safe ALTER TABLE operation
    - Provides default values for existing records
*/

-- Add location column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'class_schedules'
    AND column_name = 'location'
  ) THEN
    ALTER TABLE class_schedules
    ADD COLUMN location TEXT;
  END IF;
END $$;

-- Update existing records with default locations
UPDATE class_schedules
SET location = 'FitHub Central - 123 Oxford Street, London W1D 2JD'
WHERE location IS NULL;

-- Make location required
ALTER TABLE class_schedules
ALTER COLUMN location SET NOT NULL;
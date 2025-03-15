/*
  # Update class schedules categories and add sample classes

  1. Schema Changes
    - Add difficulty column to class_schedules table
    - Update category check constraint to include new class types
  
  2. Sample Data
    - Insert initial fitness classes with various categories and difficulty levels
*/

-- Update category check constraint and add difficulty column
ALTER TABLE class_schedules 
DROP CONSTRAINT IF EXISTS class_schedules_category_check;

ALTER TABLE class_schedules 
ADD CONSTRAINT class_schedules_category_check 
CHECK (category IN ('yoga', 'pilates', 'spinning', 'weights', 'cycling', 'core_health', 'fit_pump', 'learning_to_lift', 'strength_express', 'hiit', 'boxing'));

ALTER TABLE class_schedules 
ADD COLUMN IF NOT EXISTS difficulty TEXT 
CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));

-- Insert sample classes
INSERT INTO class_schedules (
  name,
  description,
  instructor,
  start_time,
  end_time,
  max_participants,
  category,
  difficulty
) VALUES
  (
    'Morning Yoga Flow',
    'Start your day with energizing yoga poses',
    'Sarah Johnson',
    NOW() + INTERVAL '1 day' + INTERVAL '8 hours',
    NOW() + INTERVAL '1 day' + INTERVAL '9 hours',
    15,
    'yoga',
    'beginner'
  ),
  (
    'Advanced HIIT',
    'High-intensity interval training for maximum results',
    'Mike Thompson',
    NOW() + INTERVAL '1 day' + INTERVAL '17 hours',
    NOW() + INTERVAL '1 day' + INTERVAL '18 hours',
    12,
    'hiit',
    'advanced'
  ),
  (
    'Strength Express',
    'Quick and effective strength training session',
    'Emma Davis',
    NOW() + INTERVAL '1 day' + INTERVAL '12 hours',
    NOW() + INTERVAL '1 day' + INTERVAL '13 hours',
    10,
    'strength_express',
    'intermediate'
  ),
  (
    'Core Health Basics',
    'Foundation exercises for a stronger core',
    'David Wilson',
    NOW() + INTERVAL '2 days' + INTERVAL '9 hours',
    NOW() + INTERVAL '2 days' + INTERVAL '10 hours',
    20,
    'core_health',
    'beginner'
  ),
  (
    'Power Cycling',
    'High-energy indoor cycling workout',
    'Lisa Anderson',
    NOW() + INTERVAL '2 days' + INTERVAL '18 hours',
    NOW() + INTERVAL '2 days' + INTERVAL '19 hours',
    25,
    'cycling',
    'intermediate'
  );
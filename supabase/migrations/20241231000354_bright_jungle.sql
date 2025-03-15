/*
  # Create test user

  1. Changes
    - Insert a test user into auth.users
    - Create corresponding profile in users_profile
  
  2. Security
    - Password is hashed
    - User will have immediate access
*/

-- Insert test user with hashed password
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
  crypt('test123456', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Create user profile
INSERT INTO users_profile (
  id,
  full_name,
  weight,
  height,
  fitness_goal,
  activity_level
) 
SELECT 
  id,
  'Test User',
  75,
  175,
  'general_fitness',
  'moderate'
FROM auth.users
WHERE email = 'test@example.com';
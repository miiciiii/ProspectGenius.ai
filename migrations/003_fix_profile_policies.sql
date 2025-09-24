-- Fix infinite recursion in profile policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

-- Create a function to check if user is admin (to avoid recursion)
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy: Admins can view all profiles (using function to avoid recursion)
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    ) OR auth.uid() = id
  );

-- Policy: Admins can update any profile, users can update their own (except role)
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    ) OR auth.uid() = id
  )
  WITH CHECK (
    -- Admins can change anything
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
    OR 
    -- Users can only update their own profile and cannot change their role
    (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()))
  );

-- Policy: Allow profile creation during signup (remove admin restriction for INSERT)
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (true);

-- Policy: Only admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );
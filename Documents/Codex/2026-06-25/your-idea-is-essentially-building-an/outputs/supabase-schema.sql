-- Safe, rerunnable schema — run this in Supabase SQL Editor
-- ============================================================

-- 0. App state (single JSONB row)
CREATE TABLE IF NOT EXISTS app_state (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'
);

ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "App state access" ON app_state;
CREATE POLICY "App state access"
  ON app_state FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO app_state (id, data) VALUES (1, '{}') ON CONFLICT DO NOTHING;

-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','technician','repairmaster','coordinator','admin','marketplace_buyer')),
  city TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Employee applications
CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL,
  location TEXT,
  details JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can see all applications" ON applications;
CREATE POLICY "Admin can see all applications"
  ON applications FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can update applications" ON applications;
CREATE POLICY "Admin can update applications"
  ON applications FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can insert their own application" ON applications;
CREATE POLICY "Users can insert their own application"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Repair requests
CREATE TABLE IF NOT EXISTS repair_requests (
  id BIGSERIAL PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id),
  brand TEXT,
  model TEXT,
  issue_description TEXT,
  address TEXT,
  city TEXT DEFAULT '',
  back_cover_type TEXT DEFAULT '',
  glass_type TEXT DEFAULT '',
  quotation JSONB DEFAULT '{}',
  status_index INT DEFAULT 0,
  technician_id UUID REFERENCES auth.users(id),
  coordinator_id UUID REFERENCES auth.users(id),
  repairmaster_id UUID REFERENCES auth.users(id),
  pickup_otp TEXT DEFAULT '',
  condition_photos JSONB DEFAULT '[]',
  payment_method TEXT DEFAULT '',
  payment_status TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE repair_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View repair requests" ON repair_requests;
CREATE POLICY "View repair requests"
  ON repair_requests FOR SELECT
  USING (
    auth.uid() = customer_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin','coordinator','technician','repairmaster'))
  );

DROP POLICY IF EXISTS "Customer can insert" ON repair_requests;
CREATE POLICY "Customer can insert"
  ON repair_requests FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Employees can update" ON repair_requests;
CREATE POLICY "Employees can update"
  ON repair_requests FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin','coordinator','technician','repairmaster')));

-- 4. Marketplace listings
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id BIGSERIAL PRIMARY KEY,
  repairmaster_id UUID REFERENCES auth.users(id),
  title TEXT,
  description TEXT,
  base_price NUMERIC DEFAULT 0,
  images JSONB DEFAULT '[]',
  sold BOOLEAN DEFAULT false,
  city TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view listings" ON marketplace_listings;
CREATE POLICY "Anyone can view listings"
  ON marketplace_listings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "RepairMaster can insert" ON marketplace_listings;
CREATE POLICY "RepairMaster can insert"
  ON marketplace_listings FOR INSERT
  WITH CHECK (auth.uid() = repairmaster_id);

DROP POLICY IF EXISTS "RepairMaster can update own" ON marketplace_listings;
CREATE POLICY "RepairMaster can update own"
  ON marketplace_listings FOR UPDATE
  USING (auth.uid() = repairmaster_id);

-- 5. Market orders
CREATE TABLE IF NOT EXISTS market_orders (
  id BIGSERIAL PRIMARY KEY,
  listing_id BIGSERIAL REFERENCES marketplace_listings(id),
  buyer_id UUID REFERENCES auth.users(id),
  status_index INT DEFAULT 0,
  technician_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE market_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View orders" ON market_orders;
CREATE POLICY "View orders"
  ON market_orders FOR SELECT
  USING (
    auth.uid() = buyer_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin','coordinator','technician'))
  );

DROP POLICY IF EXISTS "Buyer can insert" ON market_orders;
CREATE POLICY "Buyer can insert"
  ON market_orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Employees can update orders" ON market_orders;
CREATE POLICY "Employees can update orders"
  ON market_orders FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin','coordinator','technician')));

-- 6. Quotation parts
CREATE TABLE IF NOT EXISTS quotation_parts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quotation_parts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read parts" ON quotation_parts;
CREATE POLICY "Anyone can read parts"
  ON quotation_parts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage parts" ON quotation_parts;
CREATE POLICY "Admin can manage parts"
  ON quotation_parts FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- 7. Service charge config
CREATE TABLE IF NOT EXISTS service_charge_config (
  id INT PRIMARY KEY DEFAULT 1,
  percentage NUMERIC DEFAULT 10
);

ALTER TABLE service_charge_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read config" ON service_charge_config;
CREATE POLICY "Anyone can read config"
  ON service_charge_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can update config" ON service_charge_config;
CREATE POLICY "Admin can update config"
  ON service_charge_config FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- 8. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT DEFAULT '',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see own notifications" ON notifications;
CREATE POLICY "Users can see own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- 9. Job postings
CREATE TABLE IF NOT EXISTS job_postings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read job postings" ON job_postings;
CREATE POLICY "Anyone can read job postings"
  ON job_postings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage job postings" ON job_postings;
CREATE POLICY "Admin can manage job postings"
  ON job_postings FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Insert default data (safe — uses ON CONFLICT)
INSERT INTO job_postings (title, role, location, description) VALUES
  ('Experienced Mobile Technician', 'Technician', 'Mumbai West', 'Repair mobile phones, diagnose issues, replace parts. 2+ years experience required.'),
  ('Store Partner - RepairingMaster', 'RepairingMaster', 'Bengaluru Central', 'Run your own repair shop under RepairingMaster brand. Own store required.'),
  ('Logistics Coordinator', 'Coordinator', 'Delhi NCR', 'Coordinate pickups, deliveries, and technician assignments. Good communication skills.'),
  ('Operations Admin', 'Admin', 'All India', 'Manage platform operations, approve applications, oversee performance.')
ON CONFLICT DO NOTHING;

INSERT INTO service_charge_config (percentage) VALUES (10) ON CONFLICT DO NOTHING;

INSERT INTO quotation_parts (name, price, category) VALUES
  ('Battery', 500, 'Battery'),
  ('Charging Port', 350, 'Charging'),
  ('Display Screen', 1200, 'Display'),
  ('Touch Panel', 800, 'Display'),
  ('Speaker', 300, 'Audio'),
  ('Microphone', 250, 'Audio'),
  ('Camera Module', 700, 'Camera'),
  ('Power Button', 200, 'Buttons'),
  ('Volume Button', 200, 'Buttons'),
  ('Back Cover', 250, 'Body'),
  ('Charging IC', 400, 'Charging'),
  ('SIM Card Slot', 150, 'Misc');

-- Auto-confirm emails for test accounts (run this if "Confirm email" is ON in Supabase Auth)
-- Create or replace the function
CREATE OR REPLACE FUNCTION public.auto_confirm_test_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users SET email_confirmed_at = now() WHERE id = NEW.id AND email LIKE '%@test.repairmaster';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_test_user();

-- Grant anon role access to all tables
GRANT ALL ON app_state, profiles, applications, repair_requests, marketplace_listings, market_orders, quotation_parts, service_charge_config, notifications, job_postings TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

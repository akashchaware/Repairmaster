-- Run this in Supabase SQL Editor
-- ============================================

-- 0. App state (single JSONB row — simplest migration from localStorage)
CREATE TABLE app_state (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'
);

ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

-- Admin can read/write app_state; for now allow all authenticated users (app uses anon key)
CREATE POLICY "App state access"
  ON app_state FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO app_state (id, data) VALUES (1, '{}') ON CONFLICT DO NOTHING;

-- 1. Profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','technician','repairmaster','coordinator','admin','marketplace_buyer')),
  city TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read any profile (for displaying names)
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Employee applications
CREATE TABLE applications (
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

-- Admin can see all; applicant can see their own
CREATE POLICY "Admin can see all applications"
  ON applications FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') OR auth.uid() = user_id);

CREATE POLICY "Admin can update applications"
  ON applications FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Users can insert their own application"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Repair requests
CREATE TABLE repair_requests (
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

-- Customer sees own; employees see all
CREATE POLICY "View repair requests"
  ON repair_requests FOR SELECT
  USING (
    auth.uid() = customer_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin','coordinator','technician','repairmaster'))
  );

CREATE POLICY "Customer can insert"
  ON repair_requests FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Employees can update"
  ON repair_requests FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin','coordinator','technician','repairmaster')));

-- 4. Marketplace listings
CREATE TABLE marketplace_listings (
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

-- Anyone can view unsold listings
CREATE POLICY "Anyone can view listings"
  ON marketplace_listings FOR SELECT
  USING (true);

-- RepairMaster can insert/update own
CREATE POLICY "RepairMaster can insert"
  ON marketplace_listings FOR INSERT
  WITH CHECK (auth.uid() = repairmaster_id);

CREATE POLICY "RepairMaster can update own"
  ON marketplace_listings FOR UPDATE
  USING (auth.uid() = repairmaster_id);

-- 5. Market orders
CREATE TABLE market_orders (
  id BIGSERIAL PRIMARY KEY,
  listing_id BIGSERIAL REFERENCES marketplace_listings(id),
  buyer_id UUID REFERENCES auth.users(id),
  status_index INT DEFAULT 0,
  technician_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE market_orders ENABLE ROW LEVEL SECURITY;

-- Buyer sees own; employees see all
CREATE POLICY "View orders"
  ON market_orders FOR SELECT
  USING (
    auth.uid() = buyer_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin','coordinator','technician'))
  );

CREATE POLICY "Buyer can insert"
  ON market_orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Employees can update orders"
  ON market_orders FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin','coordinator','technician')));

-- 6. Quotation parts (template)
CREATE TABLE quotation_parts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quotation_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read parts"
  ON quotation_parts FOR SELECT USING (true);

CREATE POLICY "Admin can manage parts"
  ON quotation_parts FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- 7. Service charge config
CREATE TABLE service_charge_config (
  id INT PRIMARY KEY DEFAULT 1,
  percentage NUMERIC DEFAULT 10
);

ALTER TABLE service_charge_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read config"
  ON service_charge_config FOR SELECT USING (true);

CREATE POLICY "Admin can update config"
  ON service_charge_config FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- 8. Notifications (in-app)
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
  link TEXT DEFAULT '',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- 9. Job postings (recruitment)
CREATE TABLE job_postings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','Closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read job postings"
  ON job_postings FOR SELECT USING (true);

CREATE POLICY "Admin can manage job postings"
  ON job_postings FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Insert default job postings
INSERT INTO job_postings (title, role, location, description) VALUES
  ('Experienced Mobile Technician', 'Technician', 'Mumbai West', 'Repair mobile phones, diagnose issues, replace parts. 2+ years experience required.'),
  ('Store Partner - RepairingMaster', 'RepairingMaster', 'Bengaluru Central', 'Run your own repair shop under RepairingMaster brand. Own store required.'),
  ('Logistics Coordinator', 'Coordinator', 'Delhi NCR', 'Coordinate pickups, deliveries, and technician assignments. Good communication skills.'),
  ('Operations Admin', 'Admin', 'All India', 'Manage platform operations, approve applications, oversee performance.');

-- Insert default service charge
INSERT INTO service_charge_config (percentage) VALUES (10) ON CONFLICT DO NOTHING;

-- Insert default quotation parts
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

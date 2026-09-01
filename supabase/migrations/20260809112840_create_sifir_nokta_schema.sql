/*
# Sıfır Nokta — Full Database Schema

## Overview
Creates the complete database schema for the Sıfır Nokta addiction recovery app.
All tables are user-scoped with Row Level Security policies.

## New Tables
1. user_addictions — tracks which addictions a user is fighting, with start dates and daily costs
2. daily_logs — daily check-in records with craving intensity, mood, trigger, usage
3. risk_scores — AI risk engine assessment results (score, level, reasons, recommendations)
4. achievements — unlocked achievements per user
5. notifications — scheduled and read notifications
6. support_centers — YEDAM/AMATEM support center locations (shared/public data)

## Security
- RLS enabled on ALL tables
- user_addictions, daily_logs, risk_scores, achievements, notifications: owner-scoped (TO authenticated, auth.uid() = user_id)
- support_centers: public read (TO anon, authenticated) since it's shared reference data
- Owner columns default to auth.uid() so inserts work even when client omits user_id
*/

-- User addictions table
CREATE TABLE IF NOT EXISTS user_addictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  addiction_type text NOT NULL CHECK (addiction_type IN ('smoking', 'alcohol', 'gambling', 'substance')),
  start_date timestamptz NOT NULL DEFAULT now(),
  daily_cost numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_addictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_addictions" ON user_addictions;
CREATE POLICY "select_own_addictions" ON user_addictions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addictions" ON user_addictions;
CREATE POLICY "insert_own_addictions" ON user_addictions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addictions" ON user_addictions;
CREATE POLICY "update_own_addictions" ON user_addictions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addictions" ON user_addictions;
CREATE POLICY "delete_own_addictions" ON user_addictions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Daily logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  addiction_type text NOT NULL CHECK (addiction_type IN ('smoking', 'alcohol', 'gambling', 'substance')),
  craving_intensity integer NOT NULL CHECK (craving_intensity >= 1 AND craving_intensity <= 10),
  mood text NOT NULL CHECK (mood IN ('good', 'normal', 'stressed', 'sad', 'angry', 'anxious')),
  trigger text NOT NULL CHECK (trigger IN ('stress', 'loneliness', 'social', 'boredom', 'anger', 'financial', 'habit', 'environment', 'other')),
  usage_occurred boolean NOT NULL DEFAULT false,
  note text,
  context_location text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_logs" ON daily_logs;
CREATE POLICY "select_own_logs" ON daily_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_logs" ON daily_logs;
CREATE POLICY "insert_own_logs" ON daily_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_logs" ON daily_logs;
CREATE POLICY "update_own_logs" ON daily_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_logs" ON daily_logs;
CREATE POLICY "delete_own_logs" ON daily_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Risk scores table
CREATE TABLE IF NOT EXISTS risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high')),
  reasons text[] NOT NULL DEFAULT '{}',
  recommendations text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_risks" ON risk_scores;
CREATE POLICY "select_own_risks" ON risk_scores FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_risks" ON risk_scores;
CREATE POLICY "insert_own_risks" ON risk_scores FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_risks" ON risk_scores;
CREATE POLICY "delete_own_risks" ON risk_scores FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_achievements" ON achievements;
CREATE POLICY "select_own_achievements" ON achievements FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_achievements" ON achievements;
CREATE POLICY "insert_own_achievements" ON achievements FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_achievements" ON achievements;
CREATE POLICY "delete_own_achievements" ON achievements FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Support centers table (shared/public reference data)
CREATE TABLE IF NOT EXISTS support_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  phone text NOT NULL
);

ALTER TABLE support_centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_support_centers" ON support_centers;
CREATE POLICY "read_support_centers" ON support_centers FOR SELECT
  TO anon, authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_created_at ON daily_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_scores_user_id ON risk_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addictions_user_id ON user_addictions(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

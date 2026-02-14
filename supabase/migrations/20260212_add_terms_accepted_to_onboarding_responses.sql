-- Fix: "Database error saving new user" - column "terms_accepted" does not exist
-- Run this in Supabase Dashboard → SQL Editor

-- Add terms_accepted if missing (used by auth trigger on new user creation)
ALTER TABLE onboarding_responses
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false;

-- Add privacy_accepted if missing (app expects it in updateOnboardingResponse)
ALTER TABLE onboarding_responses
ADD COLUMN IF NOT EXISTS privacy_accepted boolean DEFAULT false;

-- Add marketing_consent if missing (app expects it in updateOnboardingResponse)
ALTER TABLE onboarding_responses
ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false;

-- Add contact_method if missing (app expects it in updateOnboardingResponse)
ALTER TABLE onboarding_responses
ADD COLUMN IF NOT EXISTS contact_method text;

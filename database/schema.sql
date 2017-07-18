
CREATE TYPE verification_status AS ENUM('verified', 'bounced', 'failed', 'unverified');
CREATE TYPE delivery_type AS ENUM('Email', 'SMS', 'Push', 'Voice', 'Web');

CREATE OR REPLACE FUNCTION is_timezone( tz TEXT ) RETURNS BOOLEAN as $$
DECLARE
  date TIMESTAMPTZ;
BEGIN
  date := now() AT TIME ZONE tz;
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ language plpgsql STABLE;

CREATE DOMAIN timezone AS TEXT CHECK ( is_timezone( value ) );

CREATE TABLE account (
  id            bigserial           PRIMARY KEY,
  createdb      timestamp           NOT NULL DEFAULT NOW(),
  updated       timestamp           NOT NULL DEFAULT NOW(),
  name          text                NOT NULL,
  email         text                UNIQUE NOT NULL,
  email_status  verification_status NOT NULL DEFAULT 'unverified',
  sms           text                NULL,
  sms_status    verification_status NULL,
  voice         text                NULL,
  voice_status  verification_status NULL,
  delivery      delivery_type       NOT NULL,
  language      text                NULL,
  timezone      timezone            NOT NULL DEFAULT 'America/Toronto',
  active        Boolean             NOT NULL DEFAULT false
  -- geo
  -- groups
  -- tags
);

-- CREATE TABLE transport_types (
--  id            bigserial           PRIMARY KEY,
--  name          text                UNIQUE NOT NULL,
-- )

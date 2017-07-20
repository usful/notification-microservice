
CREATE TYPE verification_status AS ENUM('verified', 'bounced', 'failed', 'unverified');
CREATE TYPE delivery_type AS ENUM('email', 'sms', 'push', 'voice', 'web');

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

-- TODO: not enforcing uniqueness on email, sms, voice on delevopment, enforce later
CREATE TABLE account (
  id              bigserial           PRIMARY KEY,
  external_id     bigint              UNIQUE NOT NULL,
  created         timestamp           NOT NULL DEFAULT NOW(),
  updated         timestamp           NOT NULL DEFAULT NOW(),
  name            text                NOT NULL,
  email           text                NULL,
  email_status    verification_status NOT NULL DEFAULT 'unverified',
  sms             text                NULL,
  sms_status      verification_status NOT NULL DEFAULT 'unverified',
  voice           text                NULL,
  voice_status    verification_status NOT NULL DEFAULT 'unverified',
  delivery        delivery_type[]     NULL,
  language        text                NULL,
  timezone        timezone            NOT NULL DEFAULT 'America/Toronto',
  active          boolean             NOT NULL DEFAULT true
  -- geo
  -- groups
  -- tags
);

CREATE TABLE template (
  id            bigserial           PRIMARY KEY,
  created       timestamp           NOT NULL DEFAULT NOW(),
  updated       timestamp           NOT NULL DEFAULT NOW(),
  name          text                NOT NULL,
  email         text                NULL,
  sms           text                NULL,
  voice         text                NULL,
  web           text                NULL,
  push          text                NULL
);

CREATE TABLE notification (
  id            bigserial           PRIMARY KEY,
  created       timestamp           NOT NULL DEFAULT NOW(),
  updated       timestamp           NOT NULL DEFAULT NOW(),
  by            delivery_type[]     NOT NULL,
  required_by   delivery_type[]     NULL,
  at            timestamp           NOT NULL,
  template      bigint              NOT NULL REFERENCES template(id),
  data          jsonb               NULL,
  sent          timestamp           NULL
  -- user_user_locale
  -- geo
  -- groups
  -- tags
);

CREATE TABLE notification_users (
  id                 bigserial      PRIMARY KEY,
  notification_id    bigint         NOT NULL REFERENCES notification(id),
  user_id            bigint         NOT NULL REFERENCES account(id)
);


-- NOTICE: enums should be the same as in constants.js
CREATE TYPE verification_status AS ENUM('verified', 'bounced', 'failed', 'unverified');
CREATE TYPE delivery_type AS ENUM('email', 'sms', 'push', 'voice', 'web');
CREATE TYPE notification_status AS ENUM('new', 'failed', 'sent', 'processing');
CREATE TYPE webhook_type as ENUM('NotificationFailed', 'NotificationSuccess', 'UserDeliveryFailed', 'UserDeliveryConfirmed', 'SystemError');

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

-- TODO: not enforcing uniqueness on email, sms, voice on development, enforce later
CREATE TABLE account (
  id              bigserial           PRIMARY KEY,
  external_id     text                UNIQUE NOT NULL,
  created         timestamp           NOT NULL DEFAULT NOW(),
  updated         timestamp           NOT NULL DEFAULT NOW(),
  name            text                NOT NULL,
  email           text                NULL,
  email_status    verification_status NOT NULL DEFAULT 'unverified',
  sms             text                NULL,
  sms_status      verification_status NOT NULL DEFAULT 'unverified',
  voice           text                NULL,
  voice_status    verification_status NOT NULL DEFAULT 'unverified',
  push            text                NULL,
  push_status     verification_status NOT NULL DEFAULT 'unverified',
  web             text                NULL,
  web_status      verification_status NOT NULL DEFAULT 'unverified',
  delivery        delivery_type[]     NULL,
  language        text                NULL,
  timezone        timezone            NOT NULL DEFAULT 'America/Toronto',
  active          boolean             NOT NULL DEFAULT true
  -- geo
  -- tags
);

CREATE TABLE account_groups (
  id                bigserial,
  group_name        text,
  user_id           bigint          NOT NULL REFERENCES account(id),
  PRIMARY KEY(group_name, user_id) -- searched by group_name so group name first
);

CREATE TABLE account_tags (
  id                bigserial,
  tag_name          text,
  user_id           bigint          NOT NULL REFERENCES account(id),
  PRIMARY KEY(tag_name, user_id) -- searched by tag_name so group name first
);

CREATE TABLE template (
  id            bigserial           PRIMARY KEY,
  created       timestamp           NOT NULL DEFAULT NOW(),
  updated       timestamp           NOT NULL DEFAULT NOW(),
  name          text                NOT NULL,
  email         jsonb               NULL,
  sms           jsonb               NULL,
  voice         jsonb               NULL,
  web           jsonb               NULL,
  push          jsonb               NULL
);

CREATE TABLE notification (
  id            bigserial           PRIMARY KEY,
  created       timestamp           NOT NULL DEFAULT NOW(),
  updated       timestamp           NOT NULL DEFAULT NOW(),
  by            delivery_type[]     NOT NULL,
  at            timestamp           NOT NULL,
  template_id   bigint              NOT NULL REFERENCES template(id),
  users         text[]              NULL,
  groups        text[]              NULL,
  tags          text[]              NULL,
  required_by   delivery_type[]     NULL,
  data          jsonb               NULL,
  sent          timestamp           NULL,
  status        notification_status NOT NULL DEFAULT 'new'::notification_status
  -- user_user_locale
  -- geo
);

CREATE TABLE webhook (
  id            bigserial           PRIMARY KEY,
  url           text                UNIQUE NOT NULL,
  type          webhook_type[]        NOT NULL DEFAULT ARRAY[]::webhook_type[],
  transport    delivery_type[]        NOT NULL DEFAULT ARRAY[]::delivery_type[]
);
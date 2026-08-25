DROP TABLE IF EXISTS email_log;
DROP TABLE IF EXISTS triggers;
DROP TABLE IF EXISTS courses_database;

CREATE TABLE courses_database(
    slug text PRIMARY KEY,
    semester_code text NOT NULL,
    dept text NOT NULL,
    course_code text NOT NULL,
    section text NOT NULL,
    course_name text NOT NULL,
    instructor text NOT NULL,
    campus text NOT NULL,
    enrolled int NOT NULL,
    waitlist int NOT NULL DEFAULT 0,
    capacity int NOT NULL,
    observed_at timestamptz NOT NULL
);

CREATE TABLE triggers(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug text NOT NULL REFERENCES courses_database(slug),
    condition text NOT NULL,
    threshold int,
    fired boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    fired_at timestamptz,
    fired_enrolled int,
    fired_capacity int,
    fired_waitlist int,
    CONSTRAINT triggers_user_slug_condition_unique UNIQUE(user_id, slug, condition),
    CONSTRAINT triggers_condition_valid CHECK (condition IN ('open_seat', 'waitlist_below')),
    CONSTRAINT triggers_threshold_matches_condition CHECK ((condition = 'waitlist_below' AND threshold IS NOT NULL AND threshold > 0) OR (condition = 'open_seat' AND threshold IS NULL)),
    CONSTRAINT triggers_fired_at_matches_fired CHECK ((fired = false AND fired_at IS NULL) OR (fired = true AND fired_at IS NOT NULL))
);


CREATE TABLE email_log(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trigger_id INT REFERENCES triggers(id) ON DELETE SET NULL,
    sent_at timestamptz NOT NULL DEFAULT NOW(),
    resend_message_id text,
    status text NOT NULL,
    CONSTRAINT email_log_status_valid CHECK (status IN ('sent', 'failed'))
);




ALTER TABLE courses_database ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_database: read" on courses_database 
    for select to anon, authenticated using (true);


ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "triggers: read" ON triggers
    for select to authenticated
    using (user_id=auth.uid());
CREATE POLICY "triggers: create" ON triggers
    for insert to authenticated
    with CHECK(user_id=auth.uid());
CREATE POLICY "triggers: update" ON triggers
    for update to authenticated
    using (user_id=auth.uid())
    WITH CHECK (user_id=auth.uid());
CREATE POLICY "triggers: delete" ON triggers
    for delete to authenticated
    using (user_id=auth.uid());


ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "email_log: read" ON email_log
    for select to authenticated
    using (user_id=auth.uid());

ALTER TABLE email_log
  ADD COLUMN slug text,
  ADD COLUMN condition text;
WITH all_triggers AS (
SELECT triggers.id AS trigger_id, triggers.slug, user_id, email, condition, threshold, dept, course_code, section, course_name, campus, enrolled, waitlist, capacity, observed_at 
FROM triggers
JOIN courses_database ON triggers.slug=courses_database.slug
JOIN auth.users ON triggers.user_id=auth.users.id
WHERE triggers.fired=false
)
SELECT *
FROM all_triggers
WHERE (
    (condition='waitlist_below' AND waitlist<threshold)
    OR (condition='open_seat' AND enrolled<capacity AND waitlist = 0)
)
INSERT INTO courses_database(slug, semester_code,dept,course_code,section,course_name,instructor,campus,enrolled,waitlist,capacity,observed_at)
VALUES (%s, %s, %s,%s, %s, %s,%s, %s, %s,%s, %s, %s)
ON CONFLICT (slug)
DO UPDATE SET 
enrolled = EXCLUDED.enrolled,
capacity = EXCLUDED.capacity,
waitlist = EXCLUDED.waitlist,
campus = EXCLUDED.campus,
instructor = EXCLUDED.instructor,
course_name = EXCLUDED.course_name,
observed_at = EXCLUDED.observed_at;

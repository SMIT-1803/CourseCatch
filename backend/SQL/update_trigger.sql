UPDATE triggers
SET fired = true,
    fired_at = NOW(),
    fired_enrolled = %s,
    fired_waitlist = %s,
    fired_capacity = %s
WHERE id = %s;
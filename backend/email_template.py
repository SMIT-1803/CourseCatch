def waitlist_alert(dept, course_code, section, course_name, campus, enrolled, waitlist, capacity, threshold, observed_at):
    sec = (section or "").upper()
    course = f"{dept} {course_code} {sec}"

    subject = f"🔔 Waitlist Update: {course} down to {waitlist}"

    body = [
        "Dear CourseCatcher,",
        "",
        f"The waitlist for your tracked course has dropped below {threshold}!!",
        "",
        "Course Details:",
        f"• Course: {course} — {course_name}",
        f"• Campus: {campus}",
        "",
        "Current Status:",
        f"• Current Waitlist: {waitlist}",
        f"• Current Enrollment: {enrolled} / {capacity}",
        f"• Time Checked: {observed_at}",
        "",
        "Sincerely,",
        "The CourseCatch Team",
    ]
    return subject, "\n".join(body)

def openseat_alert(dept, course_code, section, course_name, campus, enrolled, waitlist, capacity, observed_at):
    sec = (section or "").upper()
    course = f"{dept} {course_code} {sec}"
    seats = capacity - enrolled

    subject = f"🎉 Seat Available: {course} — {seats} open"

    body = [
        "Dear CourseCatcher,",
        "",
        "A seat has opened up!!",
        "",
        "Course Details:",
        f"• Course: {course} — {course_name}",
        f"• Campus: {campus}",
        "",
        "Current Status:",
        f"• Seats Available: {seats}",
        f"• Current Enrollment: {enrolled} / {capacity}",
        f"• Current Waitlist: {waitlist}",
        f"• Time Checked: {observed_at}",
        "",
        "You can enroll through goSFU: https://go.sfu.ca/",
        "",
        "Sincerely,",
        "The CourseCatch Team",
    ]
    return subject, "\n".join(body)
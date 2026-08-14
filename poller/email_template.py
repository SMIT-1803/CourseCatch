def _footer(slug, observed_at):
    return [
        "",
        f"Check on goSFU: https://go.sfu.ca"
        "",
        f"• As of: {observed_at}",
        "",
        f"Section details: https://coursys.sfu.ca/browse/info/{slug}",
        "",
        "Please note:",
        "• Seats may be reserved for specific programs, or blocked by an Check goSFU to confirm whether you can enroll.",
        "• Enrollment data is refreshed once daily from Coursys, so this may have changed since it was observed.",
        "",
        "Sincerely,",
        "The CourseCatch Team",
        "",
        "CourseCatch is not affiliated with or endorsed by Simon Fraser University.",
    ]


def waitlist_alert(
    dept,
    course_code,
    section,
    course_name,
    campus,
    enrolled,
    waitlist,
    capacity,
    threshold,
    observed_at,
    slug,
):
    course = f"{dept} {course_code} {(section or '').upper()}"

    if waitlist == 0:
        subject = f"{course} — waitlist cleared"
        headline = "The waitlist for this section is now empty."
    else:
        subject = f"{course} — waitlist down to {waitlist}"
        headline = f"The waitlist for this section has dropped below {threshold}."

    body = [
        "Dear CourseCatcher,",
        "",
        headline,
        "",
        "Course Details:",
        f"• Course: {course} — {course_name}",
        f"• Campus: {campus}",
        "",
        "Observed Status:",
        f"• Waitlist: {waitlist}",
        f"• Enrollment: {enrolled} / {capacity}",
    ] + _footer(slug, observed_at)

    return subject, "\n".join(body)


def openseat_alert(
    dept,
    course_code,
    section,
    course_name,
    campus,
    enrolled,
    waitlist,
    capacity,
    observed_at,
    slug,
):
    course = f"{dept} {course_code} {(section or '').upper()}"
    free = capacity - enrolled

    subject = f"{course} — seat available, no waitlist"

    body = [
        "Dear CourseCatcher,",
        "",
        "This section now shows free seats and an empty waitlist.",
        "",
        "Course Details:",
        f"• Course: {course} — {course_name}",
        f"• Campus: {campus}",
        "",
        "Observed Status:",
        f"• Free seats: {free}",
        f"• Enrollment: {enrolled} / {capacity}",
        f"• Waitlist: {waitlist}",
    ] + _footer(slug, observed_at)

    return subject, "\n".join(body)

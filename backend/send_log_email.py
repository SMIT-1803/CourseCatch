import os
import resend
from email_template import waitlist_alert, openseat_alert
from zoneinfo import ZoneInfo
from datetime import datetime, timezone
from pathlib import Path

RESEND_API_KEY = os.environ["RESEND_API_KEY"]


def send_email(to, subject, body):
    params: resend.Emails.SendParams = {
        "from": "CourseCatch <alerts@mail.coursecatch.app>",
        "to": [to],
        "subject": subject,
        "text": body,
    }
    response = resend.Emails.send(params)
    return response.get("id") if response else None


def sort_triggers(triggers_to_fire):
    sorted_triggers = []
    for trigger in triggers_to_fire:
        trigger_id = trigger["trigger_id"]
        user_id = trigger["user_id"]
        email = trigger["email"]
        condition = trigger["condition"]
        dept = trigger["dept"]
        course_code = trigger["course_code"]
        section = trigger["section"]
        course_name = trigger["course_name"]
        campus = trigger["campus"]
        enrolled = trigger["enrolled"]
        waitlist = trigger["waitlist"]
        capacity = trigger["capacity"]
        observed_at = trigger["observed_at"].astimezone(ZoneInfo("America/Vancouver")).strftime("%B %d, %Y at %I:%M %p")
        if condition == "waitlist_below":
            threshold = trigger["threshold"]
            subject, body = waitlist_alert(
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
            )
            sorted_triggers.append(
                {
                    "subject": subject,
                    "body": body,
                    "trigger_id": trigger_id,
                    "user_id": user_id,
                    "email": email,
                    "enrolled": enrolled,
                    "waitlist": waitlist,
                    "capacity": capacity,
                }
            )

        elif condition == "open_seat":
            subject, body = openseat_alert(
                dept,
                course_code,
                section,
                course_name,
                campus,
                enrolled,
                waitlist,
                capacity,
                observed_at,
            )
            sorted_triggers.append(
                {
                    "subject": subject,
                    "body": body,
                    "trigger_id": trigger_id,
                    "user_id": user_id,
                    "email": email,
                    "enrolled": enrolled,
                    "waitlist": waitlist,
                    "capacity": capacity,
                }
            )
    return sorted_triggers


def log_email_and_update_trigger(
    conn,
    user_id,
    trigger_id,
    sent_at,
    resend_message_id,
    status,
    enrolled,
    waitlist,
    capacity,
):
    log_email = Path(__file__).parent / "SQL" / "log_email.sql"
    with open(log_email, "r") as f:
        log_email_query = f.read()
    with conn.cursor() as cur:
        if status == "sent":
            update_trigger = Path(__file__).parent / "SQL" / "update_trigger.sql"
            with open(update_trigger, "r") as f:
                update_trigger_query = f.read()
                cur.execute(
                    log_email_query,
                    (user_id, trigger_id, sent_at, resend_message_id, status),
                )
                cur.execute(update_trigger_query, (enrolled,waitlist,capacity,trigger_id))
        else:
            cur.execute(
                log_email_query,
                (user_id, trigger_id, sent_at, resend_message_id, status),
            )
        conn.commit()


def send_and_log_emails(conn, triggers_to_fire):
    sorted_triggers = sort_triggers(triggers_to_fire)
    for trigger in sorted_triggers:
        receiver = trigger["email"]
        subject = trigger["subject"]
        user_id = trigger["user_id"]
        trigger_id = trigger["trigger_id"]
        enrolled = trigger["enrolled"]
        waitlist = trigger["waitlist"]
        capacity = trigger["capacity"]
        body = trigger["body"]
        sent_at = datetime.now(timezone.utc)
        resend_message_id = send_email(receiver, subject, body)
        print(f"\nResend ID: {resend_message_id}\n")
        status = ""
        status = "sent" if resend_message_id else "failed"
        log_email_and_update_trigger(
            conn,
            user_id,
            trigger_id,
            sent_at,
            resend_message_id,
            status,
            enrolled,
            waitlist,
            capacity,
        )

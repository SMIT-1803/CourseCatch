from data_parser import get_latest_data
from db import get_database_changes
from upsert import upsert_change_to_db
from triggers import get_evaluated_triggers
from send_log_email import send_and_log_emails
from datetime import date
from dotenv import load_dotenv
import os
import sys

load_dotenv()


def within_window():
    raw = os.environ.get("WINDOW_CLOSE")
    if not raw:
        print("EXIT: WINDOW_CLOSE not set — refusing to run")
        return False

    try:
        window_close = date.fromisoformat(raw)
    except ValueError:
        print(f"EXIT: WINDOW_CLOSE is not a valid ISO date: {raw!r}")
        return False

    today = date.today()
    if today > window_close:
        print(f"EXIT: outside add/drop window (today {today}, closed {window_close})")
        return False
    return True


def main():
    if not within_window():
        sys.exit(0)

    latest_data = get_latest_data()
    conn, the_changes = get_database_changes(latest_data)
    upsert_change_to_db(conn, the_changes)
    triggers_to_fire = get_evaluated_triggers(conn)
    send_and_log_emails(conn, triggers_to_fire)
    conn.close()


if __name__ == "__main__":
    main()
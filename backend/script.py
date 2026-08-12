from data_parser import get_latest_data
from db import get_database_changes
from upsert import upsert_change_to_db
from triggers import get_evaluated_triggers 
from send_log_email import send_and_log_emails


def main():
    latest_data = get_latest_data()
    conn, the_changes = get_database_changes(latest_data)
    upsert_change_to_db(conn, the_changes)
    triggers_to_fire = get_evaluated_triggers(conn)
    send_and_log_emails(conn,triggers_to_fire)
    conn.close()

if __name__ == "__main__":
    main()
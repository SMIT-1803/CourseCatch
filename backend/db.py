from dotenv import load_dotenv
import os
import psycopg
from psycopg.rows import dict_row
import json
from pathlib import Path

load_dotenv()


DATABASE_URL = os.environ["DATABASE_URL"]


def get_database_data(db_conn):
    with db_conn.cursor(row_factory=dict_row) as cur:
        cur.execute(
            "SELECT slug,semester_code, dept,course_code,section,course_name,instructor,campus, enrolled, capacity, waitlist,observed_at FROM courses_database"
        )
        return {
            row["slug"]: {
                "semester_code": row["semester_code"],
                "dept": row["dept"],
                "course_code": row["course_code"],
                "section": row["section"],
                "course_name": row["course_name"],
                "instructor": row["instructor"],
                "campus": row["campus"],
                "enrolled": row["enrolled"],
                "capacity": row["capacity"],
                "waitlist": row["waitlist"],
                "observed_at": row["observed_at"],
            }
            for row in cur
        }


def find_diff(database_state, fresh_database_records):
    the_changes = []
    for record in fresh_database_records:
        slug = record["slug"]
        database_record = database_state.get(slug)
        if database_record == None:
            the_changes.append(record)
            continue
        if (
            database_record["instructor"] != record["instructor"]
            or database_record["campus"] != record["campus"]
            or database_record["enrolled"] != record["enrolled"]
            or database_record["capacity"] != record["capacity"]
            or database_record["waitlist"] != record["waitlist"]
        ):
            the_changes.append(record)
            continue
    return the_changes

def connect_db():
    conn = psycopg.connect(DATABASE_URL, prepare_threshold=None)
    return conn

def get_database_changes():
    conn = connect_db()
    database_state = get_database_data(conn)
    snapshots_dir = Path(__file__).parent.parent / "snapshots"
    snapshot_file = next(snapshots_dir.glob("*.json"))
    with open(snapshot_file, "r") as f:
        fetchRecord = json.load(f)
        the_changes = find_diff(database_state, fetchRecord)
    conn.close()
    return the_changes


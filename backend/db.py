from dotenv import load_dotenv
import os
import psycopg
from psycopg.rows import dict_row
import json
from pathlib import Path

load_dotenv()


DATABASE_URL = os.environ["DATABASE_URL"]


def get_database_data(conn):
    with conn.cursor(row_factory=dict_row) as cur:
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
    for row in fresh_database_records:
        slug = row["slug"]
        database_record = database_state.get(slug)
        record = (
            row["slug"],
            row["semester_code"],
            row["dept"],
            row["course_code"],
            row["section"],
            row["course_name"],
            row["instructor"],
            row["campus"],
            row["enrolled"],
            row["capacity"],
            row["waitlist"],
            row["observed_at"],
        )
        if database_record == None:
            the_changes.append(record)
            continue
        if (
            database_record["instructor"] != row["instructor"]
            or database_record["campus"] != row["campus"]
            or database_record["enrolled"] != row["enrolled"]
            or database_record["capacity"] != row["capacity"]
            or database_record["waitlist"] != row["waitlist"]
        ):
            the_changes.append(record)
            continue
    return the_changes


def connect_db():
    conn = psycopg.connect(DATABASE_URL, prepare_threshold=None)
    return conn


def get_database_changes(latest_data):
    conn = connect_db()
    database_state = get_database_data(conn)
    the_changes = find_diff(database_state, latest_data)
    return conn, the_changes

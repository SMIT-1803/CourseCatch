from pathlib import Path
from psycopg.rows import dict_row


def get_evaluated_triggers(conn):
    sql_file_path = Path(__file__).parent / "SQL" / "triggers.sql"
    with open(sql_file_path, "r") as f:
        query = f.read()
    with conn.cursor(row_factory=dict_row) as cur:
        try:
            cur.execute(query)
            return [
                {
                    "trigger_id": row["trigger_id"],
                    "slug": row["slug"],
                    "user_id": row["user_id"],
                    "email": row["email"],
                    "condition": row["condition"],
                    "threshold": row["threshold"],
                    "dept": row["dept"],
                    "course_code": row["course_code"],
                    "section": row["section"],
                    "course_name": row["course_name"],
                    "campus": row["campus"],
                    "enrolled": row["enrolled"],
                    "waitlist": row["waitlist"],
                    "capacity": row["capacity"],
                    "observed_at": row["observed_at"],
                }
                for row in cur
            ]
        except Exception as e:
            raise RuntimeError(f"Error while getting triggers: {e}")

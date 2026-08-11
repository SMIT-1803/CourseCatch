from dotenv import load_dotenv
import os
import psycopg
from psycopg.rows import dict_row

load_dotenv()


DATABASE_URL = os.environ['DATABASE_URL']


def get_supabase_data(db_conn):
    with db_conn.cursor(row_factory=dict_row) as cur:
        cur.execute("SELECT slug, enrolled, capacity, waitlist FROM courses_database")
        return {
            row["slug"]: {
                "enrolled": row["enrolled"],
                "capacity": row["capacity"],
                "waitlist": row["waitlist"],
            }
            for row in cur
        }


def main():
    try:
        with psycopg.connect(DATABASE_URL, prepare_threshold=None) as conn:
            state = get_supabase_data(conn)
        print(state)
    except Exception as e :
        print(f"Connection or query failed: {e}")

if __name__ == "__main__": main()

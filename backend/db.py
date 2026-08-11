from dotenv import load_dotenv
import os
import psycopg

load_dotenv()


DATABASE_URL = os.environ['DATABASE_URL']


def get_supabase_data(db_conn):
    cur = db_conn.cursor()
    cur.execute("SELECT * from courses_database")
    results = cur.fetchall()
    return results


def main():
    try:
        db_conn = psycopg.connect(DATABASE_URL, prepare_threshold=None)
        results = get_supabase_data(db_conn)
        print(results)
    except Exception as e :
        print(f"Connection or query failed: {e}")

if __name__ == "__main__": main()

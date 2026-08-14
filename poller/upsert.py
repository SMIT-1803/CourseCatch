from pathlib import Path

def upsert_change_to_db(conn, the_changes):
    sql_file_path = Path(__file__).parent/ "SQL" / "upsert_db_change.sql"
    with open(sql_file_path, 'r') as f:
        query = f.read()
    with conn.cursor() as cur:
        try:
            cur.executemany(query, the_changes)
            conn.commit()
        except Exception as e:
            raise RuntimeError(f"Error while upserting data: {e}")
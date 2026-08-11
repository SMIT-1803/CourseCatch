from dotenv import load_dotenv
import re
from datetime import datetime, timezone
import requests
import os
import json

load_dotenv()

# row: 0 term, 1 section anchor, 2 course name, 3 enrolment, 4 instructor, 5 campus
ENROLMENT = re.compile(r"^(\d+)\s*/\s*(\d+)(?:\s*\(\+(\d+)\))?$")
ANCHOR = re.compile(r"/browse/info/([^\"'/]+)[\"'][^>]*>([^<]+)<")


def parse_row(row, semester_code, observed_at):
    m = ENROLMENT.match(str(row[3]).strip())
    if not m:
        raise ValueError(f"bad enrolment cell: {row[3]!r}")

    a = ANCHOR.search(str(row[1]))
    if not a:
        raise ValueError(f"bad section cell: {row[1]!r}")

    display = a.group(2).split()
    if len(display) < 3:
        raise ValueError(f"bad section display: {a.group(2)!r}")

    return {
        "slug": a.group(1),
        "semester_code": semester_code,
        "dept": display[0].upper(),
        "course_code": display[1].upper(),
        "section": " ".join(display[2:]),
        "course_name": str(row[2]).strip(),
        "instructor": str(row[4]).strip(),
        "campus": str(row[5]).strip(),
        "enrolled": int(m.group(1)),
        "capacity": int(m.group(2)),
        "waitlist": int(m.group(3) or 0),
        "observed_at": observed_at,
    }


def parse_offerings(api_res, semester_code):
    rows = api_res["data"]
    if len(rows) != api_res["recordsFiltered"]:
        raise RuntimeError(f"got {len(rows)} rows, expected {api_res['recordsFiltered']}")

    observed_at = datetime.now(timezone.utc)
    records, failures = [], []
    for row in rows:
        try:
            records.append(parse_row(row, semester_code, observed_at))
        except ValueError as e:
            failures.append(str(e))
    return records, failures

def build_url(semester_code):
    url = os.environ["COURSYS_ENDPOINT"]+f"?tabledata=yes&semester[]={semester_code}&length=-1"
    return url

def get_api_response(url):
    response = requests.get(url, headers={
        "User-Agent": f"CourseCatch/0.1 (+https://coursecatch.app; {os.environ['MY_EMAIL']})",
        "Accept": "application/json",
    }, timeout=30)
    response.raise_for_status()
    api_resp = response.json()
    return api_resp


def main():
    SEMESTER_CODE = os.environ['SEMESTER_CODE']
    url = build_url(SEMESTER_CODE)
    api_resp = get_api_response(url)
    records, failures = parse_offerings(api_resp, SEMESTER_CODE)
    if failures:
        print(f"ABORT: {len(failures)} parse failures")
        for f in failures[:5]:
            print(" ", f)
        return

    os.makedirs("snapshots", exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    with open(f"snapshots/{stamp}.json", "w") as f:
        json.dump(records, f, default=str)

if __name__ == "__main__": main()
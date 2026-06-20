#!/usr/bin/env python3
"""
Import marketing data from xlsx files in materials/ directory into PostgreSQL.

Tables:
  1. user_funnel        — 用户维表1 (register-FTD + 全链路漏斗)
  2. ftd_ftt_conversion — 用户维表2 (FTD-FTT 转化率)
  3. daily_aggregates   — 聚合数据2 (日注册/FTD/FTT/ND/TV)
  4. channel_ltv        — 需求特化2 (各渠道获客成本与 LTV)
  5. ftt_retention      — 需求特化1 (FTT 后 D30+D7 留存率)
"""

import os
import sys
import time
from datetime import datetime

import openpyxl
import psycopg2
from psycopg2.extras import execute_values

# ── Database connection ──────────────────────────────────────────────────────
DB_URL = os.environ.get("DATABASE_URL", "postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3")

# ── File paths (relative to project root) ────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MATERIALS_DIR = os.path.join(BASE_DIR, "materials")

FILES = {
    "user_funnel": os.path.join(
        MATERIALS_DIR,
        "用户维表1-KPI Card 注册-FTD转化率+获客转化全链路漏斗-2026-06-19 11-12-03.xlsx",
    ),
    "ftd_ftt_conversion": os.path.join(
        MATERIALS_DIR,
        "用户维表2-KPI Card ftd-ftt 转化率-2026-06-19 09-37-36.xlsx",
    ),
    "daily_aggregates": os.path.join(
        MATERIALS_DIR,
        "聚合数据2- KPI Card 日注册_FTD_FTT_ND_TV+新增用户来源-2026-06-19 09-37-32.xlsx",
    ),
    "ftt_retention": os.path.join(
        MATERIALS_DIR,
        "需求特化1-KPI card FTT后D30+D7留存率-2026-06-19 09-37-19.xlsx",
    ),
    "channel_ltv": os.path.join(
        MATERIALS_DIR,
        "需求特化2-各渠道获客成本与 ROI 矩阵 ND_30D-2026-06-19 09-36-40.xlsx",
    ),
}

BATCH_SIZE = 1000

# ── Table definitions (DDL) ──────────────────────────────────────────────────
CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS user_funnel (
    id              SERIAL PRIMARY KEY,
    register_date   DATE NOT NULL,
    region          VARCHAR(64),
    country         VARCHAR(128),
    retail_layer1   VARCHAR(64),
    retail_layer2   VARCHAR(64),
    retail_layer3   VARCHAR(64),
    user_type       VARCHAR(64),
    reg_user_id     INT DEFAULT 0,
    reg_live_7d     INT DEFAULT 0,
    reg_live_kyc_7d INT DEFAULT 0,
    reg_ftd_7d      INT DEFAULT 0,
    reg_ftt_7d      INT DEFAULT 0,
    reg_live_30d    INT DEFAULT 0,
    reg_live_kyc_30d INT DEFAULT 0,
    reg_ftd_30d     INT DEFAULT 0,
    reg_ftt_30d     INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ftd_ftt_conversion (
    id          SERIAL PRIMARY KEY,
    ftd_date    DATE NOT NULL,
    region      VARCHAR(64),
    country     VARCHAR(128),
    ftd_user_id INT DEFAULT 0,
    ftd_ftt_7d  INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS daily_aggregates (
    id              SERIAL PRIMARY KEY,
    date            DATE NOT NULL,
    region          VARCHAR(64),
    country         VARCHAR(128),
    retail_layer1   VARCHAR(64),
    retail_layer2   VARCHAR(64),
    retail_layer3   VARCHAR(64),
    user_type       VARCHAR(64),
    register_cnt    INT DEFAULT 0,
    ftd_cnt         INT DEFAULT 0,
    ftt_cnt         INT DEFAULT 0,
    net_deposit     DOUBLE PRECISION DEFAULT 0,
    trading_volume  DOUBLE PRECISION DEFAULT 0
);

CREATE TABLE IF NOT EXISTS channel_ltv (
    id              SERIAL PRIMARY KEY,
    register_date   DATE NOT NULL,
    region          VARCHAR(64),
    country         VARCHAR(128),
    retail_layer1   VARCHAR(64),
    retail_layer2   VARCHAR(64),
    retail_layer3   VARCHAR(64),
    user_type       VARCHAR(64),
    ltv_30d         DOUBLE PRECISION DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ftt_retention (
    id              SERIAL PRIMARY KEY,
    ftt_date        DATE NOT NULL,
    region          VARCHAR(64),
    country         VARCHAR(128),
    ftt_user_id     INT DEFAULT 0,
    ftt_trade_7d    INT DEFAULT 0,
    ftt_trade_30d   INT DEFAULT 0
);
"""


# ── Helper functions ─────────────────────────────────────────────────────────


def safe_int(val):
    """Convert value to int, returning 0 for null/empty/'(null)'."""
    if val is None:
        return 0
    if isinstance(val, str):
        val = val.strip()
        if val in ("", "(null)", "NULL", "null"):
            return 0
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return 0


def safe_float(val):
    """Convert value to float, returning 0.0 for null/empty/'(null)'."""
    if val is None:
        return 0.0
    if isinstance(val, str):
        val = val.strip()
        if val in ("", "(null)", "NULL", "null"):
            return 0.0
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0


def safe_str(val):
    """Convert value to string, returning None for null/empty."""
    if val is None:
        return None
    s = str(val).strip()
    if s in ("", "(null)", "NULL", "null"):
        return None
    return s


def safe_date(val):
    """Parse date from string like '2025-01-01' or datetime object."""
    if val is None:
        return None
    if isinstance(val, datetime):
        return val.date()
    s = str(val).strip()
    if s in ("", "(null)", "NULL", "null"):
        return None
    # Try common formats
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%m/%d/%Y", "%d/%m/%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Cannot parse date: {val!r}")


# ── Row parsers (one per table) ──────────────────────────────────────────────


def parse_user_funnel_row(row):
    """Parse a row from 用户维表1 into (date, region, country, ...int fields)."""
    return (
        safe_date(row[0]),       # register_date
        safe_str(row[1]),        # second_region_name -> region
        safe_str(row[2]),        # country
        safe_str(row[3]),        # retail/non-retail(第一层) -> retail_layer1
        safe_str(row[4]),        # retail/non-retail(第二层) -> retail_layer2
        safe_str(row[5]),        # retail/non-retail(第三层) -> retail_layer3
        safe_str(row[6]),        # user_type
        safe_int(row[7]),        # reg_user_id
        safe_int(row[8]),        # reg_live_7d_user_id
        safe_int(row[9]),        # reg_live_kyc_7d_user_id
        safe_int(row[10]),       # reg_ftd_7d_user_id
        safe_int(row[11]),       # reg_ftt_7d_user_id
        safe_int(row[12]),       # reg_live_30d_user_id
        safe_int(row[13]),       # reg_live_kyc_30d_user_id
        safe_int(row[14]),       # reg_ftd_30d_user_id
        safe_int(row[15]),       # reg_ftt_30d_user_id
    )


def parse_ftd_ftt_conversion_row(row):
    return (
        safe_date(row[0]),       # ftd_date
        safe_str(row[1]),        # region
        safe_str(row[2]),        # country
        safe_int(row[3]),        # ftd_user_id
        safe_int(row[4]),        # ftd_ftt_7d
    )


def parse_daily_aggregates_row(row):
    return (
        safe_date(row[0]),       # Date
        safe_str(row[1]),        # region
        safe_str(row[2]),        # country
        safe_str(row[3]),        # retail_layer1
        safe_str(row[4]),        # retail_layer2
        safe_str(row[5]),        # retail_layer3
        safe_str(row[6]),        # user_type
        safe_int(row[7]),        # register_cnt
        safe_int(row[8]),        # ftd_cnt
        safe_int(row[9]),        # ftt_cnt
        safe_float(row[10]),     # net_deposit
        safe_float(row[11]),     # trading_volume
    )


def parse_channel_ltv_row(row):
    return (
        safe_date(row[0]),       # register_date
        safe_str(row[1]),        # region
        safe_str(row[2]),        # country
        safe_str(row[3]),        # retail_layer1
        safe_str(row[4]),        # retail_layer2
        safe_str(row[5]),        # retail_layer3
        safe_str(row[6]),        # user_type
        safe_float(row[7]),      # ltv_30d
    )


def parse_ftt_retention_row(row):
    return (
        safe_date(row[0]),       # ftt_date
        safe_str(row[1]),        # region
        safe_str(row[2]),        # country
        safe_int(row[3]),        # ftt_user_id
        safe_int(row[4]),        # ftt_trade_7d
        safe_int(row[5]),        # ftt_trade_30d
    )


# ── INSERT templates ─────────────────────────────────────────────────────────

INSERT_SQL = {
    "user_funnel": """
        INSERT INTO user_funnel
            (register_date, region, country, retail_layer1, retail_layer2, retail_layer3,
             user_type, reg_user_id, reg_live_7d, reg_live_kyc_7d, reg_ftd_7d, reg_ftt_7d,
             reg_live_30d, reg_live_kyc_30d, reg_ftd_30d, reg_ftt_30d)
        VALUES %s
    """,
    "ftd_ftt_conversion": """
        INSERT INTO ftd_ftt_conversion
            (ftd_date, region, country, ftd_user_id, ftd_ftt_7d)
        VALUES %s
    """,
    "daily_aggregates": """
        INSERT INTO daily_aggregates
            (date, region, country, retail_layer1, retail_layer2, retail_layer3,
             user_type, register_cnt, ftd_cnt, ftt_cnt, net_deposit, trading_volume)
        VALUES %s
    """,
    "channel_ltv": """
        INSERT INTO channel_ltv
            (register_date, region, country, retail_layer1, retail_layer2, retail_layer3,
             user_type, ltv_30d)
        VALUES %s
    """,
    "ftt_retention": """
        INSERT INTO ftt_retention
            (ftt_date, region, country, ftt_user_id, ftt_trade_7d, ftt_trade_30d)
        VALUES %s
    """,
}

PARSERS = {
    "user_funnel": parse_user_funnel_row,
    "ftd_ftt_conversion": parse_ftd_ftt_conversion_row,
    "daily_aggregates": parse_daily_aggregates_row,
    "channel_ltv": parse_channel_ltv_row,
    "ftt_retention": parse_ftt_retention_row,
}


# ── Main import logic ────────────────────────────────────────────────────────


def import_table(cursor, table_name, file_path):
    """Read xlsx file and batch-insert rows into the given table."""
    print(f"\n{'='*60}")
    print(f"Importing: {table_name}")
    print(f"  File: {os.path.basename(file_path)}")
    print(f"{'='*60}")

    if not os.path.exists(file_path):
        print(f"  ERROR: File not found — {file_path}")
        return 0

    wb = openpyxl.load_workbook(file_path, read_only=True, data_only=True)
    ws = wb.active

    parser = PARSERS[table_name]
    insert_sql = INSERT_SQL[table_name]

    batch = []
    total_rows = 0
    skipped = 0
    start_time = time.time()

    for i, row in enumerate(ws.iter_rows(values_only=True)):
        # Skip header row
        if i == 0:
            continue

        try:
            parsed = parser(row)
            # Skip rows with no date
            if parsed[0] is None:
                skipped += 1
                continue
            batch.append(parsed)
        except Exception as e:
            skipped += 1
            if skipped <= 3:
                print(f"  WARNING: Row {i+1} parse error: {e}")
            continue

        if len(batch) >= BATCH_SIZE:
            execute_values(cursor, insert_sql, batch, page_size=BATCH_SIZE)
            total_rows += len(batch)
            elapsed = time.time() - start_time
            rate = total_rows / elapsed if elapsed > 0 else 0
            print(f"  Progress: {total_rows:,} rows inserted ({rate:,.0f} rows/sec)")
            batch.clear()

    # Flush remaining rows
    if batch:
        execute_values(cursor, insert_sql, batch, page_size=BATCH_SIZE)
        total_rows += len(batch)

    wb.close()

    elapsed = time.time() - start_time
    print(f"  Done: {total_rows:,} rows inserted in {elapsed:.1f}s (skipped {skipped})")
    return total_rows


def main():
    print("=" * 60)
    print("Dashboard V3 — Data Import Script")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Connect to PostgreSQL
    print("\nConnecting to PostgreSQL...")
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cursor = conn.cursor()

    # Create tables
    print("Creating tables (if not exist)...")
    cursor.execute(CREATE_TABLES_SQL)
    conn.commit()
    print("Tables ready.")

    # Import each table
    results = {}
    for table_name, file_path in FILES.items():
        count = import_table(cursor, table_name, file_path)
        conn.commit()
        results[table_name] = count

    # Final summary
    print(f"\n{'='*60}")
    print("IMPORT SUMMARY")
    print(f"{'='*60}")
    grand_total = 0
    for table_name, count in results.items():
        print(f"  {table_name:30s}  {count:>10,} rows")
        grand_total += count
    print(f"  {'TOTAL':30s}  {grand_total:>10,} rows")
    print(f"{'='*60}")

    # Verify with row counts
    print("\nVerification (row counts from PostgreSQL):")
    for table_name in FILES:
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"  {table_name:30s}  {count:>10,} rows")

    cursor.close()
    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()

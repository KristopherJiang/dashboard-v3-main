#!/usr/bin/env python3
"""
从 UID 颗粒度文件聚合数据，导入 channel_ltv + ftd_ftt_conversion 表。
"""

import os
from collections import defaultdict
from datetime import datetime, timedelta

import openpyxl
import psycopg2
from psycopg2.extras import execute_values

DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3",
)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UID_FILE = os.path.join(
    BASE_DIR,
    "materials",
    "Vantage MKT UID顆粒度(Retail Only)-2026-06-19 11-09-34.xlsx",
)

# UID 列索引
COL_DATE = 2
COL_COUNTRY = 3
COL_REGISTER_DATE = 6
COL_FTD_DATE = 8
COL_FTT_DATE = 9
COL_REGION = 11
COL_USER_TYPE = 15
COL_RETAIL_SOURCE = 16
COL_LTV_30D = 33
COL_FTT_7D_FLAG = 44


def parse_date(val):
    if isinstance(val, datetime):
        return val.strftime("%Y-%m-%d")
    if val and str(val) != "(null)":
        return str(val)[:10]
    return None


def main():
    print("=" * 60)
    print("UID → channel_ltv + ftd_ftt_conversion 聚合导入")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    wb = openpyxl.load_workbook(UID_FILE, read_only=True)
    ws = wb.active

    # channel_ltv: 按 (register_date, region, country, user_type) 聚合 ltv_30d
    ltv_agg = defaultdict(float)
    # ftd_ftt_conversion: 按 (ftd_date, region, country) 统计 ftd 人数和 7d内 ftt 人数
    ftd_agg = defaultdict(lambda: {"ftd_cnt": 0, "ftt_7d_cnt": 0})

    row_count = 0
    for row in ws.iter_rows(min_row=2, values_only=True):
        row_count += 1
        if row_count % 20000 == 0:
            print(f"  Read {row_count:,} rows...")

        region = row[COL_REGION] or ""
        country = row[COL_COUNTRY] or ""
        user_type = row[COL_USER_TYPE] or ""
        ltv_30d = float(row[COL_LTV_30D] or 0)
        ftt_7d_flag = int(row[COL_FTT_7D_FLAG] or 0)

        reg_date = parse_date(row[COL_REGISTER_DATE])
        ftd_date = parse_date(row[COL_FTD_DATE])

        # channel_ltv
        if reg_date:
            key = (reg_date, region, country, user_type)
            ltv_agg[key] += ltv_30d

        # ftd_ftt_conversion (每行都是 ftd 用户)
        if ftd_date:
            fkey = (ftd_date, region, country)
            ftd_agg[fkey]["ftd_cnt"] += 1
            if ftt_7d_flag:
                ftd_agg[fkey]["ftt_7d_cnt"] += 1

    wb.close()
    print(f"  Done: {row_count:,} rows")
    print(f"  channel_ltv groups: {len(ltv_agg)}")
    print(f"  ftd_ftt_conversion groups: {len(ftd_agg)}")

    # 构建插入数据
    ltv_rows = []
    for (d, r, c, u), ltv in ltv_agg.items():
        ltv_rows.append((
            datetime.strptime(d, "%Y-%m-%d").date(),
            r or None, c or None,
            None, None, None,  # retail_layer1/2/3
            u or None,
            ltv,
        ))

    ftd_rows = []
    for (d, r, c), v in ftd_agg.items():
        ftd_rows.append((
            datetime.strptime(d, "%Y-%m-%d").date(),
            r or None, c or None,
            v["ftd_cnt"],
            v["ftt_7d_cnt"],
        ))

    # 写入数据库
    print("\nConnecting to PostgreSQL...")
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()

    print("Deleting existing 2026 data...")
    cur.execute("DELETE FROM channel_ltv WHERE register_date >= '2026-01-01'")
    cur.execute("DELETE FROM ftd_ftt_conversion WHERE ftd_date >= '2026-01-01'")

    # channel_ltv
    print(f"Inserting {len(ltv_rows)} channel_ltv rows...")
    sql_ltv = """
        INSERT INTO channel_ltv
            (register_date, region, country, retail_layer1, retail_layer2, retail_layer3, user_type, ltv_30d)
        VALUES %s
    """
    for i in range(0, len(ltv_rows), 1000):
        execute_values(cur, sql_ltv, ltv_rows[i:i+1000], page_size=1000)
        print(f"  ltv: {min(i+1000, len(ltv_rows)):,} / {len(ltv_rows):,}")

    # ftd_ftt_conversion
    print(f"Inserting {len(ftd_rows)} ftd_ftt_conversion rows...")
    sql_ftd = """
        INSERT INTO ftd_ftt_conversion
            (ftd_date, region, country, ftd_user_id, ftd_ftt_7d)
        VALUES %s
    """
    for i in range(0, len(ftd_rows), 1000):
        execute_values(cur, sql_ftd, ftd_rows[i:i+1000], page_size=1000)
        print(f"  ftd: {min(i+1000, len(ftd_rows)):,} / {len(ftd_rows):,}")

    conn.commit()

    # 验证
    cur.execute("SELECT COUNT(*) FROM channel_ltv WHERE register_date >= '2026-01-01'")
    print(f"\nVerification:")
    print(f"  channel_ltv 2026 rows: {cur.fetchone()[0]:,}")
    cur.execute("SELECT COUNT(*) FROM ftd_ftt_conversion WHERE ftd_date >= '2026-01-01'")
    print(f"  ftd_ftt_conversion 2026 rows: {cur.fetchone()[0]:,}")
    cur.execute("SELECT COUNT(*) FROM channel_ltv")
    print(f"  channel_ltv total: {cur.fetchone()[0]:,}")
    cur.execute("SELECT COUNT(*) FROM ftd_ftt_conversion")
    print(f"  ftd_ftt_conversion total: {cur.fetchone()[0]:,}")

    cur.close()
    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()

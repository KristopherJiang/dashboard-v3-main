#!/usr/bin/env python3
"""
从 UID 颗粒度文件聚合数据，导入 daily_aggregates 表。
覆盖 2026-05-20 ~ 2026-06-17 的数据。
"""

import os
import sys
from collections import defaultdict
from datetime import datetime

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

# UID 文件列索引 (0-based)
COL_DATE = 2
COL_COUNTRY = 3
COL_REGISTER_DATE = 6
COL_FTD_DATE = 8
COL_FTT_DATE = 9
COL_REGION = 11  # second_region_name
COL_USER_TYPE = 15  # user_type_new
COL_NET_DEPOSIT = 29
COL_TRADING_VOLUME = 31


def main():
    print("=" * 60)
    print("UID → daily_aggregates 聚合导入")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # 1. 读取 UID 文件并聚合
    print(f"\nReading: {UID_FILE}")
    wb = openpyxl.load_workbook(UID_FILE, read_only=True)
    ws = wb.active

    # key: (date, region, country, user_type) -> aggregated values
    agg = defaultdict(lambda: {
        "register_cnt": 0,
        "ftd_cnt": 0,
        "ftt_cnt": 0,
        "net_deposit": 0.0,
        "trading_volume": 0.0,
    })

    row_count = 0
    for row in ws.iter_rows(min_row=2, values_only=True):
        row_count += 1
        if row_count % 20000 == 0:
            print(f"  Read {row_count:,} rows...")

        date_val = row[COL_DATE]
        country = row[COL_COUNTRY] or ""
        region = row[COL_REGION] or ""
        user_type = row[COL_USER_TYPE] or ""
        register_date = row[COL_REGISTER_DATE]
        ftd_date = row[COL_FTD_DATE]
        ftt_date = row[COL_FTT_DATE]
        net_deposit = float(row[COL_NET_DEPOSIT] or 0)
        trading_volume = float(row[COL_TRADING_VOLUME] or 0)

        # date 格式化
        if isinstance(date_val, datetime):
            date_str = date_val.strftime("%Y-%m-%d")
        else:
            date_str = str(date_val)[:10]

        key = (date_str, region, country, user_type)
        agg[key]["net_deposit"] += net_deposit
        agg[key]["trading_volume"] += trading_volume

        # 注册: register_date == 当天
        reg_str = ""
        if register_date:
            reg_str = register_date.strftime("%Y-%m-%d") if isinstance(register_date, datetime) else str(register_date)[:10]
        if reg_str == date_str:
            agg[key]["register_cnt"] += 1

        # FTD: ftd_date == 当天
        ftd_str = ""
        if ftd_date:
            ftd_str = ftd_date.strftime("%Y-%m-%d") if isinstance(ftd_date, datetime) else str(ftd_date)[:10]
        if ftd_str == date_str:
            agg[key]["ftd_cnt"] += 1

        # FTT: ftt_date == 当天
        ftt_str = ""
        if ftt_date:
            ftt_str = ftt_date.strftime("%Y-%m-%d") if isinstance(ftt_date, datetime) else str(ftt_date)[:10]
        if ftt_str == date_str:
            agg[key]["ftt_cnt"] += 1

    wb.close()
    print(f"  Done: {row_count:,} rows → {len(agg)} aggregated groups")

    # 2. 构建插入数据
    rows_to_insert = []
    for (date_str, region, country, user_type), vals in agg.items():
        rows_to_insert.append((
            datetime.strptime(date_str, "%Y-%m-%d").date(),
            region or None,
            country or None,
            None,  # retail_layer1
            None,  # retail_layer2
            None,  # retail_layer3
            user_type or None,
            vals["register_cnt"],
            vals["ftd_cnt"],
            vals["ftt_cnt"],
            vals["net_deposit"],
            vals["trading_volume"],
        ))

    print(f"\nConnecting to PostgreSQL...")
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cursor = conn.cursor()

    # 3. 删除该日期范围的旧数据（避免重复）
    print("Deleting existing 2026 data from daily_aggregates...")
    cursor.execute("DELETE FROM daily_aggregates WHERE date >= '2026-05-20'")

    # 4. 批量插入
    insert_sql = """
        INSERT INTO daily_aggregates
            (date, region, country, retail_layer1, retail_layer2, retail_layer3,
             user_type, register_cnt, ftd_cnt, ftt_cnt, net_deposit, trading_volume)
        VALUES %s
    """
    BATCH = 1000
    total = 0
    for i in range(0, len(rows_to_insert), BATCH):
        batch = rows_to_insert[i : i + BATCH]
        execute_values(cursor, insert_sql, batch, page_size=BATCH)
        total += len(batch)
        print(f"  Inserted {total:,} / {len(rows_to_insert):,}")

    conn.commit()

    # 5. 验证
    cursor.execute("SELECT MIN(date), MAX(date), COUNT(*) FROM daily_aggregates WHERE date >= '2026-01-01'")
    result = cursor.fetchone()
    print(f"\nVerification:")
    print(f"  2026 data: {result[0]} ~ {result[1]}, {result[2]:,} rows")

    cursor.execute("SELECT COUNT(*) FROM daily_aggregates")
    total_rows = cursor.fetchone()[0]
    print(f"  Total daily_aggregates: {total_rows:,} rows")

    cursor.close()
    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()

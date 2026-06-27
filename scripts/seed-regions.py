#!/usr/bin/env python3
"""将 REGION_STRUCTURE 数据导入 regions 表"""

import os
import psycopg2

DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://dashboard:dashboard_dev_2026@localhost:5432/dashboard_v3",
)

REGIONS = [
    {"code": "GLOBAL", "name_en": "Global", "name_cn": "全球聚合视角", "sort_order": 0, "is_favorite": True},
    {"code": "ASIA", "name_en": "Asia", "name_cn": "亚洲", "sort_order": 1},
    {"code": "EU", "name_en": "EU", "name_cn": "欧洲", "sort_order": 2},
    {"code": "LATAM", "name_en": "Latam", "name_cn": "拉美", "sort_order": 3},
    {"code": "MENA", "name_en": "Mena", "name_cn": "中东", "sort_order": 4},
    {"code": "AFRICA", "name_en": "Africa", "name_cn": "非洲", "sort_order": 5},
    {"code": "GS", "name_en": "GS-Others", "name_cn": "其他", "sort_order": 6},
]

COUNTRIES = [
    # Asia
    ("ASIA_IN", "ASIA", "India", "印度", False, False, 1),
    ("ASIA_PH", "ASIA", "Philippines", "菲律宾", False, False, 2),
    ("ASIA_VN", "ASIA", "Vietnam", "越南", True, True, 3),
    ("ASIA_PK", "ASIA", "Pakistan", "巴基斯坦", False, False, 4),
    ("ASIA_ID", "ASIA", "Indonesia", "印度尼西亚", False, False, 5),
    ("ASIA_MY", "ASIA", "Malaysia", "马来西亚", False, False, 6),
    ("ASIA_TH", "ASIA", "Thailand", "泰国", False, False, 7),
    ("ASIA_KR", "ASIA", "South Korea", "韩国", False, False, 8),
    ("ASIA_BD", "ASIA", "Bangladesh", "孟加拉国", False, False, 9),
    ("ASIA_UZ", "ASIA", "Uzbekistan", "乌兹别克斯坦", False, False, 10),
    ("ASIA_JP", "ASIA", "Japan", "日本", False, False, 11),
    ("ASIA_NP", "ASIA", "Nepal", "尼泊尔", False, False, 12),
    ("ASIA_HK", "ASIA", "Hong Kong", "中国香港", False, False, 13),
    ("ASIA_TJ", "ASIA", "Tajikistan", "塔吉克斯坦", False, False, 14),
    ("ASIA_KH", "ASIA", "Cambodia", "柬埔寨", False, False, 15),
    ("ASIA_RU", "ASIA", "Russia", "俄罗斯", False, False, 16),
    ("ASIA_TM", "ASIA", "Turkmenistan", "土库曼斯坦", False, False, 17),
    ("ASIA_KG", "ASIA", "Kyrgyzstan", "吉尔吉斯斯坦", False, False, 18),
    ("ASIA_TW", "ASIA", "Taiwan", "中国台湾", False, False, 19),
    # EU
    ("EU_UK", "EU", "UK", "英国", True, True, 1),
    ("EU_DE", "EU", "Germany", "德国", False, False, 2),
    ("EU_FR", "EU", "France", "法国", False, False, 3),
    ("EU_NL", "EU", "Netherlands", "荷兰", False, False, 4),
    ("EU_ES", "EU", "Spain", "西班牙", False, False, 5),
    ("EU_IT", "EU", "Italy", "意大利", False, False, 6),
    ("EU_PL", "EU", "Poland", "波兰", False, False, 7),
    ("EU_BE", "EU", "Belgium", "比利时", False, False, 8),
    ("EU_IE", "EU", "Ireland", "爱尔兰", False, False, 9),
    ("EU_CH", "EU", "Switzerland", "瑞士", False, False, 10),
    ("EU_BG", "EU", "Bulgaria", "保加利亚", False, False, 11),
    ("EU_SE", "EU", "Sweden", "瑞典", False, False, 12),
    ("EU_NO", "EU", "Norway", "挪威", False, False, 13),
    ("EU_AT", "EU", "Austria", "奥地利", False, False, 14),
    ("EU_PT", "EU", "Portugal", "葡萄牙", False, False, 15),
    ("EU_GR", "EU", "Greece", "希腊", False, False, 16),
    ("EU_DK", "EU", "Denmark", "丹麦", False, False, 17),
    ("EU_HU", "EU", "Hungary", "匈牙利", False, False, 18),
    ("EU_LT", "EU", "Lithuania", "立陶宛", False, False, 19),
    ("EU_FI", "EU", "Finland", "芬兰", False, False, 20),
    ("EU_SK", "EU", "Slovakia", "斯洛伐克", False, False, 21),
    ("EU_EE", "EU", "Estonia", "爱沙尼亚", False, False, 22),
    ("EU_HR", "EU", "Croatia", "克罗地亚", False, False, 23),
    ("EU_LU", "EU", "Luxembourg", "卢森堡", False, False, 24),
    # Latam
    ("LATAM_CO", "LATAM", "Colombia", "哥伦比亚", False, False, 1),
    ("LATAM_BR", "LATAM", "Brazil", "巴西", False, False, 2),
    ("LATAM_EC", "LATAM", "Ecuador", "厄瓜多尔", False, False, 3),
    ("LATAM_AR", "LATAM", "Argentina", "阿根廷", False, False, 4),
    ("LATAM_MX", "LATAM", "Mexico", "墨西哥", False, False, 5),
    ("LATAM_PE", "LATAM", "Peru", "秘鲁", False, False, 6),
    ("LATAM_CL", "LATAM", "Chile", "智利", False, False, 7),
    ("LATAM_BO", "LATAM", "Bolivia", "玻利维亚", False, False, 8),
    # Mena
    ("MENA_AE", "MENA", "UAE", "阿联酋", True, True, 1),
    ("MENA_MA", "MENA", "Morocco", "摩洛哥", False, False, 2),
    ("MENA_SA", "MENA", "Saudi Arabia", "沙特阿拉伯", False, False, 3),
    ("MENA_QA", "MENA", "Qatar", "卡塔尔", False, False, 4),
    ("MENA_IL", "MENA", "Israel", "以色列", False, False, 5),
    ("MENA_EG", "MENA", "Egypt", "埃及", False, False, 6),
    ("MENA_KW", "MENA", "Kuwait", "科威特", False, False, 7),
    ("MENA_JO", "MENA", "Jordan", "约旦", False, False, 8),
    ("MENA_DZ", "MENA", "Algeria", "阿尔及利亚", False, False, 9),
    ("MENA_TR", "MENA", "Turkey", "土耳其", False, False, 10),
    ("MENA_OM", "MENA", "Oman", "阿曼", False, False, 11),
    # Africa
    ("AFRICA_NG", "AFRICA", "Nigeria", "尼日利亚", False, False, 1),
    ("AFRICA_ZA", "AFRICA", "South Africa", "南非", False, False, 2),
    ("AFRICA_KE", "AFRICA", "Kenya", "肯尼亚", False, False, 3),
    ("AFRICA_GH", "AFRICA", "Ghana", "加纳", False, False, 4),
    ("AFRICA_UG", "AFRICA", "Uganda", "乌干达", False, False, 5),
    # GS-Others
    ("GS_PF", "GS", "French Polynesia", "法属波利尼西亚", False, False, 1),
    ("GS_AU", "GS", "Australia", "澳大利亚", True, True, 2),
    ("GS_NZ", "GS", "New Zealand", "新西兰", False, False, 3),
]

# 国家代码 → 数据库中的 region 名称映射
COUNTRY_TO_DB_REGION = {
    "ASIA": "Asia", "EU": "EU", "LATAM": "LATAM",
    "MENA": "MENA", "AFRICA": "Africa", "GS": "GS-Others",
}

def main():
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()

    cur.execute("DELETE FROM regions")

    # 插入大区
    region_ids = {}
    for r in REGIONS:
        cur.execute(
            "INSERT INTO regions (code, name_en, name_cn, is_hot, is_favorite, sort_order) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
            (r["code"], r["name_en"], r["name_cn"], False, r.get("is_favorite", False), r["sort_order"]),
        )
        region_ids[r["code"]] = cur.fetchone()[0]

    # 插入国家
    for code, parent_code, en, cn, is_hot, is_fav, sort in COUNTRIES:
        cur.execute(
            "INSERT INTO regions (code, parent_id, name_en, name_cn, is_hot, is_favorite, sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s)",
            (code, region_ids[parent_code], en, cn, is_hot, is_fav, sort),
        )

    conn.commit()

    cur.execute("SELECT COUNT(*) FROM regions")
    print(f"Total regions: {cur.fetchone()[0]}")
    cur.execute("SELECT COUNT(*) FROM regions WHERE parent_id IS NOT NULL")
    print(f"Countries: {cur.fetchone()[0]}")
    cur.execute("SELECT COUNT(*) FROM regions WHERE is_favorite = true")
    print(f"Favorites: {cur.fetchone()[0]}")

    cur.close()
    conn.close()
    print("Done.")

if __name__ == "__main__":
    main()

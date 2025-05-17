import pandas as pd
import json

# CSVファイルを読み込む
df = pd.read_csv("clients.csv", dtype=str)  # 文字列として読み込む

# 辞書形式に変換（key列を辞書のキーにする）
result = {
    row['key']: {
        "顧客コード": row["顧客コード"],
        "氏名": row["氏名"],
        "カナ": row["カナ"],
        "電話番号": row["電話番号"],
        "住所": row["住所"]
    }
    for _, row in df.iterrows()
}

# JSONとして保存（整形して出力）
with open("output.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

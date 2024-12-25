import time
import mlx_whisper
import os
import json

def parse(speech_file):
    return mlx_whisper.transcribe(
        speech_file,
        path_or_hf_repo="mlx-community/whisper-medium",
        initial_prompt="地球防衛軍（Earth Defense Force）は、地球を守るために戦う架空の軍隊を指す。略称はEDF。登場する敵の種類には「地底掘削（ちていくっさく）ロボット ネイカー」「スキュラ」「アーケルス」「グラウコス」「エルギヌス」「キュクロプス」「サイレン」「ヘイズ」「シールドベアラー」「プライマー」「α型」「β型」「γ型」「タッドポウル」「クルール」「クラーケン」「アラネア」「高機動型（こうきどうがた）アンドロイド」「擲弾兵（てきだんへい）」「怪生物（かいせいぶつ）」「敵船（てきせん）」「テレポーションアンカー「タイプ3ドローン」」などが存在します。味方部隊には「フェンサー」「レンジャー」「ウィングダイバー」「エアレイダー」「給養員（きゅうよういん）」「コンバットフレーム」「ニクス型」「駆除チーム」「プロフェッサー」「プロテウス」「バルガ」「アーマメントバルガ」が存在します。「Yes!Sir!（イエッサー・イエス サー）」という掛け声を多用します。"
    )["text"]

# get files
def get_files(path):
    files = []
    for file in os.listdir(path):
        if os.path.isfile(os.path.join(path, file)):
            files.append(file)
    return files

def output_json(record, suffix=""):
    with open(f"output{suffix}.json", "w") as f:
        json.dump(record, f, ensure_ascii=False, indent=2)

def main():
    start_time = time.time()  # 開始時間を記録

    # 1 ~ 29925 までのファイルを100個ずつに分割して取得して処理をする
    start = 10000
    end = 10999
    # end = 29925
    for i in range(start, end + 1, 100):
        chunk_start_time = time.time()  # 開始時間を記録
        record = {}
        for j in range(i, i + 100):
            if j > end:
                break
            file = f"TIKYUU6_VOICE.JA [{j}].wav"
            text = parse(f"wav/{file}")
            record[j] = text
            if j % 10 == 0:
                print(f"{j}件処理しました")
        
        output_json(record, f"_{i}")
        chunk_end_time = time.time()  # 終了時間を記録
        chunk_elapsed_time = round(chunk_end_time - chunk_start_time, 1)  # 経過時間を計算
        print(f"chunk time: {i} {chunk_elapsed_time} 秒")  # 経過時間を出力

    end_time = time.time()  # 終了時間を記録
    elapsed_time = round(end_time - start_time, 1)  # 経過時間を計算
    print(f"経過時間: {elapsed_time} 秒")  # 経過時間を出力

main()
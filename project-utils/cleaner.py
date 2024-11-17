import csv
CSV_FILE = "./universal_top_spotify_songs.csv"
OUTPUT_FILE="./cleaned_song.csv"
songs_data = {}
song_rankings_data = {}
field_names = None
with open(CSV_FILE,encoding="utf8") as f:
    reader = csv.DictReader(f)
    once = True
    # count = 0
    for row in reader:
        # if(count > 10):
        #     break
        daily_rank = row.pop("daily_rank",None)
        daily_movement = row.pop("daily_movement",None)
        weekly_movement = row.pop("weekly_movement",None)
        country = row.pop("country",None)
        snapshot_date = row.pop("snapshot_date",None)
        popularity = row.pop("popularity",None)
        if once:
            field_names = row.keys()
            once = False
        # print(row)
        if not row["artists"]:
            continue

        if(songs_data.get(row["spotify_id"]) == None):
            songs_data[row["spotify_id"]] = row
        else: 
            pass
        # count = count + 1

with open(OUTPUT_FILE,mode="+w",newline='',encoding='utf8') as f:
    writer = csv.DictWriter(f,fieldnames=field_names)
    writer.writerows(songs_data.values())
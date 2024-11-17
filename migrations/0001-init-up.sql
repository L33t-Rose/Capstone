CREATE TABLE IF NOT EXISTS songs (
    spotify_id VARCHAR(22) PRIMARY KEY NOT NULL,
    song_name VARCHAR(1024),
    artists VARCHAR(512) NOT NULL,
    is_explicit BOOLEAN NOT NULL,
    duration_ms INTEGER NOT NULL,
    album_name VARCHAR(1024),
    album_release_date VARCHAR(10) DEFAULT(CURRENT_DATE),
    danceability REAL NOT NULL,
    energy REAL NOT NULL,
    key SMALLINT NOT NULL,
    loudness REAL NOT NULL,
    mode SMALLINT NOT NULL,
    speechiness REAL NOT NULL,
    acousticness REAL NOT NULL,
    instrumentalness REAL NOT NULL,
    liveness REAL NOT NULL,
    valence REAL NOT NULL,
    tempo REAL NOT NULL,
    time_signature SMALLINT NOT NULL
);
CREATE TABLE IF NOT EXISTS users(
    user_id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS playlist (
    playlist_id UUID PRIMARY KEY NOT NULL,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS playlist_entries(
    playlist_id UUID REFERENCES playlist(playlist_id) ON DELETE CASCADE,
    song_id VARCHAR(22) REFERENCES songs(spotify_id),
    index INTEGER NOT NULL
);
-- Seeds the database
\copy songs(spotify_id,song_name,artists,is_explicit,duration_ms,album_name,album_release_date,danceability,energy,key,loudness,mode,speechiness,acousticness,instrumentalness,liveness,valence,tempo,time_signature) FROM './cleaned_song.csv' DELIMITER ',' CSV ENCODING 'UTF8';
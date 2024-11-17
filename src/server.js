"use strict";
import express from "express";
import * as db from "./db/index.js";
import { randomUUID } from "crypto";
const app = express();
console.log(process.env.POSTGRES_CONNECTION_URL);
app.use(express.static("public"));
app.use(express.json());
const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.get("/hello", function (req, res) {
  res.set("Content-Type", "text/plain");
  res.send("Hello World!");
});

app.get("/echo", function (req, res) {
  const value = req.query["input"];
  res.set("Content-Type", "text/plain");
  res.send(value);
});

app.get("/get5songs", async function (req, res) {
  const { rows } = await db.query("SELECT * FROM songs LIMIT 5;");
  console.log(rows);
  res.json(rows);
});

app.get("/randomsong", async function (req, res) {
  const limit = req.query["limit"] || 1;
  console.log(req.query["limit"]);
  if (limit > 50) {
    res.status = 400;
    res.json({ message: "We don't support greater than 50" });
    return;
  }
  const { rows } = await db.query(
    "SELECT * FROM songs ORDER BY RANDOM() LIMIT $1;",
    [limit]
  );
  res.json(rows ?? { message: "Something went wrong" });
});

// TODO: Setup user authentication
app.post("/user", async function (req, res) {
  const data = req.body;
  //Validation
  if (!data["username"]) {
    res.status = 400;
    res.json({ message: "You didn't pass in a username!" });
    return;
  }

  const result = await db.query(
    "INSERT INTO users(user_id,name) VALUES($1,$2) RETURNING user_id",
    [crypto.randomUUID(), data.username]
  );
  console.log(result);
  res.json(result?.rows[0] ?? { message: "Something went wrong!" });
});

// app.post("/playlist/create",async function(req,res){
//   const
// })

app.post("/playlists", async function (req, res) {
  // TODO: Add session token capabilities
  const isValidReq =
    "user_id" in req.body &&
    req.body["user_id"] &&
    "playlist_name" in req.body &&
    req.body["playlist_name"];
  if (!isValidReq) {
    res.status = 400;
    return res.json({ message: "Invalid Request" });
  }
  const result = await db.query(
    "INSERT INTO playlist(playlist_id,user_id,name) VALUES($1,$2,$3) RETURNING *",
    [crypto.randomUUID(), req.body["user_id"], req.body["playlist_name"]]
  );
  console.log(result);
  res.json(result?.rows[0] ?? { message: "Something went wrong" });
});

// For now this is how we gen the playlist.
// This way if I want to regenerate all of the songs I can just hit this endpoint
app.put("/playlists/:playlistid", async function (req, res) {
  // TODO: Add user authentication and authorization
  let result;
  try {
    result = await db.query(
      `
      INSERT INTO playlist_entries(song_id, playlist_id, index)
      SELECT spotify_id,
        $1,
        1
      FROM songs
      ORDER BY RANDOM()
      LIMIT 20;`,
      [req.params.playlistid]
    );
    console.log(result);
    res.json({ message: "SUCCESS" });
  } catch (e) {
    res.status = 400;
    console.log(e, result);
    res.json({ message: "Something went wrong" });
  }
});

app.get("/playlists/:playlistid", async function (req, res) {
  let result;
  try {
    result = await db.query(
      `
    SELECT songs.* FROM playlist_entries
        JOIN songs ON playlist_entries.song_id = songs.spotify_id
    WHERE playlist_id = $1;`,
      [req.params.playlistid]
    );
    console.log(result);
    res.json(result.rows);
  } catch (e) {
    res.status = 400;
    console.log(e, result);
    res.json({ message: "Something went wrong" });
  }
});

app.delete("/playlists/:playlistid", async function (req, res) {
  let result;
  try {
    result = await db.query(
      "DELETE FROM playlist WHERE playlist_id=$1 RETURNING *;",
      [req.params.playlistid]
    );
    res.json(result.rows);
  } catch (e) {
    res.status = 400;
    console.log(e, result);
    res.json({ message: "Something went wrong" });
  }
});

app.get("/error", function (req, res) {
  res.set("Content-Type", "text/plain");
  res.status(400).send("Error, Bad Request!");
});

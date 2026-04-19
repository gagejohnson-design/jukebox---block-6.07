import express from "express";
import db from "#db/client";

const app = express();

app.use(express.json());

app.get("/tracks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tracks");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/tracks/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid track ID" });
  }
  try {
    const result = await db.query("SELECT * FROM tracks WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/playlists", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM playlists");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/playlists", async (req, res) => {
  const { name, description } = req.body || {};
  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }
  try {
    const result = await db.query(
      "INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/playlists/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid playlist ID" });
  }
  try {
    const result = await db.query("SELECT * FROM playlists WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/playlists/:id/tracks", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid playlist ID" });
  }
  try {
    const result = await db.query("SELECT * FROM playlists WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    const tracksResult = await db.query(
      "SELECT t.* FROM tracks t JOIN playlists_tracks pt ON t.id = pt.track_id WHERE pt.playlist_id = $1",
      [id]
    );
    res.json(tracksResult.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/playlists/:id/tracks", async (req, res) => {
  const { id } = req.params;
  const { trackId } = req.body || {};
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid playlist ID" });
  }
  if (!trackId || isNaN(trackId)) {
    return res.status(400).json({ error: "Valid trackId is required" });
  }
  try {
  
    const playlistResult = await db.query("SELECT * FROM playlists WHERE id = $1", [id]);
    if (playlistResult.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }
  
    const trackResult = await db.query("SELECT * FROM tracks WHERE id = $1", [trackId]);
    if (trackResult.rows.length === 0) {
      return res.status(400).json({ error: "Track not found" });
    }
   
    const result = await db.query(
      "INSERT INTO playlists_tracks (playlist_id, track_id) VALUES ($1, $2) RETURNING *",
      [id, trackId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // unique violation
      res.status(400).json({ error: "Track already in playlist" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default app;

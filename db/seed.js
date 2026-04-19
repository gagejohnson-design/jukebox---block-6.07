import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await db.query(
    "TRUNCATE TABLE playlists_tracks, playlists, tracks RESTART IDENTITY CASCADE;",
  );

  await db.query(`
    INSERT INTO tracks (name, duration_ms) VALUES
      ('Midnight City', 244000),
      ('Electric Feel', 229000),
      ('Dreams', 257000),
      ('Take On Me', 225000),
      ('Blinding Lights', 200000),
      ('Levitating', 203000),
      ('Mr. Brightside', 222000),
      ('Watermelon Sugar', 174000),
      ('Bad Guy', 194000),
      ('Style', 231000),
      ('As It Was', 167000),
      ('Shut Up and Dance', 199000),
      ('Rolling in the Deep', 228000),
      ('Uptown Funk', 270000),
      ('Firework', 228000),
      ('Counting Stars', 257000),
      ('Feel It Still', 163000),
      ('Viva La Vida', 242000),
      ('Heroes', 371000),
      ('Yellow', 269000);
  `);

  await db.query(`
    INSERT INTO playlists (name, description) VALUES
      ('Morning Boost', 'Fast starts and bright hooks.'),
      ('Late Night Drive', 'Neon tracks for empty roads.'),
      ('Indie Mix', 'Modern indie and alt favorites.'),
      ('Throwback Hits', 'Songs that still land every time.'),
      ('Workout Fuel', 'High energy tracks for training.'),
      ('Pool Party', 'Warm weather pop and singalongs.'),
      ('Rainy Day', 'Softer tracks for gray afternoons.'),
      ('Road Trip', 'Big choruses and long-distance staples.'),
      ('Focus Mode', 'Steady songs that stay out of the way.'),
      ('Weekend Starter', 'Crowd-pleasers for Friday night.');
  `);

  await db.query(`
    INSERT INTO playlists_tracks (playlist_id, track_id) VALUES
      (1, 5),
      (1, 12),
      (1, 17),
      (2, 1),
      (2, 18),
      (2, 19),
      (3, 2),
      (3, 3),
      (3, 20),
      (4, 4),
      (4, 13),
      (4, 15),
      (5, 6),
      (5, 7),
      (5, 14),
      (6, 8),
      (6, 10),
      (7, 3),
      (7, 20),
      (8, 16),
      (8, 18),
      (9, 11),
      (9, 17),
      (10, 5),
      (10, 14);
  `);
}

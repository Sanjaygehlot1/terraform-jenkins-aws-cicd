import express from 'express'
import cors from 'cors'
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "issues",
  port: 5432,
});



app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'OPEN'
    )
  `);
})();

app.get("/issues", async (req, res) => {
  const result = await pool.query("SELECT * FROM issues ORDER BY id DESC");
  res.json(result.rows);
});

app.post("/issues", async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    "INSERT INTO issues (title) VALUES ($1) RETURNING *",
    [title]
  );
  res.json(result.rows[0]);
});

app.patch("/issues/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await pool.query(
    "UPDATE issues SET status=$1 WHERE id=$2 RETURNING *",
    [status, id]
  );
  res.json(result.rows[0]);
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`${process.env.DB_USER}`);
  console.log(`${process.env.DB_PASSWORD}`);
});

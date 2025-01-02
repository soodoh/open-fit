import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

export default async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const result = await client.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [email, password],
      );
      const user = result.rows[0];
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "User already exists" });
    }
  } else {
    res.status(405).end();
  }
};

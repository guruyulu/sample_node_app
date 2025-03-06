const express = require('express');
const { Pool } = require('pg');
const { trace } = require('@opentelemetry/api'); // For tracing

const app = express();
const port = 3003;

// PostgreSQL pool setup
const pool = new Pool({
  user: 'guru',
  host: 'localhost',
  database: 'db1',
  port: 5432,
});

// Function to fetch 10 records from PostgreSQL with tracing
async function fetchRecords() {
  const tracer = trace.getTracer('service-b');
  const span = tracer.startSpan('fetchRecords');

  try {
    const result = await pool.query('SELECT * FROM users10 LIMIT 10');
    return result.rows;
  } catch (error) {
    console.error('Error fetching data:', error);
    span.setStatus({ code: 2, message: error.message });
    throw error;
  } finally {
    span.end();
  }
}

// GET endpoint to fetch records
app.get('/records', async (req, res) => {
  try {
    const records = await fetchRecords();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

app.listen(port, () => {
  console.log(`Service B is running at http://localhost:${port}`);
});

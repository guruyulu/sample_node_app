const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const { trace } = require('@opentelemetry/api'); // For tracing dTest function
const axios = require('axios');
const app = express();
const port = 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// PostgreSQL pool setup
// const pool = new Pool({
//   user: 'guru',
//   host: 'localhost',
//   database: 'db1',
//   port: 5432,
// });

// Redis client setup
// const redisClient = redis.createClient({
//   host: 'localhost',
//   port: 6379,  // default Redis port
// });

// redisClient.on('error', (error) => {
//   console.error('Redis connection error:', error);
// });

// redisClient.connect();  // Establish Redis connection

// Function to check Redis cache for data with tracing
// async function dTest(key) {
//   const tracer = trace.getTracer('default');
//   const span = tracer.startSpan(`dTest function - checking key: ${key}`);
  
//   try {
//     const data = await redisClient.get(key);
//     if (data) {
//       console.log(`Returning data for key "${key}" from Redis cache`);
//       return JSON.parse(data);
//     }
//     return null;
//   } catch (error) {
//     console.error('Error checking Redis cache:', error);
//     span.setStatus({ code: 2, message: error.message });
//     throw error;
//   } finally {
//     span.end(); // End the span to complete trace
//   }
// }

// GET endpoint to fetch data from PostgreSQL database with caching in Redis
// app.get('/data', async (req, res) => {
//   try {
//     // Use dTest function to check if data is cached in Redis
//     const cacheData = await dTest('data');
//     if (cacheData) {
//       return res.json(cacheData);
//     }

//     // If not in cache, query PostgreSQL
//     const result = await pool.query('SELECT * FROM users1 LIMIT 10');
    
//     // Cache the data in Redis with an expiration time (e.g., 1 hour)
//     await redisClient.set('data', JSON.stringify(result.rows), 'EX', 3600);

//     console.log('Returning data from PostgreSQL and caching it in Redis');
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// });

// app.get('/fetch-from-service-b', async (req, res) => {
//   try {
//     const response = await axios.get('http://localhost:3003/records');
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch data from Service B' });
//   }
// });

// // GET endpoint to fetch data from Redis by key, using dTest
// app.get('/cache/:key', async (req, res) => {
//   const { key } = req.params;
//   try {
//     const value = await dTest(key);  // Using dTest to check Redis
//     if (value) {
//       return res.json({ key, value });
//     }
//     res.status(404).json({ error: 'Key not found in cache' });
//   } catch (error) {
//     console.error('Error fetching data from Redis:', error);
//     res.status(500).json({ error: 'Failed to fetch data from cache' });
//   }
// });

// Basic test endpoint
app.get('/', async (req, res) => {
  res.send("hello world");
});

// Endpoint to kill the application
app.get('/kill', (req, res) => {
  res.send("Killing the application...");
  process.exit(0);  // Exit the application gracefully
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

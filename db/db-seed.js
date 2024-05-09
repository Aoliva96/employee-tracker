const dotenv = require("dotenv");
const mysql2 = require("mysql2");
const fs = require("fs");

// Load environment variables
dotenv.config();
const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Connect to db specified in the .env file
const db = mysql2.createConnection(
  {
    host: "localhost",
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  },
  console.log(`Attempting to seed data for ${DB_NAME}...`)
);
db.connect((err) => {
  if (err) throw err;
});

// Read the seed file
const seedsSql = fs.readFileSync("./db/seeds.sql", "utf8");

// Connect and seed the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");

  db.query(seedsSql, (err, results) => {
    if (err) {
      console.error("Error running file seeds.sql:", err);
      return;
    }
    console.log("File seeds.sql executed successfully");

    // Close the database connection
    db.end((err) => {
      if (err) {
        console.error("Error closing database connection:", err);
        return;
      }
      console.log("Database connection closed");
    });
  });
});

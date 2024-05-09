const dotenv = require("dotenv");
const mysql2 = require("mysql2");
const fs = require("fs");

// Load environment variables
dotenv.config();
const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Create connection to db
const db = mysql2.createConnection(
  { multipleStatements: true },
  {
    host: "localhost",
    port: 3306,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  },
  console.log(`Attempting to run schema file for ${DB_NAME}...`)
);

// Read the schema file
const schemaSql = fs.readFileSync("./db/schema.sql", "utf8");

// Connect and run schema file
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");

  db.query(schemaSql, (err, results) => {
    if (err) {
      console.error("Error running file schema.sql:", err);
      console.log("Results: ", results); // Debug
      return;
    }
    console.log("File schema.sql executed successfully");
    console.log("Results: ", results); // Debug

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

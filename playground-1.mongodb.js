/* global use, db */
// MongoDB Playground
// This script initializes the "sign_bridge" database and sets up the strict schema and indexes.

// 1. Switch to the target database (it will be created automatically if it doesn't exist)
use('sign_bridge');

// 2. Create the "users" collection (optional, as Mongo creates them on insert, 
//    but doing it explicitly allows you to add JSON schema validation if needed later)
db.createCollection('users');

// 3. Create a Unique Index on 'email'.
// This ensures that two users cannot sign up with the exact same email address,
// providing an extra layer of protection beneath your FastAPI logic.
db.getCollection('users').createIndex(
  { email: 1 }, 
  { unique: true, name: "unique_email_idx" }
);

// 4. (Optional) You can insert a test user right from here to test login later.
// Note: Passwords must be hashed via your FastAPI backend first to work authentically.
// To test auth properly, it's recommended to test via the `/signup` frontend page!

console.log("Database 'sign_bridge' initialized with unique index on 'users.email'!");

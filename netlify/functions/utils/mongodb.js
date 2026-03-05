const { MongoClient } = require("mongodb");

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

function getDatabase(client) {
  const dbName = process.env.MONGODB_DB_NAME || "rda_vedanta";
  return client.db(dbName);
}

module.exports = { connectToDatabase, getDatabase };

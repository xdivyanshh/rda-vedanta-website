const { connectToDatabase, getDatabase } = require("./utils/mongodb");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const client = await connectToDatabase();
    const db = getDatabase(client);
    const collection = db.collection("distributor_applications");

    const submissions = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ submissions }),
    };
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

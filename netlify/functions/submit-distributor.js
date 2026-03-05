const { connectToDatabase, getDatabase } = require("./utils/mongodb");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const { companyName, region, phoneNumber } = data;
    if (!companyName || !region || !phoneNumber) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }

    const client = await connectToDatabase();
    const db = getDatabase(client);
    const collection = db.collection("distributor_applications");

    const result = await collection.insertOne({
      companyName,
      region,
      phoneNumber,
      status: "pending",
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Application submitted successfully",
        id: result.insertedId,
      }),
    };
  } catch (error) {
    console.error("Error submitting distributor application:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

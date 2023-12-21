const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    // Generate a unique room_id (UUID)
    const room_id = uuidv4();

    console.log(event);
    const params = {
      TableName: "Room",
      Item: {
        room_id,
        capacity: event.capacity,
        location: event.location,
        room_name: event.room_name,
        room_type_id: event.room_type === "Spot booking" ? "1" : "2",
      },
      ReturnValues: "ALL_OLD",
    };

    console.log(params);

    const result = await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        room_id,
      }),
    };
  } catch (error) {
    console.error("Error creating room in DynamoDB", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        message: "An error occurred.",
      }),
    };
  }
};

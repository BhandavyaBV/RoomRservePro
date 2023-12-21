const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const params = {
      TableName: "Room",
    };

    const result = await dynamoDB.scan(params).promise();

    // Map room_type_id to room_type
    const mappedRooms = result.Items.map((room) => ({
      ...room,
      room_type: room.room_type_id === "1" ? "Spot Booking" : "Future Booking",
    }));

    return {
      statusCode: 200,
      body: {
        ok: true,
        rooms: mappedRooms,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error retrieving rooms from DynamoDB", error);

    return {
      statusCode: 500,
      body: {
        ok: false,
        message: "An error occurred.",
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};

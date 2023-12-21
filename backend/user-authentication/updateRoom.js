const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const { room_id, capacity, location, room_name, room_type } = event;

    const room_type_id = room_type === "Spot booking" ? "1" : "2";

    const params = {
      TableName: "Room",
      Key: { room_id },
      UpdateExpression:
        "SET #capacity = :capacity, #location = :location, #room_name = :room_name, #room_type_id = :room_type_id",
      ExpressionAttributeValues: {
        ":capacity": capacity,
        ":location": location,
        ":room_name": room_name,
        ":room_type_id": room_type_id,
      },
      ExpressionAttributeNames: {
        "#capacity": "capacity",
        "#location": "location",
        "#room_name": "room_name",
        "#room_type_id": "room_type_id",
      },
      ReturnValues: "ALL_NEW", // Return the updated item
    };

    const result = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: {
        ok: true,
        message: "Room updated successfully.",
        updatedRoom: result.Attributes,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error updating room in DynamoDB", error);

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

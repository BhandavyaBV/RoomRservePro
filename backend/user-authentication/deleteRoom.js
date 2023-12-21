const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const { room_id } = event;

    const params = {
      TableName: "Room",
      Key: { room_id },
    };

    await dynamoDB.delete(params).promise();

    return {
      statusCode: 200,
      body: {
        ok: false,
        message: "Room deleted successfully.",
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error deleting room from DynamoDB", error);

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

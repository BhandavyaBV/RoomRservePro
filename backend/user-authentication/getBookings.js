const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const params = {
      TableName: "bookings",
      FilterExpression: "#status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "BOOKED",
      },
    };

    const result = await dynamoDB.scan(params).promise();

    console.log(result);

    return {
      statusCode: 200,
      body: {
        ok: true,
        bookings: result.Items,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error:", error);

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

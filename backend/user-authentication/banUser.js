const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    console.log(event);
    // Extract userId from the event data
    const { email, isBanned } = event;

    // Toggle the value of isBanned
    const updatedIsBannedValue = !isBanned;

    // Update the row in DynamoDB
    const updateParams = {
      TableName: "RegisteredUser",
      Key: { email: email },
      UpdateExpression: "SET isBanned = :isBanned",
      ExpressionAttributeValues: {
        ":isBanned": updatedIsBannedValue,
      },
      ReturnValues: "ALL_NEW", // Return the updated item
    };

    const updateResult = await dynamoDB.update(updateParams).promise();

    return {
      statusCode: 200,
      body: {
        ok: true,
        isBanned: updateResult.Attributes.isBanned,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error(error);

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

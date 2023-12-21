const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const params = {
      TableName: "feedback",
    };

    const result = await dynamoDB.scan(params).promise();

    return {
      statusCode: 200,
      body: {
        ok: true,
        feedback: result.Items,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error retrieving feedback from DynamoDB", error);

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

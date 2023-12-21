import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";


const convertDynamoDBItemToRegularObject = (item) => {
  const regularObject = {};
  for (const key in item) {
    if (item[key].S !== undefined) {
      regularObject[key] = item[key].S;
    } else if (item[key].N !== undefined) {
      regularObject[key] = Number(item[key].N);
    } else if (item[key].BOOL !== undefined) {
      regularObject[key] = item[key].BOOL;
    } else if (item[key].NULL !== undefined) {
      regularObject[key] = null;
    }
    // Add more type conversions as needed (e.g., for L, M, etc.)
  }
  return regularObject;
};

export const handler = async (event) => {
  const client = new DynamoDBClient({ region: "us-east-1" }); // Your AWS region
  console.log(event);
  const { email } = JSON.parse(event.body); // Assuming the email is passed in the body of the request
  console.log("EMAIL", email);
  // DynamoDB QueryCommand parameters
  // Corrected DynamoDB QueryCommand parameters
  const params = {
    TableName: "RegisteredUser",
    KeyConditionExpression: "email = :emailValue",
    ExpressionAttributeValues: {
      ":emailValue": { S: email },
    },
    ProjectionExpression: "email, image, isVerified, #n, phoneNumber, universityId, userId,courseDescription",
    ExpressionAttributeNames: {
      "#n": "name"  // Alias for the reserved keyword 'name'
    },
  };
  try {
    // Query the table
    const command = new QueryCommand(params);
    const data = await client.send(command);
    const regularItems = data.Items.map(convertDynamoDBItemToRegularObject);

    return {
      statusCode: 200,
      body: JSON.stringify(regularItems),
    };
  } catch (error) {
    console.error("Error accessing DynamoDB:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

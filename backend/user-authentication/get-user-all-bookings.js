import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-1";
const TABLE_NAME = "bookings";
const INDEX_NAME = "user_id-index";

const client = new DynamoDBClient({ region: REGION });

const formatDynamoDBResponse = (items) => {
  return items.map(item => {
    const formattedItem = {};
    for (const key in item) {
      formattedItem[key] = Object.values(item[key])[0];
    }
    return formattedItem;
  });
};

export const handler = async (event) => {
  try {
    // const { userId } = JSON.parse(event.body);
    const userId = "hr765259@dal.ca"; // Example user ID
    const params = {
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      KeyConditionExpression: "user_id = :userId",
      ExpressionAttributeValues: {
        ":userId": { S: userId },
      },
    };

    const command = new QueryCommand(params);
    const response = await client.send(command);

    const formattedResponse = formatDynamoDBResponse(response.Items);

    return {
      statusCode: 200,
      body: JSON.stringify(formattedResponse),
    };
  } catch (error) {
    console.error("Error querying the DynamoDB table:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

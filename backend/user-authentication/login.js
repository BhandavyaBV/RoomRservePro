import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const convertDynamoDBJSONToRegularJSON = (dynamoDBObject)=> {
  const regularJSONObject = {};

  for (const key in dynamoDBObject) {
    if (!dynamoDBObject.hasOwnProperty(key)) continue;

    const value = dynamoDBObject[key];
    if (typeof value === 'object' && value !== null) {
      if ('S' in value) {
        regularJSONObject[key] = value.S;
      } else if ('N' in value) {
        regularJSONObject[key] = Number(value.N);
      } else if ('BOOL' in value) {
        regularJSONObject[key] = value.BOOL;
      } else if ('NULL' in value) {
        regularJSONObject[key] = null;
      } else if ('M' in value) {
        regularJSONObject[key] = convertDynamoDBJSONToRegularJSON(value.M);
      } else if ('L' in value) {
        regularJSONObject[key] = value.L.map(convertDynamoDBJSONToRegularJSON);
      }
    }
  }

  return regularJSONObject;
}

export const handler = async (event) => {
  let payload = JSON.parse(event.body)
  const client = new DynamoDBClient({ region: "us-east-1" });
  const TableName = "RegisteredUser";
  const params = {
    TableName,
    KeyConditionExpression: "email = :emailValue",
    ExpressionAttributeValues: {
      ":emailValue": { S: payload.email },
    },
  };

  try {
  const command = new QueryCommand(params);
  const data = await client.send(command);
  console.log("Fetched Item", data.Items[0]);
  if (data.Items && data.Items.length > 0) {
    const user = data.Items[0];
    
    // Check if the user is verified
    if (user.isVerified.BOOL) {
      // Compare the provided password with the stored password
      // In a real-world scenario, you would compare hashed passwords
      if (user.password.S === payload.password) {
        if(user?.isBanned.BOOL){
           return {
            statusCode: 400,
            body: JSON.stringify({
              message: 'User is Banned',
            }),
          };
        }
          if(!user.isVerified.BOOL){
            return {
            statusCode: 400,
            body: JSON.stringify({
              message: 'User Not Verified',
            }),
          };
          }
        
        
        const parsedObj = convertDynamoDBJSONToRegularJSON(user)
        delete parsedObj.password;
        delete parsedObj.otp
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Login successful',
            userDetails: parsedObj,
          }),
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Incorrect password' }),
        };
      }
    } else {
      return {
        statusCode: 403, // 403 Forbidden is typically used for unauthorized attempts
        body: JSON.stringify({ message: 'User not verified' }),
      };
    }
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'User not found' }),
    };
  }
} catch (error) {
  console.error("Error querying the table:", error);
  return {
    statusCode: 500,
    body: JSON.stringify({ message: 'Internal Server Error' }),
  };
}

};

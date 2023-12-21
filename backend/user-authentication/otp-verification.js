import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const REGION = "us-east-1";
const client = new DynamoDBClient({ region: REGION });
const tableName = 'RegisteredUser';

export const handler = async (event) => {
  console.log(event);
  const {email, otp} = JSON.parse(event.body)

  try {
    // Get the user's current OTP from the database
    const getCommand = new GetItemCommand({
      TableName: tableName,
      Key: {
        'email': { S: email }
      }
    });
    const { Item: userData } = await client.send(getCommand);
    console.log("Pulled user data is", userData);

    // Check if the provided OTP matches the stored OTP
    if (userData && userData.otp.N === otp) {
      // If it matches, update the `isVerified` field to `true`
      const updateCommand = new UpdateItemCommand({
        TableName: tableName,
        Key: {
          'email': { S: email }
        },
        UpdateExpression: 'set isVerified = :v, otp = :o',
        ExpressionAttributeValues: {
          ':v': { BOOL: true },
          ':o': { NULL: true } // Set otp to null
        },
      });
      await client.send(updateCommand);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'OTP verified successfully.' }),
      };
    } else {
      // If the OTPs do not match, return an error
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'OTP verification failed.' }),
      };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred while verifying OTP.', details: error.message }),
    };
  }
};

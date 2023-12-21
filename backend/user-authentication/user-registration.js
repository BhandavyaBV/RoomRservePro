import { DynamoDBClient, ListTablesCommand, PutItemCommand, QueryCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: 'us-east-1' });

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

const createTable = async () => {
  const REGION = "us-east-1";
  const TableName = "RegisteredUser";
  const client = new DynamoDBClient({ region: REGION });

  const params = {
    TableName,
    KeySchema: [
      { AttributeName: "email", KeyType: "HASH" } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: "email", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  const command = new CreateTableCommand(params);

  try {
    const data = await client.send(command);
    console.log("Table Created:", data);
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

const sendOTPEmail = async (email, otp) => {
  const params = {
    Source: 'harshstudy599@gmail.com', // Replace with your verified email
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: { Data: 'Your OTP' },
      Body: {
        Text: { Data: `Your OTP is: ${otp}` },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log('Email sent:', response.MessageId);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const submitUser = async (payload, otp) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  payload.otp = otp
  const TeamAnswerObj = {
    TableName: "RegisteredUser",
    Item: payload
  };
  const command = new PutCommand(TeamAnswerObj);
  
  let response = {};
  try {
    const result = await docClient.send(command);
    response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'User Registered Successfully!' }),
    };
    const emailResponse = await sendOTPEmail(payload.email, otp);
    console.log("EMAIL RESPONSE");
    console.log(emailResponse);
  } catch (error) {
    console.error('Error saving details:', error);
   response = {
      statusCode: 400,
      body: JSON.stringify({ message: 'Error Bad Request!' }),
    };
    throw error;
  }
    return response;
};

export const handler = async (event) => {
  try {
    console.log("HANDLER");
     console.log(event);
    let payload = JSON.parse(event.body);
     const otp = generateOTP();
    const result = await submitUser(payload, otp);
    console.log("RESULT", result);
     return result;
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message:'Internal Server Error'}),
    };
  }
};
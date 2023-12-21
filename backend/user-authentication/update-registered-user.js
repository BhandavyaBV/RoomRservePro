import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
    console.log(event);
    const {
        courseDescription,
        image,
        name,
        phoneNumber,
        email,
        universityId
    } = JSON.parse(event.body);

    let updateExpression = "SET";
    let expressionAttributeValues = {};
    let expressionAttributeNames = {};

    if (courseDescription) {
        updateExpression += " #courseDescription = :courseDescription,";
        expressionAttributeValues[":courseDescription"] = { S: courseDescription };
        expressionAttributeNames["#courseDescription"] = "courseDescription";
    }
    if (image) {
        updateExpression += " #image = :image,";
        expressionAttributeValues[":image"] = { S: image };
        expressionAttributeNames["#image"] = "image";
    }
    if (name) {
        updateExpression += " #name = :name,";
        expressionAttributeValues[":name"] = { S: name };
        expressionAttributeNames["#name"] = "name";
    }
    if (phoneNumber) {
        updateExpression += " #phoneNumber = :phoneNumber,";
        expressionAttributeValues[":phoneNumber"] = { S: phoneNumber };
        expressionAttributeNames["#phoneNumber"] = "phoneNumber";
    }
    if (universityId) {
        updateExpression += " #universityId = :universityId,";
        expressionAttributeValues[":universityId"] = { S: universityId };
        expressionAttributeNames["#universityId"] = "universityId";
    }

    // Remove trailing comma
    updateExpression = updateExpression.slice(0, -1);

    const params = {
        TableName: "RegisteredUser",
        Key: { "email": { S: email } },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "UPDATED_NEW"
    };

    try {
        const data = await dynamoDbClient.send(new UpdateItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Details Updated Successfully", data }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error updating record" }),
        };
    }
};
